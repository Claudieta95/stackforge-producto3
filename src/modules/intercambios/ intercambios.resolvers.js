import { obtenerBD } from "../../config/mongodb.js";

const TIPOS_PERMITIDOS = ["Ofrezco idioma", "Busco idioma"];

/**
 * Devuelve la colección de intercambios en MongoDB.
 * @returns {import("mongodb").Collection}
 */
function coleccionIntercambios() {
  return obtenerBD().collection("intercambios");
}

/**
 * Devuelve la colección de selecciones en MongoDB.
 * @returns {import("mongodb").Collection}
 */
function coleccionSelecciones() {
  return obtenerBD().collection("selecciones");
}

/**
 * Comprueba que el identificador sea un entero positivo.
 * @param {number} id
 * @throws {Error} Si el identificador no es válido.
 */
function validarId(id) {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("El identificador debe ser un número entero positivo.");
  }
}

/**
 * Valida el formato de un correo electrónico.
 * @param {string} email
 * @throws {Error} Si el email no tiene un formato válido.
 */
function validarEmail(email) {
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    throw new Error("El formato del correo electrónico no es válido.");
  }
}

/**
 * Valida el formato de fecha YYYY-MM-DD.
 * @param {string} fecha
 * @throws {Error} Si la fecha no es válida.
 */
function validarFecha(fecha) {
  if (typeof fecha !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(fecha.trim())) {
    throw new Error("La fecha debe tener el formato YYYY-MM-DD.");
  }
}

/**
 * Valida los datos de un intercambio según las reglas del Producto 2.
 * @param {Object} datos
 * @param {boolean} esCreacion - Indica si todos los campos son obligatorios.
 * @throws {Error} Si algún campo incumple las reglas de validación.
 */
function validarDatosIntercambio(datos, esCreacion = true) {
  if (!datos || typeof datos !== "object") {
    throw new Error("Los datos del intercambio son obligatorios.");
  }

  const { titulo, email, fecha, descripcion, tipo } = datos;

  if (esCreacion) {
    if (
      !titulo?.trim() ||
      !email?.trim() ||
      !fecha?.trim() ||
      !descripcion?.trim() ||
      !TIPOS_PERMITIDOS.includes(tipo)
    ) {
      throw new Error("Los datos del intercambio no son válidos.");
    }
  }

  if (titulo !== undefined && !titulo.trim()) {
    throw new Error("El título no puede estar vacío.");
  }

  if (email !== undefined) {
    validarEmail(email);
  }

  if (fecha !== undefined) {
    validarFecha(fecha);
  }

  if (descripcion !== undefined && !descripcion.trim()) {
    throw new Error("La descripción no puede estar vacía.");
  }

  if (tipo !== undefined && !TIPOS_PERMITIDOS.includes(tipo)) {
    throw new Error(`El tipo debe ser uno de los siguientes: ${TIPOS_PERMITIDOS.join(", ")}.`);
  }
}

/**
 * Genera el siguiente identificador numérico entero positivo único para intercambios.
 * Utiliza una colección auxiliar 'counters' con operación atómica en MongoDB.
 * @returns {Promise<number>}
 */
async function generarSiguienteIdIntercambio() {
  const resultado = await obtenerBD()
    .collection("counters")
    .findOneAndUpdate(
      { _id: "intercambios" },
      { $inc: { seq: 1 } },
      { upsert: true, returnDocument: "after" }
    );

  return resultado.seq;
}

/**
 * Crea el índice único sobre el campo id de intercambios y sincroniza el contador.
 * Puede ejecutarse varias veces sin duplicar índices.
 */
export async function prepararIntercambios() {
  const coleccion = coleccionIntercambios();
  await coleccion.createIndex({ id: 1 }, { unique: true });

  // Sincroniza el contador con el ID máximo existente en la colección
  const ultimo = await coleccion
    .find({}, { projection: { _id: 0, id: 1 } })
    .sort({ id: -1 })
    .limit(1)
    .toArray();

  const maxIdActual = ultimo.length > 0 ? ultimo[0].id : 0;

  await obtenerBD()
    .collection("counters")
    .updateOne(
      { _id: "intercambios" },
      { $max: { seq: maxIdActual } },
      { upsert: true }
    );
}

/**
 * Resolvers GraphQL del módulo de intercambios.
 */
export const intercambiosResolvers = {
  /**
   * Obtiene todos los intercambios ordenados por id ascendente.
   * @returns {Promise<Array>}
   */
  intercambios: async () => {
    return coleccionIntercambios()
      .find({}, { projection: { _id: 0 } })
      .sort({ id: 1 })
      .toArray();
  },

  /**
   * Busca un intercambio por su identificador numérico.
   * @param {{id: number}} args
   * @returns {Promise<Object|null>}
   */
  intercambio: async ({ id }) => {
    validarId(id);

    return coleccionIntercambios().findOne(
      { id },
      { projection: { _id: 0 } }
    );
  },

  /**
   * Crea un nuevo intercambio con identificador numérico único.
   * @param {{datos: Object}} args
   * @returns {Promise<Object>}
   */
  crearIntercambio: async ({ datos }) => {
    validarDatosIntercambio(datos, true);

    const nuevoId = await generarSiguienteIdIntercambio();
    const nuevoIntercambio = {
      id: nuevoId,
      titulo: datos.titulo.trim(),
      email: datos.email.trim().toLowerCase(),
      fecha: datos.fecha.trim(),
      descripcion: datos.descripcion.trim(),
      tipo: datos.tipo
    };

    await coleccionIntercambios().insertOne(nuevoIntercambio);
    return nuevoIntercambio;
  },

  /**
   * Actualiza los campos indicados de un intercambio existente.
   * @param {{id: number, datos: Object}} args
   * @returns {Promise<Object>}
   */
  actualizarIntercambio: async ({ id, datos }) => {
    validarId(id);
    validarDatosIntercambio(datos, false);

    const camposActualizar = {};
    if (datos.titulo !== undefined) camposActualizar.titulo = datos.titulo.trim();
    if (datos.email !== undefined) camposActualizar.email = datos.email.trim().toLowerCase();
    if (datos.fecha !== undefined) camposActualizar.fecha = datos.fecha.trim();
    if (datos.descripcion !== undefined) camposActualizar.descripcion = datos.descripcion.trim();
    if (datos.tipo !== undefined) camposActualizar.tipo = datos.tipo;

    if (Object.keys(camposActualizar).length === 0) {
      throw new Error("Debe indicar al menos un campo para actualizar.");
    }

    const actualizado = await coleccionIntercambios().findOneAndUpdate(
      { id },
      { $set: camposActualizar },
      { returnDocument: "after", projection: { _id: 0 } }
    );

    if (!actualizado) {
      throw new Error(`No existe ningún intercambio con id ${id}.`);
    }

    return actualizado;
  },

  /**
   * Elimina un intercambio por su identificador y borra su selección asociada.
   * @param {{id: number}} args
   * @returns {Promise<boolean>}
   */
  eliminarIntercambio: async ({ id }) => {
    validarId(id);

    const resultado = await coleccionIntercambios().deleteOne({ id });

    if (resultado.deletedCount === 0) {
      return false;
    }

    // Tarea 10: Eliminar también la selección asociada directamente en MongoDB
    await coleccionSelecciones().deleteMany({ idIntercambio: id });

    return true;
  },

  /**
   * Inicializa los intercambios de demostración del Producto 2 evitando duplicados.
   * @returns {Promise<Array>}
   */
  inicializarIntercambiosEjemplo: async () => {
    const coleccion = coleccionIntercambios();
    const total = await coleccion.countDocuments();

    if (total === 0) {
      const ejemplos = [
        {
          titulo: "Intercambio de español por inglés",
          email: "maria@email.com",
          fecha: "2026-10-14",
          descripcion: "Ofrezco practicar español a cambio de inglés.",
          tipo: "Ofrezco idioma"
        },
        {
          titulo: "Intercambio de francés por español",
          email: "laura@email.com",
          fecha: "2026-10-14",
          descripcion: "Busco a alguien con quien practicar español y puedo ayudarle con francés.",
          tipo: "Busco idioma"
        }
      ];

      for (const ejemplo of ejemplos) {
        const id = await generarSiguienteIdIntercambio();
        await coleccion.insertOne({ id, ...ejemplo });
      }
    }

    return coleccion
      .find({}, { projection: { _id: 0 } })
      .sort({ id: 1 })
      .toArray();
  }
};

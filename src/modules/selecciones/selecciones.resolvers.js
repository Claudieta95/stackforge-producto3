import { obtenerBD } from "../../config/mongodb.js";

/**
 * Devuelve la colección de selecciones.
 * @returns {import("mongodb").Collection}
 */
function coleccionSelecciones() {
  return obtenerBD().collection("selecciones");
}

/**
 * Comprueba que el identificador sea un entero positivo.
 * @param {number} idIntercambio
 * @throws {Error} Si el identificador no es válido.
 */
function validarId(idIntercambio) {
  if (!Number.isSafeInteger(idIntercambio) || idIntercambio <= 0) {
    throw new Error("El identificador debe ser un número entero positivo.");
  }
}

/**
 * Crea un índice único para impedir selecciones duplicadas.
 * Puede ejecutarse varias veces sin crear índices adicionales.
 */
export async function prepararSelecciones() {
  await coleccionSelecciones().createIndex(
    { idIntercambio: 1 },
    { unique: true }
  );
}

/**
 * Resolvers GraphQL del módulo de selecciones.
 */
export const seleccionesResolvers = {
  /**
   * Obtiene todas las selecciones.
   * @returns {Promise<Array>}
   */
  selecciones: async () => {
    return coleccionSelecciones()
      .find({}, { projection: { _id: 0, idIntercambio: 1 } })
      .sort({ idIntercambio: 1 })
      .toArray();
  },

  /**
   * Busca una selección por su identificador.
   * @param {{idIntercambio: number}} args
   */
  seleccion: async ({ idIntercambio }) => {
    validarId(idIntercambio);

    return coleccionSelecciones().findOne(
      { idIntercambio },
      { projection: { _id: 0, idIntercambio: 1 } }
    );
  },

  /**
   * Guarda una selección sin generar duplicados.
   * @param {{idIntercambio: number}} args
   */
  guardarSeleccion: async ({ idIntercambio }) => {
    validarId(idIntercambio);

    const coleccion = coleccionSelecciones();

    try {
      await coleccion.updateOne(
        { idIntercambio },
        { $setOnInsert: { idIntercambio } },
        { upsert: true }
      );
    } catch (error) {
      if (error.code !== 11000) {
        throw error;
      }
      // Si otra petición insertó el mismo ID, ya está guardado.
    }

    return { idIntercambio };
  },

  /**
   * Elimina una selección.
   * @param {{idIntercambio: number}} args
   * @returns {Promise<boolean>}
   */
  eliminarSeleccion: async ({ idIntercambio }) => {
    validarId(idIntercambio);

    const resultado = await coleccionSelecciones().deleteOne({
      idIntercambio
    });

    return resultado.deletedCount === 1;
  }
};

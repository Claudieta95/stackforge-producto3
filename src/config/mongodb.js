import { MongoClient } from "mongodb";

let cliente;
let baseDatos;

/**
 * Establece la conexión con MongoDB.
 * Reutiliza la conexión para todos los módulos.
 *
 * @returns {Promise<import("mongodb").Db>}
 */
export async function conectarMongoDB() {
  if (baseDatos) {
    return baseDatos;
  }

  const uri = process.env.MONGODB_URI;
  const nombreBD = process.env.DB_NAME;

  if (!uri || !nombreBD) {
    throw new Error(
      "Faltan MONGODB_URI o DB_NAME en las variables de entorno."
    );
  }

  cliente = new MongoClient(uri);

  try {
    await cliente.connect();
    baseDatos = cliente.db(nombreBD);
    await baseDatos.command({ ping: 1 });

    console.log("Conexión con MongoDB establecida.");
    return baseDatos;
  } catch (error) {
    await cliente.close();
    cliente = undefined;
    throw error;
  }
}

/**
 * Devuelve la base de datos conectada.
 *
 * @returns {import("mongodb").Db}
 */
export function obtenerBD() {
  if (!baseDatos) {
    throw new Error("MongoDB todavía no está conectado.");
  }

  return baseDatos;
}

/**
 * Cierra la conexión con MongoDB.
 */
export async function cerrarMongoDB() {
  if (cliente) {
    await cliente.close();
  }

  cliente = undefined;
  baseDatos = undefined;
}

/**
 * Definiciones GraphQL del módulo de selecciones.
 * Adaptadas a las operaciones del Producto 2.
 */
export const seleccionesTypeDefs = {
  tipos: [
    `
    type Seleccion {
      idIntercambio: Int!
    }
    `
  ],

  consultas: [
    "selecciones: [Seleccion!]!",
    "seleccion(idIntercambio: Int!): Seleccion"
  ],

  mutaciones: [
    "guardarSeleccion(idIntercambio: Int!): Seleccion!",
    "eliminarSeleccion(idIntercambio: Int!): Boolean!"
  ]
};

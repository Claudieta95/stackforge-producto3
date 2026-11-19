/**
 * Definiciones GraphQL del módulo de intercambios.
 * Adaptadas a las operaciones del Producto 2.
 */
export const intercambiosTypeDefs = {
  tipos: [
    `
    type Intercambio {
      id: Int!
      titulo: String!
      email: String!
      fecha: String!
      descripcion: String!
      tipo: String!
    }

    input IntercambioInput {
      titulo: String!
      email: String!
      fecha: String!
      descripcion: String!
      tipo: String!
    }

    input ActualizarIntercambioInput {
      titulo: String
      email: String
      fecha: String
      descripcion: String
      tipo: String
    }
    `
  ],

  consultas: [
    "intercambios: [Intercambio!]!",
    "intercambio(id: Int!): Intercambio"
  ],

  mutaciones: [
    "crearIntercambio(datos: IntercambioInput!): Intercambio!",
    "actualizarIntercambio(id: Int!, datos: ActualizarIntercambioInput!): Intercambio!",
    "eliminarIntercambio(id: Int!): Boolean!",
    "inicializarIntercambiosEjemplo: [Intercambio!]!"
  ]
};

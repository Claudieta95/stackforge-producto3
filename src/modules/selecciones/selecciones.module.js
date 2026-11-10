import { seleccionesTypeDefs } from "./selecciones.typeDefs.js";
import { seleccionesResolvers } from "./selecciones.resolvers.js";

/**
 * Módulo de selecciones para el esquema GraphQL común.
 */
export const seleccionesModulo = {
  tipos: seleccionesTypeDefs.tipos,
  consultas: seleccionesTypeDefs.consultas,
  mutaciones: seleccionesTypeDefs.mutaciones,
  resolvers: seleccionesResolvers
};

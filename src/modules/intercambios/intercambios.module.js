import { intercambiosTypeDefs } from "./intercambios.typeDefs.js";
import { intercambiosResolvers } from "./intercambios.resolvers.js";

/**
 * Módulo de intercambios para el esquema GraphQL común.
 */
export const intercambiosModulo = {
  tipos: intercambiosTypeDefs.tipos,
  consultas: intercambiosTypeDefs.consultas,
  mutaciones: intercambiosTypeDefs.mutaciones,
  resolvers: intercambiosResolvers
};

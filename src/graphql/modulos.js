import { buildSchema } from "graphql";

/**
 * Construye el esquema GraphQL a partir de los módulos disponibles.
 * Cada módulo puede aportar tipos, consultas, mutaciones y resolvers.
 */
export function crearEsquemaModular(modulos = []) {
  const tipos = [];
  const consultas = [
    "estado: String!"
  ];
  const mutaciones = [];
  const resolvers = {
    estado: () => "GraphQL de StackForge funcionando correctamente"
  };

  for (const modulo of modulos) {
    tipos.push(...(modulo.tipos || []));
    consultas.push(...(modulo.consultas || []));
    mutaciones.push(...(modulo.mutaciones || []));
    Object.assign(resolvers, modulo.resolvers || {});
  }

  const definiciones = `
    ${tipos.join("\n")}

    type Query {
      ${consultas.join("\n")}
    }

    ${mutaciones.length > 0 ? `
      type Mutation {
        ${mutaciones.join("\n")}
      }
    ` : ""}
  `;

  return {
    schema: buildSchema(definiciones),
    root: resolvers
  };
}

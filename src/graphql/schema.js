import { crearEsquemaModular } from "./modulos.js";
import { seleccionesModulo } from "../modules/selecciones/selecciones.module.js";

// Módulos disponibles de la aplicación.
const modulos = [
  seleccionesModulo
];

export const { schema, root } = crearEsquemaModular(modulos);

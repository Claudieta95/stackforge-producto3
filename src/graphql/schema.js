import { crearEsquemaModular } from "./modulos.js";
import { seleccionesModulo } from "../modules/selecciones/selecciones.module.js";
import { intercambiosModulo } from "../modules/intercambios/intercambios.module.js"

// Módulos disponibles de la aplicación.
const modulos = [
  seleccionesModulo,
  intercambiosModulo
];

export const { schema, root } = crearEsquemaModular(modulos);

import { crearEsquemaModular } from "./modulos.js";
import { seleccionesModulo } from "../modules/selecciones/selecciones.module.js";
import { usuariosModulo } from "../modules/usuarios/usuarios.module.js";


// Módulos disponibles de la aplicación.
const modulos = [
  seleccionesModulo,
  usuariosModulo
];

export const { schema, root } = crearEsquemaModular(modulos);

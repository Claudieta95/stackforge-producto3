import { crearEsquemaModular } from "./modulos.js";
import { seleccionesModulo } from "../modules/selecciones/selecciones.module.js";
import { intercambiosModulo } from "../modules/intercambios/intercambios.module.js"
import { usuariosModulo } from "../modules/usuarios/usuarios.module.js";


// Módulos disponibles de la aplicación.
const modulos = [
  seleccionesModulo,
  intercambiosModulo,
  usuariosModulo
];

export const { schema, root } = crearEsquemaModular(modulos);

import { timingSafeEqual } from "node:crypto";

export function comprobarAdmin(req, res, next) {
  const tokenConfigurado = process.env.ADMIN_TOKEN;
  const autorizacion = req.headers.authorization;

  if (!tokenConfigurado) {
    return res.status(500).json({
      error: "La autenticación administrativa no está configurada."
    });
  }

  if (!autorizacion?.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Se requiere autenticación administrativa."
    });
  }

  const tokenRecibido = autorizacion.slice(7);
  const esperado = Buffer.from(tokenConfigurado);
  const recibido = Buffer.from(tokenRecibido);

  if (
    esperado.length !== recibido.length ||
    !timingSafeEqual(esperado, recibido)
  ) {
    return res.status(401).json({
      error: "Credenciales administrativas incorrectas."
    });
  }

  next();
}

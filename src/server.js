import "dotenv/config";
import express from "express";
import { conectarMongoDB, cerrarMongoDB } from "./config/mongodb.js";
import { createHandler } from "graphql-http/lib/use/express";
import { schema, root } from "./graphql/schema.js";
import { comprobarAdmin } from "./auth/adminAuth.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.all("/graphql", comprobarAdmin, createHandler({
  schema,
  rootValue: root
}));


app.get("/", (req, res) => {
  res.json({
    mensaje: "Backend de StackForge funcionando correctamente"
  });
});

app.get("/admin/comprobar", comprobarAdmin, (req, res) => {
  res.json({
    mensaje: "Autenticación administrativa correcta"
  });
});

async function iniciarServidor() {
  try {
    await conectarMongoDB();

    const servidor = app.listen(PORT, () => {
      console.log(`Servidor iniciado en http://localhost:${PORT}`);
    });

    async function apagarServidor() {
      servidor.close(async () => {
        await cerrarMongoDB();
        process.exit(0);
      });
    }

    process.on("SIGINT", apagarServidor);
    process.on("SIGTERM", apagarServidor);

  } catch (error) {
    console.error("Error al iniciar el servidor:", error.message);
    process.exit(1);
  }
}

iniciarServidor();

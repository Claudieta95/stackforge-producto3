import { obtenerBD } from "../../config/mongodb.js";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";

/**
 * Módulo GraphQL para la gestión de usuarios.
 * Define los tipos, consultas, mutaciones y resolvers.
 */

export const usuariosModulo = {
    tipos: [
    `
    type Usuario {
        id: ID!
        nombre: String!
        email: String!
    }
    input CrearUsuarioInput {
        nombre: String!
        email: String!
        password: String!
    }
    input ActualizarUsuarioInput {
        nombre: String
        email: String
        password: String
    }
    `
    ],
    consultas: [
        "usuarios: [Usuario!]!",
        "usuario(email: String!): Usuario"
    ],
    mutaciones: [
        "crearUsuario(input: CrearUsuarioInput!): Usuario!",
        "actualizarUsuario(id: ID!, input: ActualizarUsuarioInput!): Usuario",
        "eliminarUsuario(id: ID!): Boolean!"
    ],

    resolvers: {
        usuarios: async () => {
            const db = obtenerBD();

            const usuarios = await db
                .collection("usuarios")
                .find({})
                .toArray();

            return usuarios.map((usuario) => ({
                id: usuario._id.toString(),
                nombre: usuario.nombre,
                email: usuario.email
            }));
        },

        usuario: async ({ email }) => {
            const db = obtenerBD();

            // Buscar el usuario por su correo electrónico
            const usuario = await db.collection("usuarios").findOne({
                email: email.trim().toLowerCase()
            });

            // Si no existe, devolver null
            if (!usuario) {
                return null;
            }

            // Devolver los datos sin la contraseña
            return {
                id: usuario._id.toString(),
                nombre: usuario.nombre,
                email: usuario.email
            };
        },

        crearUsuario: async ({ input }) => {
            const db = obtenerBD();
            const coleccion = db.collection("usuarios");

            // Garantizar que cada correo electrónico sea único
            await coleccion.createIndex(
                { email: 1 },
                { unique: true },
                {}
            );

            const nombre = input.nombre?.trim();
            const email = input.email?.trim().toLowerCase();
            const password = input.password;

            // Validar los datos obligatorios
            if (!nombre || !email || !password?.trim()) {
                throw new Error("Todos los campos son obligatorios.");
            }

            // Validar el formato del correo electrónico
            const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!formatoEmail.test(email)) {
                throw new Error("El correo electrónico no es válido.");
            }

            // Evitar registros con correos duplicados
            const usuarioExistente = await coleccion.findOne({ email });

            if (usuarioExistente) {
                throw new Error("Ya existe un usuario con este correo electrónico.");
            }

            // Proteger la contraseña
            const passwordHash = await bcrypt.hash(password, 12);

            // Guardar el usuario en MongoDB
            const resultado = await coleccion.insertOne({
                nombre,
                email,
                password: passwordHash
            });

            // Devolver los datos sin la contraseña
            return {
                id: resultado.insertedId.toString(),
            nombre,
            email
            };
        },

        actualizarUsuario: async ({ id, input }) => {
            const db = obtenerBD();
            const coleccion = db.collection("usuarios");

            // Validar el identificador
            if (!ObjectId.isValid(id)) {
                throw new Error("El identificador del usuario no es válido.");
            }

            const _id = new ObjectId(id);

            // Comprobar que el usuario existe
            const usuario = await coleccion.findOne({ _id });

            if (!usuario) {
                return null;
            }

            const cambios = {};

            // Actualizar el nombre
            if (input.nombre !== undefined) {
                const nombre = input.nombre?.trim();

                if (!nombre) {
                    throw new Error("El nombre no puede estar vacío.");
                }

                cambios.nombre = nombre;
            }

            // Actualizar el correo electrónico
            if (input.email !== undefined) {
                const email = input.email?.trim().toLowerCase();

                if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    throw new Error("El correo electrónico no es válido.");
                }

                cambios.email = email;
            }

            // Actualizar la contraseña
            if (input.password !== undefined) {
                if (!input.password?.trim()) {
                    throw new Error("La contraseña no puede estar vacía.");
                }

                cambios.password = await bcrypt.hash(input.password, 12);
            }

            // Guardar los cambios
            if (Object.keys(cambios).length > 0) {
                try {
                    await coleccion.updateOne(
                    { _id },
                    { $set: cambios }
                    );
                } catch (error) {
                    if (error.code === 11000) {
                    throw new Error("Ya existe un usuario con este correo electrónico.");
                    }

                    throw error;  
                }
            }

            // Obtener el usuario actualizado
            const actualizado = await coleccion.findOne({ _id });

            return {
                id: actualizado._id.toString(),
                nombre: actualizado.nombre,
                email: actualizado.email
            };
        },

        eliminarUsuario: async ({ id }) => {
            const db = obtenerBD();
            const coleccion = db.collection("usuarios");

            // Validar el identificador
            if (!ObjectId.isValid(id)) {
                throw new Error("El identificador del usuario no es válido.");
            }

            // Eliminar el usuario de MongoDB
            const resultado = await coleccion.deleteOne({
                _id: new ObjectId(id)
            });

            // Devolver true si se ha eliminado
            return resultado.deletedCount === 1;
        }
    }
};
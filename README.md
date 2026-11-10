# StackForge - Producto 3

## Sirviendo datos con GraphQL y MongoDB

Plataforma de intercambio de idiomas.

Proyecto de Desarrollo Full Stack con JavaScript (FP066) - UOC.

### Descripción

Este proyecto adapta la lógica de almacenamiento del Producto 2
a un servicio web backend desarrollado con Node.js, ExpressJS
y GraphQL.

La información se almacena de forma persistente en MongoDB,
utilizando el controlador oficial de Node.js, sin Mongoose.

La API permite gestionar usuarios, intercambios lingüísticos
y selecciones del dashboard mediante consultas y mutaciones GraphQL.

El funcionamiento del backend se comprueba mediante Postman,
sin necesidad de ejecutar el frontend.

### Tecnologías

- JavaScript
- Node.js
- ExpressJS
- GraphQL
- MongoDB Atlas
- MongoDB Node.js Driver
- Postman
- Git y GitHub
- JSDoc

### Funcionalidades

**Gestión de usuarios**
- Crear, consultar, actualizar y eliminar usuarios.
- Validar los datos y evitar correos duplicados.
- Almacenar las contraseñas de forma segura.
- Gestionar la autenticación administrativa.

**Gestión de intercambios**
- Crear, consultar, actualizar y eliminar intercambios.
- Validar los campos y los tipos de intercambio.
- Gestionar las selecciones asociadas al eliminar intercambios.

**Gestión de selecciones**
- Guardar selecciones de intercambios.
- Consultar todas las selecciones o una selección concreta.
- Eliminar selecciones.
- Evitar registros duplicados.
- Mantener la información persistente en MongoDB.

### Arquitectura

El servidor utiliza ExpressJS y expone una API GraphQL
a través del endpoint `/graphql`.

La aplicación se organiza en tres módulos:
usuarios, intercambios y selecciones.

Cada módulo define sus tipos GraphQL, consultas, mutaciones
y resolvers. El esquema principal integra las operaciones
de los tres módulos.

La persistencia se realiza mediante MongoDB, sin Mongoose.

### Estructura del proyecto

```text
stackforge-producto3/
├── css/
│   └── styles.css
├── js/
│   ├── almacenaje.js
│   ├── dashboard.js
│   ├── datos.js
│   ├── intercambios.js
│   ├── login.js
│   └── usuarios.js
├── index.html
├── login.html
├── usuarios.html
├── intercambios.html
├── src/
│   ├── config/
│   │   └── mongodb.js
│   ├── graphql/
│   │   └── schema.js
│   ├── modules/
│   │   ├── usuarios/
│   │   │   ├── typeDefs.js
│   │   │   └── resolvers.js
│   │   ├── intercambios/
│   │   │   ├── typeDefs.js
│   │   │   └── resolvers.js
│   │   └── selecciones/
│   │       ├── typeDefs.js
│   │       └── resolvers.js
│   └── server.js
├── postman/
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

Los archivos HTML, CSS y JavaScript originales corresponden
al frontend del Producto 2. Se conservan como referencia
para la integración full stack del producto final.

El backend del Producto 3 se desarrolla en `src/`
y funciona sin utilizar las páginas HTML.

### Instalación

Requisitos:
- Node.js y npm.
- Acceso a MongoDB Atlas.
- Postman.

Clonar el repositorio e instalar las dependencias:

```bash
npm install
```

Crear un archivo `.env` a partir de `.env.example`:

```env
PORT=4000
MONGODB_URI=URI_DE_CONEXION_MONGODB
DB_NAME=stackforge_producto3
```

Las credenciales reales no deben incluirse en GitHub.

### Ejecución

Iniciar el servidor:

```bash
npm start
```

Endpoint local:

```text
http://localhost:4000/graphql
```

### API GraphQL

La API utiliza Type, Query y Mutation para consultar
y modificar los datos.

**Usuarios**

Consultas:
- `usuarios`
- `usuario(email)`

Mutaciones:
- `crearUsuario`
- `actualizarUsuario`
- `eliminarUsuario`

**Intercambios**

Consultas:
- `intercambios`
- `intercambio(id)`

Mutaciones:
- `crearIntercambio`
- `actualizarIntercambio`
- `eliminarIntercambio`

**Selecciones**

Consultas:
- `selecciones`
- `seleccion(idIntercambio)`

Mutaciones:
- `guardarSeleccion`
- `eliminarSeleccion`

### Ejemplo de consulta GraphQL

```graphql
query {
  selecciones {
    idIntercambio
  }
}
```

### Ejemplo de mutación GraphQL

```graphql
mutation {
  guardarSeleccion(idIntercambio: 1) {
    idIntercambio
  }
}
```

### Persistencia con MongoDB

La base de datos `stackforge_producto3` contiene
las siguientes colecciones:

- `usuarios`
- `intercambios`
- `selecciones`

Se utiliza el controlador oficial de MongoDB para Node.js,
sin Mongoose.

Las operaciones incluyen validaciones, control de duplicados
y gestión de errores.

### Pruebas con Postman

Las consultas y mutaciones se prueban mediante Postman
contra el endpoint GraphQL.

Se comprueban:
- Consultas de registros.
- Creación y actualización de datos.
- Eliminación de registros.
- Validaciones y control de duplicados.
- Gestión de errores.
- Persistencia en MongoDB.
- Autenticación administrativa.

### Seguridad

- Credenciales almacenadas en variables de entorno.
- Contraseñas protegidas mediante hash seguro.
- Validación de datos.
- Gestión de errores.
- Autenticación administrativa.
- Exclusión de `node_modules` y `.env` del repositorio.

### Organización del trabajo

El desarrollo se organiza en ramas independientes:

- `feature/selecciones`
- `feature/usuarios`
- `feature/intercambios`

Los módulos se integran posteriormente en `main`.

### Integrantes

- Claudia Maldonado
- Anna Ryabovich
- Rafael Prats

### Entrega

**Producto 3 - Sirviendo datos con GraphQL y MongoDB**

Fecha de entrega: 30 de noviembre de 2026.

La entrega incluye la documentación del proyecto,
el repositorio GitHub, el código fuente,
las pruebas del backend, el vídeo explicativo
y el despliegue del servicio web.

### Continuidad del proyecto

Los archivos del frontend del Producto 2 se conservan
para facilitar su integración con el backend
en el producto final.

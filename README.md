# Proyecto Backend

Este proyecto es un backend desarrollado con Node.js, Express y Sequelize, siguiendo el patrón de diseño MVC.  
Incluye conexión a base de datos MySQL, autenticación básica de usuarios y pruebas con Jest + Supertest.


## Características
- Arquitectura basada en MVC (Model - View - Controller).
- Conexión a base de datos MySQL usando Sequelize ORM.
- Rutas para manejo de usuarios (login y registro).
- Pruebas unitarias y de integración con Jest y Supertest.
- Manejo de variables de entorno con dotenv.


## Estructura del proyecto
proyecto_par/
│── config/ # Configuración de base de datos
│── controllers/ # Controladores (lógica de negocio)
│── models/ # Modelos Sequelize
│── routes/ # Rutas del backend
│── tests/ # Pruebas (Jest + Supertest)
│── app.js # Configuración principal de Express
│── package.json # Dependencias y scripts
│── .env # Variables de entorno
│── README.md # Documentación del proyecto


- Node.js (v16 o superior recomendado)
- MySQL instalado y corriendo en el puerto `3306`
- npm  para gestionar dependencias

---

# Instalación
1. Clona el repositorio:
   git bash.
   git clone el repositorio .
   cd proyecto_par.
2. instalar dependencias:
   - npm install.
3. env.
   DB_NAME=tienda_v1
   DB_USER=root
   DB_PASS=root
   DB_HOST=localhost
   DB_PORT=3306
4. Ejecucion del servidor.
   npm start
   //si todo ejecuta bien te aparece los siguientes mensajes
   - Conexión a la base de datos exitosa
   - Tablas sincronizadas
5. Para las pruebas tienes que ejecutar el sigueinte comando.
   . npm test
6. Para hacer las pruebas con postman se necesita lo siguientes
   -  http://localhost:3000/users/login. // todos con  raw y json este para login
   -  http://localhost:3000/users/registro. // todos con  raw y json este para registro
     PARA REGISTRO USAR ESTO:
   {
  "username": "juan",
  "password": "duros"
}
Puede ser cualquier nombre igual te lo guarda en el mysql.
  





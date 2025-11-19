// config/database.js
'use strict';
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME, // nombre de la BD
  process.env.DB_USER, // usuario
  process.env.DB_PASS, // contraseña
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
  }

);

// Prueba de conexión
(async () => {
  try {
    await sequelize.authenticate();
    console.log(' Conectado correctamente a la base de datos MySQL');
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
  }
})();

module.exports = sequelize;

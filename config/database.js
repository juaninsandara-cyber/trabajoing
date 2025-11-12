// config/database.js
require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
<<<<<<< HEAD
  process.env.DB_PASS,
=======
  process.env.DB_PASSWORD,
>>>>>>> c786a63 (feat: deploy secure API with authentication, rate limiting, and security measures)
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
<<<<<<< HEAD
    logging: false, // quita logs de SQL en consola
=======
    logging: false,
>>>>>>> c786a63 (feat: deploy secure API with authentication, rate limiting, and security measures)
  }
);

module.exports = sequelize;

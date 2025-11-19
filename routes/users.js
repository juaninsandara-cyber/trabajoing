

// Controladores
const userController = require('../controllers/userController');
const ingresoController = require('../controllers/ingresoController');

// Ruta base de prueba
router.get('/', (req, res) => {
  res.send('API funcionando correctamente en /users');
});

//  Rutas de autenticación

var express = require('express');
var router = express.Router();

const ingresoController = require('../controllers/ingresoController');

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de usuarios y accesos
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Verificar conexión del endpoint
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Respuesta de prueba del endpoint.
 */
router.get('/', function(req, res) {
  res.send('SAUVE ESA PARTE');
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Iniciar sesión de un usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       401:
 *         description: Credenciales incorrectas
 */
router.post('/login', userController.login);

/**
 * @swagger
 * /users/registro:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               documento:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 */
router.post('/registro', userController.register);

// Rutas de ingreso/salida
/**
 * @swagger
 * /users/ingreso:
 *   post:
 *     summary: Registrar ingreso de vehículo o usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               documento:
 *                 type: string
 *               placa:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ingreso registrado
 */
router.post('/ingreso', ingresoController.registrarIngreso);

/**
 * @swagger
 * /users/salida:
 *   post:
 *     summary: Registrar salida de vehículo o usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               documento:
 *                 type: string
 *               placa:
 *                 type: string
 *     responses:
 *       200:
 *         description: Salida registrada
 */
router.post('/salida', ingresoController.registrarSalida);

module.exports = router;





// routes/users.js
const express = require('express');
const router = express.Router();

// Controladores
const userController = require('../controllers/userController');
const ingresoController = require('../controllers/ingresoController');

// Ruta base de prueba
router.get('/', (req, res) => {
  res.send('API funcionando correctamente en /users');
});

//  Rutas de autenticación
router.post('/login', userController.login);
router.post('/registro', userController.register);

// Rutas de ingreso/salida
router.post('/ingreso', ingresoController.registrarIngreso);
router.post('/salida', ingresoController.registrarSalida);

module.exports = router;

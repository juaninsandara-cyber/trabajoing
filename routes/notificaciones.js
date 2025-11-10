// routes/notificacionRoutes.js
const express = require('express');
const router = express.Router();
const notificacionController = require('../controllers/notificacionController');

// Verificar ocupación y notificar automáticamente
// router.get('/verificar-ocupacion', notificacionController.verificarYNotificarOcupacion);

// Ver estado actual del parqueadero
// router.get('/estado-parqueadero', notificacionController.getEstadoParqueadero);
// prueba
router.get('/prueba-correo', notificacionController.pruebaEnvioCorreo);

module.exports = router;
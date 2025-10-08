const express = require('express');
const router = express.Router();
const activosController = require('../controllers/activosController');

// Vehiculos en el parqueadero
router.get('/vehiculos-activos', activosController.obtenerVehiculosActivos);

// Cupos disponibles
router.get('/cupos-disponibles', activosController.obtenerCuposDisponibles);

// Historial del dia
router.get('/historial-hoy', activosController.obtenerHistorialHoy);

module.exports = router;
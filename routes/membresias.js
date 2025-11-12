
const express = require('express');
const router = express.Router();
const membresiaController = require('../controllers/membresiaController');

// NUEVA ruta para obtener todas las membresías

router.post('/crear', membresiaController.crearMembresia);
router.post('/verificar', membresiaController.verificarMembresia);
router.post('/renovar', membresiaController.renovarMembresia);

module.exports = router;

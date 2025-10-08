const express = require('express');
const router = express.Router();


const membresiaController = require('../controllers/membresiaController');

router.post('/crear', membresiaController.crearMembresia);
router.post('/verificar', membresiaController.verificarMembresia);
router.post('/renovar', membresiaController.renovarMembresia); 

module.exports = router;
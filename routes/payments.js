'use strict';

const express = require('express');
const router = express.Router();

//  Solo importamos el controlador
const paymentController = require('../controllers/paymentController');

// ÚNICA RUTA ACTIVA — Esta sí existe
router.post('/membresia', paymentController.pagarMembresia);

module.exports = router;

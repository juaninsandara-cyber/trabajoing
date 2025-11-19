'use strict';

const express = require('express');
const router = express.Router();

// ✅ Solo importamos el controlador
const paymentController = require('../controllers/paymentController');

/**
 * @swagger
 * tags:
 *   name: Pagos
 *   description: Procesos de pago en el sistema
 */

/**
 * @swagger
 * /payments/membresia:
 *   post:
 *     summary: Procesar el pago de una membresía
 *     tags: [Pagos]
 *     description: Genera y procesa el pago de una membresía utilizando el servicio de MercadoPago.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               documento:
 *                 type: string
 *               nombre:
 *                 type: string
 *               tipoMembresia:
 *                 type: string
 *                 enum: [mensual, diaria, semanal]
 *               monto:
 *                 type: number
 *             required:
 *               - documento
 *               - tipoMembresia
 *               - monto
 *     responses:
 *       200:
 *         description: Pago procesado exitosamente
 *       400:
 *         description: Error en los datos enviados
 *       500:
 *         description: Error interno al procesar el pago
 */
router.post('/membresia', paymentController.pagarMembresia);

module.exports = router;

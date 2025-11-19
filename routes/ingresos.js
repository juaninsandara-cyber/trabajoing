
const express = require('express');
const router = express.Router();
const { Ingreso, User } = require('../models');

/**
 * @swagger
 * tags:
 *   name: Ingresos
 *   description: Gestión de ingresos y salidas de vehículos
 */

/**
 * @swagger
 * /ingresos:
 *   post:
 *     summary: Registrar un nuevo ingreso de vehículo
 *     tags: [Ingresos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - placa
 *               - tipoVehiculo
 *               - tipoAccesso
 *             properties:
 *               placa:
 *                 type: string
 *                 example: "ABC123"
 *               tipoVehiculo:
 *                 type: string
 *                 enum: [carro, moto]
 *                 example: "carro"
 *               tipoAccesso:
 *                 type: string
 *                 enum: [membresía, día]
 *                 example: "membresía"
 *               ticketPago:
 *                 type: string
 *                 example: "TICKET-001"
 *                 description: Requerido solo para acceso tipo "día"
 *               horaEntrada:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-01-15T10:30:00Z"
 *               horaSalida:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-01-15T15:30:00Z"
 *               userId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Ingreso registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ingreso registrado exitosamente"
 *                 ingreso:
 *                   $ref: '#/components/schemas/Vehiculo'
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', async (req, res) => {
  // ... código existente ...
});

/**
 * @swagger
 * /ingresos:
 *   get:
 *     summary: Obtener todos los ingresos
 *     tags: [Ingresos]
 *     description: Retorna el listado completo de ingresos registrados con información de usuarios
 *     responses:
 *       200:
 *         description: Lista de ingresos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ingresos obtenidos exitosamente"
 *                 total:
 *                   type: integer
 *                   example: 50
 *                 ingresos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Vehiculo'
 *       500:
 *         description: Error al obtener ingresos
 */
router.get('/', async (req, res) => {
  // ... código existente ...
});

module.exports = router;

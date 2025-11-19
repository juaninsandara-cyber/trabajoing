
const express = require('express');
const router = express.Router();


const membresiaController = require('../controllers/membresiaController');
/*
 *@swagger
 * tags:
 *   name: Membresías
 *   description: Gestión de membresías del sistema de parqueadero
 */

/**
 * @swagger
 * /membresias/crear:
 *   post:
 *     summary: Crear una nueva membresía
 *     tags: [Membresías]
 *     description: Registra una membresía nueva para un usuario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               documento:
 *                 type: string
 *                 example: "10203040"
 *               tipo:
 *                 type: string
 *                 enum: [mensual, semanal, diaria]
 *                 example: "mensual"
 *               fechaInicio:
 *                 type: string
 *                 format: date
 *                 example: "2025-11-01"
 *               fechaFin:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-01"
 *     responses:
 *       201:
 *         description: Membresía creada exitosamente
 *       400:
 *         description: Datos incompletos o inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/crear', membresiaController.crearMembresia);

/**
 * @swagger
 * /membresias/verificar:
 *   post:
 *     summary: Verificar si un usuario tiene una membresía activa
 *     tags: [Membresías]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               documento:
 *                 type: string
 *                 example: "10203040"
 *     responses:
 *       200:
 *         description: Estado de la membresía devuelto correctamente
 *       404:
 *         description: No existe membresía registrada
 *       500:
 *         description: Error interno del servidor
 */
router.post('/verificar', membresiaController.verificarMembresia);

/**
 * @swagger
 * /membresias/renovar:
 *   post:
 *     summary: Renovar una membresía existente
 *     tags: [Membresías]
 *     description: Permite extender la vigencia de una membresía activa.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               documento:
 *                 type: string
 *                 example: "10203040"
 *               nuevoFin:
 *                 type: string
 *                 format: date
 *                 example: "2026-01-01"
 *     responses:
 *       200:
 *         description: Membresía renovada exitosamente
 *       404:
 *         description: No existe la membresía a renovar
 *       500:
 *         description: Error interno del servidor
 */
router.post('/renovar', membresiaController.renovarMembresia);
module.exports = router;


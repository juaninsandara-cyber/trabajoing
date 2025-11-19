// routes/notificacionRoutes.js
const express = require('express');
const router = express.Router();
const notificacionController = require('../controllers/notificacionController');

/**
 * @swagger
 * tags:
 *   name: Notificaciones
 *   description: Gestión automática y manual de alertas del parqueadero
 */

/**
 * @swagger
 * /notificaciones/verificar-ocupacion:
 *   get:
 *     summary: Verificar ocupación y enviar alertas automáticas
 *     tags: [Notificaciones]
 *     description: Verifica el nivel de ocupación del parqueadero y envía correos si se supera el límite configurado.
 *     responses:
 *       200:
 *         description: Verificación realizada correctamente
 *       500:
 *         description: Error al verificar ocupación
 */
router.get('/verificar-ocupacion', notificacionController.verificarYNotificarOcupacion);

/**
 * @swagger
 * /notificaciones/estado-parqueadero:
 *   get:
 *     summary: Obtener estado actual del parqueadero
 *     tags: [Notificaciones]
 *     description: Retorna cuántos puestos están ocupados y disponibles en tiempo real.
 *     responses:
 *       200:
 *         description: Estado del parqueadero obtenido correctamente
 *       500:
 *         description: Error al obtener el estado
 */
router.get('/estado-parqueadero', notificacionController.getEstadoParqueadero);

/**
 * @swagger
 * /notificaciones/prueba-correo:
 *   get:
 *     summary: Probar envío manual de correo
 *     tags: [Notificaciones]
 *     description: Envía un correo de prueba para validar la configuración del servidor SMTP.
 *     responses:
 *       200:
 *         description: Correo enviado correctamente
 *       500:
 *         description: Error al enviar el correo
 */
router.get('/prueba-correo', notificacionController.pruebaEnvioCorreo);


module.exports = router;
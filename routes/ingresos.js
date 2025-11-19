// routes/ingresos.js - VERSIÓN COMPLETA CORREGIDA
const express = require('express');
const router = express.Router();
const { Ingreso, User } = require('../models');

// Crear un nuevo ingreso
router.post('/', async (req, res) => {
  try {
    const { placa, tipoVehiculo, tipoAccesso, ticketPago, horaEntrada, horaSalida, userId } = req.body;

    // VALIDACIONES CORREGIDAS (tipoAccesso con doble 's')
    if (!placa || !tipoVehiculo || !tipoAccesso) {
      return res.status(400).json({ 
        error: 'Placa, tipo de vehículo y tipo de acceso son requeridos' 
      });
    }

    const tiposVehiculoValidos = ['carro', 'moto'];
    const tiposAccessoValidos = ['membresía', 'día'];
    
    if (!tiposVehiculoValidos.includes(tipoVehiculo)) {
      return res.status(400).json({ 
        error: 'Tipo de vehículo inválido. Use: carro o moto' 
      });
    }

    if (!tiposAccessoValidos.includes(tipoAccesso)) {
      return res.status(400).json({ 
        error: 'Tipo de acceso inválido. Use: membresía o día' 
      });
    }

    if (tipoAccesso === 'día' && !ticketPago) {
      return res.status(400).json({ 
        error: 'Ticket de pago es requerido para acceso por día' 
      });
    }

    const nuevoIngreso = await Ingreso.create({
      placa: placa.toUpperCase(),
      tipoVehiculo,
      tipoAccesso, 
      ticketPago,
      horaEntrada: horaEntrada || new Date(),
      horaSalida,
      userId: null
    });

    res.status(201).json({
      message: 'Ingreso registrado exitosamente',
      ingreso: nuevoIngreso
    });

  } catch (error) {
    console.error('Error al crear ingreso:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      detalle: error.message // Para debugging
    });
  }
});

// Obtener todos los ingresos
router.get('/', async (req, res) => {
  try {
    const ingresos = await Ingreso.findAll({
      include: [{
        model: User,
        attributes: ['id', 'username']
      }],
      order: [['horaEntrada', 'DESC']]
    });
    
    res.json({
      message: 'Ingresos obtenidos exitosamente',
      total: ingresos.length,
      ingresos
    });
  } catch (error) {
    console.error('Error al obtener ingresos:', error);
    res.status(500).json({ error: 'Error al obtener ingresos' });
  }
});

module.exports = router;
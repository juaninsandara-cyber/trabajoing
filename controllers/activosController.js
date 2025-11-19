const Ingreso = require('../models/ingreso');
const User = require('../models/user');
const { Op } = require('sequelize');

// Obtener vehículos actualmente en el parqueadero
exports.obtenerVehiculosActivos = async (req, res) => {
  try {
    const vehiculosActivos = await Ingreso.findAll({
      where: {
        horaSalida: null
      },
      include: [{
        model: User,
        attributes: ['username']
      }],
      order: [['horaEntrada', 'DESC']]
    });

    // Estadísticas
    const totalActivos = vehiculosActivos.length;
    const carrosActivos = vehiculosActivos.filter(v => v.tipoVehiculo === 'carro').length;
    const motosActivas = vehiculosActivos.filter(v => v.tipoVehiculo === 'moto').length;

    res.status(200).json({
      message:`🅿️ Vehículos en parqueadero: ${totalActivos}`,


      estadisticas: {
        total: totalActivos,
        carros: carrosActivos,
        motos: motosActivas
      },
      vehiculos: vehiculosActivos.map(v => ({
        id: v.id,
        placa: v.placa,
        tipoVehiculo: v.tipoVehiculo,
        tipoAcceso: v.tipoAcceso,
        horaEntrada: v.horaEntrada,
        usuario: v.User.username,
        ticketPago: v.ticketPago
      }))
    });

  } catch (error) {
    console.error('Error al obtener vehículos activos:', error);
    res.status(500).json({ 
      message: 'Error al obtener vehículos activos',
      error: error.message 
    });
  }
};

// Obtener cupos disponibles
exports.obtenerCuposDisponibles = async (req, res) => {
  try {
    const limites = { membresia: { carro: 20, moto: 50 }, dia: { carro: 40, moto: 100 } };
    
    const cupos = {};
    
    for (const [tipoAcceso, vehiculos] of Object.entries(limites)) {
      cupos[tipoAcceso] = {};
      
      for (const [tipoVehiculo, limite] of Object.entries(vehiculos)) {
        const conteo = await Ingreso.count({
          where: {
            horaSalida: null,
            tipoAcceso: tipoAcceso,
            tipoVehiculo: tipoVehiculo
          }
        });
        
        cupos[tipoAcceso][tipoVehiculo] = {
          ocupados: conteo,
          disponibles: limite - conteo,
          limite: limite
        };
      }
    }

    res.status(200).json({
      message: ' Cupos disponibles',
      cupos
    });

  } catch (error) {
    console.error('Error al obtener cupos:', error);
    res.status(500).json({ 
      message: 'Error al obtener cupos',
      error: error.message 
    });
  }
};

// Obtener historial de ingresos del día
exports.obtenerHistorialHoy = async (req, res) => {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const historialHoy = await Ingreso.findAll({
      where: {
        horaEntrada: {
          [Op.gte]: hoy
        }
      },
      include: [{
        model: User,
        attributes: ['username']
      }],
      order: [['horaEntrada', 'DESC']]
    });

    res.status(200).json({
      message: `Historial de ingresos hoy: ${historialHoy.length}`,
      historial: historialHoy
    });

  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({ 
      message: 'Error al obtener historial',
      error: error.message 
    });
  }
};
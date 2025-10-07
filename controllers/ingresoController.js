const Ingreso = require('../models/ingreso');
const User = require('../models/user');
const { Op } = require('sequelize');

// Registrar ingreso
exports.registrarIngreso = async (req, res) => {
  try {
    const { username, password, placa, tipoVehiculo, tipoAcceso } = req.body;

    // Verificar credenciales
    const user = await User.findOne({ where: { username, password } });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Normalizar entradas sin tildes y en minúsculas
    const tipoAccesoNormalizado = tipoAcceso.toLowerCase().replace('í', 'i');
    const tipoVehiculoNormalizado = tipoVehiculo.toLowerCase();

    // Definir límites de cupo
    const limites = {
      membresia: { carro: 20, moto: 50 },
      dia: { carro: 40, moto: 100 }
    };

    // Validar existencia de los tipos
    if (
      !limites[tipoAccesoNormalizado] ||
      !limites[tipoAccesoNormalizado][tipoVehiculoNormalizado]
    ) {
      return res.status(400).json({
        message: 'Tipo de acceso o vehículo inválido. Use: dia/membresia y carro/moto'
      });
    }

    // Contar vehículos dentro del parqueadero sin hora salida
    const conteoActual = await Ingreso.count({
      where: {
        horaSalida: null,
        tipoVehiculo: tipoVehiculoNormalizado,
        tipoAcceso: tipoAccesoNormalizado
      }
    });

    // Validar si hay cupo disponible
    if (conteoActual >= limites[tipoAccesoNormalizado][tipoVehiculoNormalizado]) {
      return res.status(400).json({
        message: `No hay cupos disponibles para ${tipoVehiculoNormalizado}s de ${tipoAccesoNormalizado}`
      });
    }

    // Generar ticket de pago si es acceso diario
    let ticketPago = null;
    if (tipoAccesoNormalizado === 'dia') {
      ticketPago = `TICKET-${placa}-${Date.now()}`;
    }

    // Registrar nuevo ingreso
    const nuevoIngreso = await Ingreso.create({
      userId: user.id,
      placa,
      tipoVehiculo: tipoVehiculoNormalizado,
      tipoAcceso: tipoAccesoNormalizado,
      ticketPago
    });

    res.status(201).json({
      message: 'Ingreso registrado con éxito',
      ingreso: nuevoIngreso
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar ingreso', error });
  }
};

// Registrar salida
exports.registrarSalida = async (req, res) => {
  try {
    const { username, password, placa } = req.body;

    // Verificar usuario
    const user = await User.findOne({ where: { username, password } });
    if (!user) return res.status(401).json({ message: 'Credenciales incorrectas' });

    // Buscar ingreso activo
    const ingreso = await Ingreso.findOne({
      where: {
        userId: user.id,
        placa,
        horaSalida: null
      }
    });

    if (!ingreso)
      return res.status(404).json({ message: 'No hay ingreso activo para esta placa' });

    // Registrar salida
    ingreso.horaSalida = new Date();
    await ingreso.save();

    res.status(200).json({ message: 'Salida registrada con éxito', ingreso });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar salida', error });
  }
};

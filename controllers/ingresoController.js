const Ingreso = require('../models/ingreso');
const User = require('../models/user');
const { Op } = require('sequelize');

// Validar datos de entrada
const validarDatosIngreso = (datos) => {
  const errores = [];

  if (!datos.username || datos.username.length < 3) {
    errores.push('Username debe tener al menos 3 caracteres');
  }

  if (!datos.password) {
    errores.push('Password es requerido');
  }

  if (!datos.placa || !/^[A-Z0-9]{3,10}$/i.test(datos.placa)) {
    errores.push('Placa debe tener entre 3 y 10 caracteres alfanuméricos');
  }

  if (!['carro', 'moto'].includes(datos.tipoVehiculo)) {
    errores.push('Tipo de vehículo debe ser: carro o moto');
  }

  if (!['membresía', 'día'].includes(datos.tipoAcceso)) {
    errores.push('Tipo de acceso debe ser: membresía o día');
  }

  return errores;
};

// Registrar ingreso 
exports.registrarIngreso = async (req, res) => {
  try {
    const { username, password, placa, tipoVehiculo, tipoAcceso } = req.body;

    console.log(' Intentando registro de ingreso:', { username, placa });

    // Validar datos
    const erroresValidacion = validarDatosIngreso(req.body);
    if (erroresValidacion.length > 0) {
      return res.status(400).json({
        message: 'Datos inválidos',
        errores: erroresValidacion
      });
    }

    // Verificar credenciales
    const user = await User.findOne({ where: { username, password } });
    if (!user) {
      return res.status(401).json({ 
        message: 'Credenciales incorrectas',
        error: 'USER_NOT_FOUND'
      });
    }

    // Verificar si el vehículo ya está dentro
    const ingresoActivo = await Ingreso.findOne({
      where: {
        placa: placa.toUpperCase(),
        horaSalida: null
      }
    });

    if (ingresoActivo) {
      return res.status(400).json({
        message: 'Este vehículo ya se encuentra en el parqueadero',
        error: 'VEHICLE_ALREADY_INSIDE',
        ingreso: ingresoActivo
      });
    }

    // Normalizar datos
    const tipoAccesoNormalizado = tipoAcceso.toLowerCase().replace('í', 'i');
    const tipoVehiculoNormalizado = tipoVehiculo.toLowerCase();
    const placaNormalizada = placa.toUpperCase();

    // Contar vehículos actuales
    const conteoActual = await Ingreso.count({
      where: {
        horaSalida: null,
        tipoVehiculo: tipoVehiculoNormalizado,
        tipoAcceso: tipoAccesoNormalizado
      }
    });

    // Validar cupos
    const limites = { membresia: { carro: 20, moto: 50 }, dia: { carro: 40, moto: 100 } };
    const limite = limites[tipoAccesoNormalizado]?.[tipoVehiculoNormalizado];

    if (!limite) {
      return res.status(400).json({
        message: 'Tipo de acceso o vehículo inválido'
      });
    }

    if (conteoActual >= limite) {
      return res.status(400).json({
        message: `No hay cupos disponibles para ${tipoVehiculoNormalizado}s de ${tipoAccesoNormalizado}`,
        cuposDisponibles: 0
      });
    }

    // Generar ticket de pago si es acceso diario
    let ticketPago = null;
    if (tipoAccesoNormalizado === 'dia') {
      ticketPago = `FACTURA-${placaNormalizada}-${Date.now()}`;
    }

    // Registrar ingreso
    const nuevoIngreso = await Ingreso.create({
      userId: user.id,
      placa: placaNormalizada,
      tipoVehiculo: tipoVehiculoNormalizado,
      tipoAcceso: tipoAccesoNormalizado,
      ticketPago,
      horaEntrada: new Date()
    });

    res.status(201).json({
      message: 'Ingreso registrado con éxito',
      factura: ticketPago ? {
        numero: ticketPago,
        placa: placaNormalizada,
        tipoVehiculo: tipoVehiculoNormalizado,
        tipoAcceso: tipoAccesoNormalizado,
        horaEntrada: nuevoIngreso.horaEntrada
      } : null,
      cuposDisponibles: limite - conteoActual - 1,
      ingreso: nuevoIngreso
    });

  } catch (error) {
    console.error('Error al registrar ingreso:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
};
const Ingreso = require('../models/ingreso');
const User = require('../models/user');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs'); // para validar contraseñas encriptadas

//  Validar datos de entrada
const validarDatosIngreso = (datos) => {
  const errores = [];

  if (!datos.username || datos.username.length < 3) {
    errores.push('El nombre de usuario debe tener al menos 3 caracteres.');
  }

  if (!datos.password) {
    errores.push('La contraseña es obligatoria.');
  }

  if (!datos.placa || !/^[A-Z0-9]{3,10}$/i.test(datos.placa)) {
    errores.push('La placa debe tener entre 3 y 10 caracteres alfanuméricos.');
  }

  if (!['carro', 'moto'].includes(datos.tipoVehiculo?.toLowerCase())) {
    errores.push('El tipo de vehículo debe ser "carro" o "moto".');
  }

  if (!['membresia', 'día', 'dia'].includes(datos.tipoAcceso?.toLowerCase())) {
    errores.push('El tipo de acceso debe ser "membresía" o "día".');
  }

  return errores;
};

// Registrar ingreso
exports.registrarIngreso = async (req, res) => {
  try {
    //  AGREGAR ESTE LOGGING COMPLETO
    console.log('INICIANDO registrarIngreso');
    console.log('BODY COMPLETO:', JSON.stringify(req.body, null, 2));
    console.log(' CAMPOS:', Object.keys(req.body));
    console.log('Username:', req.body.username);
    console.log(' Password:', req.body.password ? 'PRESENTE' : 'FALTANTE');
    console.log(' Placa:', req.body.placa);
    console.log('TipoVehiculo:', req.body.tipoVehiculo);
    console.log('TipoAcceso:', req.body.tipoAcceso);

    const { username, password, placa, tipoVehiculo, tipoAcceso } = req.body;

    console.log(' Desestructurado - username:', username);
    console.log(' Desestructurado - placa:', placa);

    console.log('Intentando registrar ingreso:', { username, placa });

    //  Validación de campos
    const errores = validarDatosIngreso(req.body);
    if (errores.length > 0) {
      return res.status(400).json({ message: 'Datos inválidos', errores });
    }

    // Buscar usuario por nombre
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    // Verificar contraseña con bcrypt
    const passwordValido = await bcrypt.compare(password, user.password);
    if (!passwordValido) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    //  Verificar si el vehículo ya está adentro
    const ingresoActivo = await Ingreso.findOne({
      where: { placa: placa.toUpperCase(), horaSalida: null }
    });

    if (ingresoActivo) {
      return res.status(400).json({
        message: 'Este vehículo ya se encuentra dentro del parqueadero',
        error: 'VEHICLE_ALREADY_INSIDE'
      });
    }

    //  Normalizar datos
    const tipoAccesoNorm = tipoAcceso.toLowerCase().replace('í', 'i');
    const tipoVehiculoNorm = tipoVehiculo.toLowerCase();
    const placaNorm = placa.toUpperCase();

    // Contar vehículos actuales por tipo
    const conteoActual = await Ingreso.count({
      where: {
        horaSalida: null,
        tipoVehiculo: tipoVehiculoNorm,
        tipoAcceso: tipoAccesoNorm
      }
    });

    //  Definir límites
    const limites = {
      membresia: { carro: 20, moto: 50 },
      dia: { carro: 40, moto: 100 }
    };
    const limite = limites[tipoAccesoNorm]?.[tipoVehiculoNorm];

    if (!limite) {
      return res.status(400).json({ message: 'Tipo de acceso o vehículo inválido' });
    }

    if (conteoActual >= limite) {
      return res.status(400).json({
        message: `No hay cupos disponibles para ${tipoVehiculoNorm}s de ${tipoAccesoNorm}`,
        cuposDisponibles: 0
      });
    }

    //  Generar ticket de pago (si aplica)
    let ticketPago = null;
    if (tipoAccesoNorm === 'dia') {
      ticketPago = `FACTURA-${placaNorm}-${Date.now()}`;
    }

    // Registrar ingreso
    const nuevoIngreso = await Ingreso.create({
      userId: user.id,
      placa: placaNorm,
      tipoVehiculo: tipoVehiculoNorm,
      tipoAcceso: tipoAccesoNorm,
      ticketPago,
      horaEntrada: new Date()
    });

    res.status(201).json({
      message: 'Ingreso registrado con éxito',
      factura: ticketPago ? {
        numero: ticketPago,
        placa: placaNorm,
        tipoVehiculo: tipoVehiculoNorm,
        tipoAcceso: tipoAccesoNorm,
        horaEntrada: nuevoIngreso.horaEntrada
      } : null,
      cuposDisponibles: limite - conteoActual - 1,
      ingreso: nuevoIngreso
    });

  } catch (error) {
    console.error('Error al registrar ingreso:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

// Registrar salida
exports.registrarSalida = async (req, res) => {
  try {
    const { username, password, placa } = req.body;

    console.log(' Intentando registrar salida:', { username, placa });

    //  Buscar usuario
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    //  Validar contraseña
    const passwordValido = await bcrypt.compare(password, user.password);
    if (!passwordValido) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Buscar ingreso activo
    const ingreso = await Ingreso.findOne({
      where: { userId: user.id, placa: placa.toUpperCase(), horaSalida: null }
    });

    if (!ingreso) {
      return res.status(404).json({ message: 'No hay ingreso activo para esta placa' });
    }

    // Registrar salida
    ingreso.horaSalida = new Date();
    await ingreso.save();

    res.status(200).json({
      message: 'Salida registrada con éxito',
      ingreso: {
        id: ingreso.id,
        placa: ingreso.placa,
        tipoVehiculo: ingreso.tipoVehiculo,
        horaEntrada: ingreso.horaEntrada,
        horaSalida: ingreso.horaSalida
      }
    });

  } catch (error) {
    console.error(' Error al registrar salida:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

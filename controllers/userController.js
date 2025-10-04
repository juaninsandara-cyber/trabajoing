const User = require('../models/user');
const Ingreso = require('../models/ingreso');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username, password } });

    if (user) {
      return res.status(200).json({ token: 'TODO CONECTADO' });// todo esta bien 
    }

    return res.status(401).json({ message: 'usuario No Registrado' });
  } catch (error) {
    return res.status(500).json({ message: 'Error del servidor', error });
  }
};
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validar si ya existe un usuario con ese username
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Crear nuevo usuario
    const newUser = await User.create({
      username,
      password
    });

    res.status(201).json({
      message: 'Usuario registrado con éxito',
      user: newUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};
// Registrar ingreso al parqueadero
exports.registrarIngreso = async (req, res) => {
  try {
    const { username, password, placa } = req.body;

    // Validar usuario
    const user = await User.findOne({ where: { username, password } });
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

    // Verificar si ya hay un ingreso activo con esa placa
    const ingresoActivo = await Ingreso.findOne({ where: { placa, horaSalida: null } });
    if (ingresoActivo) return res.status(400).json({ message: 'El vehículo ya está dentro' });

    // Crear nuevo ingreso
    const nuevoIngreso = await Ingreso.create({ placa, userId: user.id });

    res.status(201).json({
      message: `Ingreso registrado para ${username}`,
      ingreso: nuevoIngreso
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar ingreso', error });
  }
};

// Registrar salida del parqueadero
exports.registrarSalida = async (req, res) => {
  try {
    const { username, password, placa } = req.body;

    // Validar usuario
    const user = await User.findOne({ where: { username, password } });
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

    // Buscar ingreso activo
    const ingreso = await Ingreso.findOne({ where: { placa, userId: user.id, horaSalida: null } });
    if (!ingreso) return res.status(404).json({ message: 'No hay ingreso activo para esta placa' });

    // Registrar hora de salida
    ingreso.horaSalida = new Date();
    await ingreso.save();

    res.status(200).json({
      message: `Salida registrada para el vehículo ${placa}`,
      ingreso
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar salida', error });
  }
};
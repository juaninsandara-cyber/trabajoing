const User = require('../models/user');

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

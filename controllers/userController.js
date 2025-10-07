const User = require('../models/user');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username, password } });

    if (user) {
      return res.status(200).json({
        message: 'Usuario registrado',
        token: 'TODO CONECTADO'
      });
    }

    return res.status(401).json({ message: 'Credenciales inválidas' });
  } catch (error) {
    return res.status(500).json({ message: 'Error del servidor', error });
  }
};


exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const newUser = await User.create({ username, password });
    res.status(201).json({
      message: 'Usuario registrado con éxito',
      user: newUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};


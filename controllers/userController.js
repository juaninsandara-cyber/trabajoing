const User = require('../models/user');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Buscar usuario solo por  su nombre 
    const user = await User.findOne({ where: { username } });

    // no existe el usuario
    if (!user) {
      return res.status(401).json({ message: 'Usuario no registrado' });
    }

    // Si esixte el usuario pero la contraseña no es correcta
    if (user.password !== password) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Si todo esta bien 
    return res.status(200).json({
      message: 'Usuario registrado correctamente',
      token: 'TODO CONECTADO '
    });

  } catch (error) {
    console.error(' Error en login:', error);
    return res.status(500).json({ message: 'Error del servidor', error });
  }
};


exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // si ya existe un usuario con ese nombre 
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Crear un nuevo usuario
    const newUser = await User.create({ username, password });

    return res.status(201).json({
      message: 'Usuario registrado con éxito',
      user: newUser
    });

  } catch (error) {
    console.error('❌ Error en registro:', error);
    return res.status(500).json({ message: 'Error del servidor', error });
  }
};

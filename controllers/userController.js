const { User } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    console.log(' Body recibido en registro:', req.body);

    const { username, password, email, role } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({
        message: 'Todos los campos son obligatorios: username, password, email'
      });
    }

    const existingUser = await User.findOne({
      where: { [Op.or]: [{ username }, { email }] }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Usuario o email ya existen' });
    }

    const rolesValidos = ['admin', 'user', 'empleado'];
    const userRole = role && rolesValidos.includes(role) ? role : 'user';

    // CREACIÓN SIN CIFRAR (tal como lo quieres)
    const newUser = await User.create({ 
      username, 
      password, 
      email, 
      role: userRole 
    });

    return res.status(201).json({
      message: 'Usuario registrado con éxito',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('Error en register:', error.message);
    return res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: 'Username y password son obligatorios'
      });
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // VALIDACIÓN DIRECTA (sin cifrado)


const esValido = await bcrypt.compare(password, user.password);
if (!esValido) {
  return res.status(401).json({ message: 'Credenciales inválidas' });
}


    return res.status(200).json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error en login:', error.message);
    return res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

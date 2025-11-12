<<<<<<< HEAD
const User = require('../models/user');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username, password } });

    if (user) {
      return res.status(200).json({ token: 'fake-jwt-token' });
    }

    return res.status(401).json({ message: 'Credenciales inválidas' });
  } catch (error) {
    return res.status(500).json({ message: 'Error del servidor', error });
  }
};
=======
const { User } = require('../models');
const { Op } = require('sequelize');

exports.registro = async (req, res) => {
  try {
    console.log('📝 Body recibido en registro:', req.body);
    
    const { username, password, email, role } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ 
        message: 'Todos los campos son obligatorios: username, password, email' 
      });
    }

    console.log('🔍 Buscando usuario existente...');
    
    const existingUser = await User.findOne({ 
      where: { 
        [Op.or]: [{ username }, { email }] 
      } 
    });
    
    if (existingUser) {
      console.log('❌ Usuario ya existe');
      return res.status(400).json({ message: 'Usuario o email ya existen' });
    }

    // ✅ EL USUARIO ELIGE EL ROL - sin restricciones
    const rolesValidos = ['admin', 'user', 'empleado'];
    const userRole = role && rolesValidos.includes(role) ? role : 'user';

    console.log('✅ Creando nuevo usuario con rol:', userRole);
    
    const newUser = await User.create({ 
      username, 
      password, 
      email,
      role: userRole
    });

    console.log('🎉 Usuario creado ID:', newUser.id);
    res.status(201).json({
      message: 'Usuario registrado con éxito',
      user: { 
        id: newUser.id, 
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
    
  } catch (error) {
    console.error('💥 ERROR en registro:', error.message);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
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

    console.log('🔍 Buscando usuario para login:', username);
    
    const user = await User.findOne({ where: { username } });
    
    if (!user) {
      console.log('❌ Usuario no encontrado');
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const passwordValido = await user.validarPassword(password);
    if (!passwordValido) {
      console.log('❌ Contraseña incorrecta');
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    console.log('✅ Login exitoso para:', username);
    res.status(200).json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('💥 ERROR en login:', error.message);
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};
>>>>>>> c786a63 (feat: deploy secure API with authentication, rate limiting, and security measures)

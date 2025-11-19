const { User } = require('../models');
const { Op } = require('sequelize');

exports.register = async (req, res) => {
  try {
    console.log('Body recibido:', req.body);
    
    const { username, password, email } = req.body;

    console.log('Buscando usuario existente...');
    
    // Verificar si username o email ya existen
    const existingUser = await User.findOne({ 
      where: { 
        [Op.or]: [{ username }, { email }] 
      } 
    });
    
    if (existingUser) {
      console.log('Usuario ya existe');
      return res.status(400).json({ message: 'Usuario o email ya existen' });
    }

    console.log('Creando nuevo usuario...');
    const newUser = await User.create({ username, password, email });

    console.log('Usuario creado:', newUser.id);
    res.status(201).json({
      message: 'Usuario registrado con éxito',
      user: { 
        id: newUser.id, 
        username: newUser.username,
        email: newUser.email 
      }
    });
    
  } catch (error) {
    console.error('ERROR en registro:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log('🔍 Buscando usuario para login:', username);
    
    // Buscar usuario con username Y password 
    const user = await User.findOne({ 
      where: { 
        username: username,
        password: password  
      } 
    });
    
    if (!user) {
      console.log('Usuario no encontrado o contraseña incorrecta');
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    console.log('Login exitoso para:', username);
    res.status(200).json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error(' ERROR en login:', error.message);
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};
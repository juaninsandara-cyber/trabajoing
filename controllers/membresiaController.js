const { Membresia, User } = require('../models');
const { Op } = require('sequelize');

exports.crearMembresia = async (req, res) => {
  try {
    console.log('🎯 INICIANDO crearMembresia');
    console.log('📦 Body:', req.body);
    
    const { username, password, tipo, duracion } = req.body;

    // Validaciones básicas
    if (!username || !password || !tipo || !duracion) {
      return res.status(400).json({ message: 'Faltan campos' });
    }

    console.log('🔍 Buscando usuario:', username);
    
    // Buscar usuario
    const user = await User.findOne({ where: { username } });
    console.log('👤 Usuario encontrado:', user ? 'SÍ' : 'NO');
    
    if (!user) {
      return res.status(401).json({ message: 'Usuario no existe' });
    }

    console.log('🆔 User ID:', user.id);

    // CREAR MEMBRESÍA SIMPLIFICADA
    console.log('📝 Creando membresía...');
    const membresiaData = {
      userId: user.id,
      tipo: tipo,
      duracion: duracion
    };
    
    console.log('📊 Datos membresía:', membresiaData);
    
    const membresia = await Membresia.create(membresiaData);
    console.log('✅ Membresía creada ID:', membresia.id);

    // Respuesta exitosa
    res.status(201).json({
      message: `Membresía ${tipo} creada exitosamente`,
      membresia: {
        id: membresia.id,
        tipo: membresia.tipo,
        duracion: membresia.duracion,
        userId: membresia.userId
      }
    });

  } catch (error) {
    console.error('🚨🚨🚨 ERROR CRÍTICO:');
    console.error('💥 Mensaje:', error.message);
    console.error('📋 Stack:', error.stack);
    console.error('🔧 Nombre:', error.name);
    console.error('❌ Detalles completos:', error);
    
    res.status(500).json({ 
      message: 'Error interno - ver logs',
      error: error.message
    });
  }
};

// Las otras funciones las dejamos simples por ahora
exports.verificarMembresia = async (req, res) => {
  try {
    console.log('🎯 INICIANDO verificarMembresia');
    console.log('📦 Body:', req.body);
    
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Faltan credenciales' });
    }

    console.log('🔍 Buscando usuario:', username);
    const user = await User.findOne({ where: { username } });
    console.log('👤 Usuario encontrado:', user ? 'SÍ' : 'NO');
    
    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    console.log('🆔 User ID:', user.id);

    // Buscar membresías activas
    console.log('🔍 Buscando membresías activas...');
    const membresias = await Membresia.findAll({
      where: {
        userId: user.id
      }
    });

    console.log('📊 Membresías encontradas:', membresias.length);

    if (membresias.length === 0) {
      return res.status(404).json({
        message: 'No tienes membresías',
        tieneMembresia: false,
        membresias: []
      });
    }

    res.status(200).json({
      message: 'Membresías encontradas',
      tieneMembresia: true,
      total: membresias.length,
      membresias: membresias.map(m => ({
        id: m.id,
        tipo: m.tipo,
        duracion: m.duracion,
        userId: m.userId
      }))
    });

  } catch (error) {
    console.error('🚨 ERROR verificar membresía:', error.message);
    res.status(500).json({ 
      message: 'Error interno',
      error: error.message
    });
  }
};
exports.renovarMembresia = async (req, res) => {
  res.status(200).json({ message: 'Función en desarrollo' });
};
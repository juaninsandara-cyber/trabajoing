const { Membresia, User } = require('../models');
const { Op } = require('sequelize');

exports.crearMembresia = async (req, res) => {
  try {
    const { username, password, tipo, duracion } = req.body;

    
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    
    const isPasswordValid = await user.validPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Calcular fechas
    const fechaInicio = new Date();
    const fechaFin = new Date();
    
    if (tipo === 'semanal') {
      fechaFin.setDate(fechaFin.getDate() + (duracion * 7));
    } else if (tipo === 'mensual') {
      fechaFin.setMonth(fechaFin.getMonth() + duracion);
    } else {
      return res.status(400).json({ message: 'Tipo de membresía inválido' });
    }

    // Crear membresía
    const membresia = await Membresia.create({
      userId: user.id,
      tipo,
      fechaInicio,
      fechaFin,
      precio: tipo === 'semanal' ? 50.00 : 150.00
    });

    res.status(201).json({
      message: `Membresía ${tipo} creada exitosamente`,
      membresia: {
        id: membresia.id,
        tipo: membresia.tipo,
        fechaInicio: membresia.fechaInicio,
        fechaFin: membresia.fechaFin,
        precio: membresia.precio
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear membresía', error: error.message });
  }
};

exports.verificarMembresia = async (req, res) => {
  try {
    const { username, password } = req.body;

    
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const isPasswordValid = await user.validPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const membresiaActiva = await Membresia.findOne({
      where: {
        userId: user.id,
        fechaFin: { [Op.gt]: new Date() }
      }
    });

    if (!membresiaActiva) {
      return res.status(404).json({ 
        message: 'No tienes una membresía activa',
        tieneMembresia: false
      });
    }

    res.status(200).json({
      message: 'Membresía activa encontrada',
      tieneMembresia: true,
      membresia: {
        id: membresiaActiva.id,
        tipo: membresiaActiva.tipo,
        fechaInicio: membresiaActiva.fechaInicio,
        fechaFin: membresiaActiva.fechaFin,
        precio: membresiaActiva.precio
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al verificar membresía', error: error.message });
  }
};

exports.renovarMembresia = async (req, res) => {
  try {
    const { username, password, tipo, duracion } = req.body;

    //verificacion
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const isPasswordValid = await user.validPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Buscar membresía actual
    const membresiaActual = await Membresia.findOne({
      where: { userId: user.id },
      order: [['fechaFin', 'DESC']]
    });

    let fechaInicio = new Date();
    
    // Si hay membresía vigente, empezar desde su fecha fin
    if (membresiaActual && membresiaActual.fechaFin > new Date()) {
      fechaInicio = new Date(membresiaActual.fechaFin);
    }

    const fechaFin = new Date(fechaInicio);
    
    if (tipo === 'semanal') {
      fechaFin.setDate(fechaFin.getDate() + (duracion * 7));
    } else if (tipo === 'mensual') {
      fechaFin.setMonth(fechaFin.getMonth() + duracion);
    }

    const nuevaMembresia = await Membresia.create({
      userId: user.id,
      tipo,
      fechaInicio,
      fechaFin,
      precio: tipo === 'semanal' ? 50.00 : 150.00
    });

    res.status(201).json({
      message: `Membresía renovada exitosamente`,
      membresia: {
        id: nuevaMembresia.id,
        tipo: nuevaMembresia.tipo,
        fechaInicio: nuevaMembresia.fechaInicio,
        fechaFin: nuevaMembresia.fechaFin,
        precio: nuevaMembresia.precio
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al renovar membresía', error: error.message });
  }
};
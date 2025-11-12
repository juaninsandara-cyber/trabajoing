const { Membresia, User } = require('../models');
const { Op } = require('sequelize');

exports.crearMembresia = async (req, res) => {
  try {
    const { username, password, tipo, duracion } = req.body;

    // Validaciones
    if (!username || !password || !tipo || !duracion) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    if (duracion <= 0) {
      return res.status(400).json({ message: 'La duración debe ser mayor a 0' });
    }

    // ✅ CORREGIDO: Buscar usuario
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // ✅ Usar el método de validación del modelo
    const passwordValido = await user.validarPassword(password);
    if (!passwordValido) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Verificar que el usuario esté activo
    if (user.estado !== 'activo') {
      return res.status(403).json({ message: 'Usuario no activo' });
    }

    // Cálculo de fechas
    const fechaInicio = new Date();
    const fechaFin = new Date(fechaInicio);
    
    if (tipo === 'semanal') {
      fechaFin.setDate(fechaFin.getDate() + (duracion * 7));
    } else if (tipo === 'mensual') {
      // Cálculo más preciso
      const diasMensuales = duracion * 30;
      fechaFin.setDate(fechaFin.getDate() + diasMensuales);
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
    console.error('Error crear membresía:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.verificarMembresia = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Faltan credenciales' });
    }

    // ✅ CORREGIDO: Verificación segura
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const passwordValido = await user.validarPassword(password);
    if (!passwordValido) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Verificar estado del usuario
    if (user.estado !== 'activo') {
      return res.status(403).json({ message: 'Usuario no activo' });
    }

    const membresiaActiva = await Membresia.findOne({
      where: {
        userId: user.id,
        fechaFin: { [Op.gt]: new Date() }
      },
      order: [['fechaFin', 'DESC']]
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
    console.error('Error verificar membresía:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.renovarMembresia = async (req, res) => {
  try {
    const { username, password, tipo, duracion } = req.body;

    // Validaciones
    if (!username || !password || !tipo || !duracion) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    // ✅ CORREGIDO: Verificación segura
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const passwordValido = await user.validarPassword(password);
    if (!passwordValido) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    if (user.estado !== 'activo') {
      return res.status(403).json({ message: 'Usuario no activo' });
    }

    // Buscar membresía actual más reciente
    const membresiaActual = await Membresia.findOne({
      where: { userId: user.id },
      order: [['fechaFin', 'DESC']]
    });

    let fechaInicio = new Date();
    
    // Si hay membresía vigente, empezar desde su fecha fin
    if (membresiaActual && new Date(membresiaActual.fechaFin) > new Date()) {
      fechaInicio = new Date(membresiaActual.fechaFin);
    }

    const fechaFin = new Date(fechaInicio);
    
    if (tipo === 'semanal') {
      fechaFin.setDate(fechaFin.getDate() + (duracion * 7));
    } else if (tipo === 'mensual') {
      const diasMensuales = duracion * 30;
      fechaFin.setDate(fechaFin.getDate() + diasMensuales);
    } else {
      return res.status(400).json({ message: 'Tipo de membresía inválido' });
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
    console.error('Error renovar membresía:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
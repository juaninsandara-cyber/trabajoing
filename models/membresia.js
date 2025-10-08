const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Membresia = sequelize.define('Membresia', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tipo: {
    type: DataTypes.ENUM('semanal', 'mensual', 'trimestral', 'anual'),
    allowNull: false
  },
  fechaInicio: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  fechaFin: {
    type: DataTypes.DATE,
    allowNull: false
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('activa', 'expirada', 'cancelada'),
    defaultValue: 'activa'
  }
});

module.exports = Membresia;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Ingreso = sequelize.define('Ingreso', {
  placa: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tipoVehiculo: {
    type: DataTypes.ENUM('carro', 'moto'),
    allowNull: false
  },
  tipoAccesso: {
    type: DataTypes.ENUM('membresía', 'día'),
    allowNull: false
  },
  ticketPago: {
    type: DataTypes.STRING,
    allowNull: true // solo para accesos por día
  },
  horaEntrada: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  horaSalida: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true
});

User.hasMany(Ingreso, { foreignKey: 'userId' });
Ingreso.belongsTo(User, { foreignKey: 'userId' });

module.exports = Ingreso;

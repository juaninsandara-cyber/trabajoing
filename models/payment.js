// models/Payment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tipoMembresia: {
    type: DataTypes.STRING,
    allowNull: false
  },
  monto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  preferenceId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending' // pending, approved, rejected, cancelled
  },
  mercadoPagoId: {
    type: DataTypes.STRING // ID del pago en Mercado Pago
  },
  fechaCreacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  fechaAprobacion: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

module.exports = Payment;

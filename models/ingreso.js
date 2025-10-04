const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Ingreso = sequelize.define('Ingreso', {
  placa: {
    type: DataTypes.STRING,
    allowNull: false
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
  timestamps: false
});

User.hasMany(Ingreso, { foreignKey: 'userId' });
Ingreso.belongsTo(User, { foreignKey: 'userId' });

module.exports = Ingreso;

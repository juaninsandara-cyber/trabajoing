const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Membresia = sequelize.define('Membresia', {
  tipo: {
    type: DataTypes.ENUM('mensual', 'semanal'),
    allowNull: false
  },
  fechaInicio: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  fechaFin: {
    type: DataTypes.DATE,
    allowNull: false
  }
});

Membresia.belongsTo(User, { foreignKey: 'userId' });

module.exports = Membresia;

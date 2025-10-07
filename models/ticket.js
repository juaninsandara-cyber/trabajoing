const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Ingreso = require('./ingreso');

const Ticket = sequelize.define('Ticket', {
  monto: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'pagado'),
    defaultValue: 'pendiente'
  }
});

Ticket.belongsTo(User, { foreignKey: 'userId' });
Ticket.belongsTo(Ingreso, { foreignKey: 'ingresoId' });

module.exports = Ticket;

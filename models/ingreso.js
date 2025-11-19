// models/ingreso.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('./index'); // usa la instancia global de conexión

const Ingreso = sequelize.define('Ingreso', {
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  monto: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'ingresos',
  timestamps: false,
});

module.exports = Ingreso;

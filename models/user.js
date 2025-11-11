'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Definición del modelo User
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: true // createdAt y updatedAt
});

// Relaciones del modelo (si las necesitas)
User.associate = function(models) {
  // Por ejemplo: User.hasMany(models.Payment)
};

module.exports = User;

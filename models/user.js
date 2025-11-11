<<<<<<< HEAD
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
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
  timestamps: true // createdAt y updatedAt
});




module.exports = User;
=======
'use strict';

module.exports = (sequelize, DataTypes) => {
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
    timestamps: true
  });

  User.associate = function(models) {
    // Aquí van relaciones si las necesitas
    // por ejemplo: User.hasMany(models.Payment)
  };

  return User;
};
>>>>>>> feature/pagos-mercadopago-parqueadero

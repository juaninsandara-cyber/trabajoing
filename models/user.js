'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Definición del modelo User
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 50],
      notEmpty: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: [6, 255]
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  role: {
    type: DataTypes.ENUM('admin', 'user', 'empleado'),
    defaultValue: 'user'
  },
  estado: {
    type: DataTypes.ENUM('activo', 'inactivo', 'suspendido'),
    defaultValue: 'activo'
  }
}, {
<<<<<<< HEAD
  timestamps: true

=======
  tableName: 'users',
  timestamps: true // createdAt y updatedAt
>>>>>>> felipe
});

// Relaciones del modelo (si las necesitas)
User.associate = function(models) {
  // Por ejemplo: User.hasMany(models.Payment)
};

module.exports = User;

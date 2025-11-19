// models/user.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role: {

    type: DataTypes.ENUM('admin', 'user', 'empleado'),
    defaultValue: 'user',
    validate: {
      isIn: {
        args: [['admin', 'user', 'empleado']],
        msg: 'Rol no válido'
      }
    }
  },
  estado: {
    type: DataTypes.ENUM('activo', 'inactivo', 'suspendido'),
    defaultValue: 'activo',
    validate: {
      isIn: {
        args: [['activo', 'inactivo', 'suspendido']],
        msg: 'Estado no válido'
      }
    }
  },
}, {
  tableName: 'users',
  timestamps: false,
  hooks: {
    async beforeCreate(user) {
      // Encriptar contraseña
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  }
});


User.prototype.validarPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = User;

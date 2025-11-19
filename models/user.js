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
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'user'
  }
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

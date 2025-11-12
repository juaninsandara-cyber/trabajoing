const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
<<<<<<< HEAD

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
const crypto = require('crypto');

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
  timestamps: true,
  hooks: {
    beforeCreate: (user) => {
      if (user.password) {
        user.password = hashPassword(user.password);
      }
    },
    beforeUpdate: (user) => {
      if (user.changed('password')) {
        user.password = hashPassword(user.password);
      }
    }
  }
});

function hashPassword(password) {
  return crypto
    .createHash('sha256')
    .update(password)
    .digest('hex');
}

User.prototype.validarPassword = function(password) {
  const hashedPassword = hashPassword(password);
  return this.password === hashedPassword;
};

module.exports = User;
>>>>>>> c786a63 (feat: deploy secure API with authentication, rate limiting, and security measures)

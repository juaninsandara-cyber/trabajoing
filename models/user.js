'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

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
    unique: {
      name: 'username_unique',
      msg: 'El nombre de usuario ya está en uso'
    },
    validate: {
      len: {
        args: [3, 50],
        msg: 'El usuario debe tener entre 3 y 50 caracteres'
      },
      notEmpty: {
        msg: 'El nombre de usuario no puede estar vacío'
      },
      is: {
        args: /^[a-zA-Z0-9_]+$/,
        msg: 'El usuario solo puede contener letras, números y guiones bajos'
      }
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: {
        args: [6, 255],
        msg: 'La contraseña debe tener al menos 6 caracteres'
      },
      notEmpty: {
        msg: 'La contraseña no puede estar vacía'
      }
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: {
      name: 'email_unique',
      msg: 'El email ya está registrado'
    },
    validate: {
      isEmail: {
        msg: 'Debe proporcionar un email válido'
      },
      notEmpty: {
        msg: 'El email no puede estar vacío'
      }
    }
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
  // Campos adicionales recomendados
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      len: [2, 100]
    }
  },
  apellido: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      len: [2, 100]
    }
  },
  ultimoLogin: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    }
  }
});

// Métodos de instancia
User.prototype.validPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

User.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  delete values.password; // No enviar password en las respuestas
  return values;
};

// Método para obtener nombre completo
User.prototype.getFullName = function() {
  return `${this.nombre || ''} ${this.apellido || ''}`.trim() || this.username;
};

// Métodos estáticos
User.findByEmail = function(email) {
  return this.findOne({ where: { email } });
};

User.findByUsername = function(username) {
  return this.findOne({ where: { username } });
};

// Scope para usuarios activos
User.addScope('activos', {
  where: { estado: 'activo' }
});

User.addScope('porRol', (role) => ({
  where: { role }
}));

// Relaciones del modelo (ejemplos)
User.associate = function(models) {
  // Ejemplos de relaciones comunes:
  // User.hasMany(models.Pedido, { foreignKey: 'userId', as: 'pedidos' });
  // User.hasMany(models.Pago, { foreignKey: 'userId', as: 'pagos' });
  // User.hasOne(models.Perfil, { foreignKey: 'userId', as: 'perfil' });
  // User.hasMany(models.Token, { foreignKey: 'userId', as: 'tokens' });
};

module.exports = User;
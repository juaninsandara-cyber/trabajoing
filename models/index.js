const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs'); // ← agregado para encriptar

// Usa las variables de entorno de tu .env
const sequelize = new Sequelize(
  process.env.DB_NAME || 'mi_base_datos',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || 'db',
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: false,
  }
);

// --- MODELO DE USUARIO ---
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'users',
  timestamps: false,

  // ← AGREGADO: encriptar contraseña antes de crear
  hooks: {
    beforeCreate: async (user) => {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// --- MODELO DE MEMBRESÍA ---
const Membresia = sequelize.define('Membresia', {
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  duracion: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'membresias',
  timestamps: false,
});

// --- RELACIONES ---
User.hasMany(Membresia, { foreignKey: 'userId' });
Membresia.belongsTo(User, { foreignKey: 'userId' });

// --- EXPORTAR ---
module.exports = { sequelize, User, Membresia };

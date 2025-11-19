const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

// Usa las variables de entorno del .env
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

// ==============================
// MODELO USER
// ==============================
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'users',
  timestamps: false,
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

// ==============================
// MODELO MEMBRESÍA
// ==============================
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

// ==============================
// MODELO INGRESO (CORRECTO)
// ==============================
const Ingreso = require('./ingreso')(sequelize, DataTypes);

// ==============================
// RELACIONES
// ==============================
User.hasMany(Membresia, { foreignKey: 'userId' });
Membresia.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Ingreso, { foreignKey: 'userId' });
Ingreso.belongsTo(User, { foreignKey: 'userId' });

// ==============================
// EXPORTAR MODELOS (UNA SOLA VEZ)
// ==============================
module.exports = { sequelize, User, Membresia, Ingreso };

// ==============================
// INICIALIZAR BASE DE DATOS
// ==============================
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log(' Conexión a BD establecida');

    await sequelize.sync({ force: false });
    console.log(' Tablas sincronizadas/creadas correctamente');
  } catch (error) {
    console.error(' Error iniciando base de datos:', error);
  }
}

initializeDatabase();

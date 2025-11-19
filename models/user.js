const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

//  CONFIGURACIÓN CORREGIDA - usar mysql_db
const sequelize = new Sequelize(
  process.env.DB_NAME || 'tienda_v1',
  process.env.DB_USER || 'app_user', 
  process.env.DB_PASS || 'app_pass',
  {
    host: process.env.DB_HOST || 'mysql_db',  // ← CORREGIDO
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
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user'
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

// --- SINCRONIZACIÓN AUTOMÁTICA ---
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a BD establecida');
    
    await sequelize.sync({ force: false });
    console.log('Tablas sincronizadas correctamente');
    
  } catch (error) {
    console.error('Error iniciando base de datos:', error.message);
  }
}

initializeDatabase();
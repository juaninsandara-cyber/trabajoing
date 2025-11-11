// scripts/create-tables.js
const sequelize = require('../config/database');
const Payment = require('../models/Payment');

async function createTables() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a BD exitosa');
    
    // Sincronizar modelo (crea la tabla si no existe)
    await Payment.sync({ force: false }); // force:true borra y recrea
    console.log('✅ Tabla de pagos creada/verificada');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creando tablas:', error);
    process.exit(1);
  }
}

createTables();

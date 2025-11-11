// scripts/simple-view.js
const sequelize = require('../config/database');

async function showData() {
  try {
    const [results] = await sequelize.query('SELECT * FROM Payments');
    console.log('📊 DATOS EN TU TABLA Payments:');
    console.log('Total registros:', results.length);
    console.log('');
    
    results.forEach(row => {
      console.log('🆔 ID:', row.id);
      console.log('👤 UserID:', row.userId);
      console.log('📦 Tipo:', row.tipoMembresia);
      console.log('💰 Monto:', row.monto);
      console.log('📊 Status:', row.status);
      console.log('🔗 Preference ID:', row.preferenceId);
      console.log('📅 Creado:', row.createdAt);
      console.log('─'.repeat(40));
    });
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

showData();

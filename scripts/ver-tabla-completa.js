// scripts/ver-tabla-completa.js
const sequelize = require('../config/database');

async function verTablaCompleta() {
  try {
    console.log('🔗 Conectando a MySQL...');
    
    // 1. Ver información de la base de datos
    const [dbInfo] = await sequelize.query('SELECT DATABASE() as db, USER() as user');
    console.log('📊 Base de datos:', dbInfo[0].db);
    console.log('👤 Usuario:', dbInfo[0].user);
    console.log('');
    
    // 2. Ver todos los datos de la tabla Payments
    const [payments] = await sequelize.query('SELECT * FROM Payments ORDER BY id DESC');
    
    console.log('='.repeat(100));
    console.log('💾 TABLA: Payments - PARQUEADERO_DB');
    console.log('='.repeat(100));
    
    if (payments.length === 0) {
      console.log('📭 La tabla está vacía');
      return;
    }
    
    // Encabezado de la tabla
    console.log(
      'ID'.padEnd(4) + ' | ' +
      'USER'.padEnd(6) + ' | ' +
      'TIPO'.padEnd(12) + ' | ' +
      'MONTO'.padEnd(10) + ' | ' +
      'ESTADO'.padEnd(10) + ' | ' +
      'FECHA CREACIÓN'.padEnd(20) + ' | ' +
      'PREFERENCE ID'
    );
    console.log('─'.repeat(100));
    
    // Datos de la tabla
    payments.forEach(payment => {
      const fecha = new Date(payment.createdAt).toLocaleString();
      console.log(
        payment.id.toString().padEnd(4) + ' | ' +
        payment.userId.toString().padEnd(6) + ' | ' +
        payment.tipoMembresia.padEnd(12) + ' | ' +
        (`$${payment.monto}`).padEnd(10) + ' | ' +
        payment.status.padEnd(10) + ' | ' +
        fecha.padEnd(20) + ' | ' +
        payment.preferenceId
      );
    });
    
    console.log('');
    console.log('📈 ESTADÍSTICAS:');
    console.log(`   Total pagos: ${payments.length}`);
    
    const pending = payments.filter(p => p.status === 'pending').length;
    const approved = payments.filter(p => p.status === 'approved').length;
    
    console.log(`   Pendientes: ${pending}`);
    console.log(`   Aprobados: ${approved}`);
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('💡 Asegúrate de que MySQL esté ejecutándose');
  }
}

verTablaCompleta();

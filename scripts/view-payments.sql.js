// scripts/view-payments.sql.js
const sequelize = require('../config/database');

async function viewPayments() {
  try {
    // Ejecutar consulta SQL directa
    const [results] = await sequelize.query(`
      SELECT 
        id,
        userId as 'Usuario ID',
        tipoMembresia as 'Tipo Membresía',
        monto as 'Monto',
        status as 'Estado',
        preferenceId as 'ID Preferencia MP',
        DATE(createdAt) as 'Fecha Creación'
      FROM Payments 
      ORDER BY id DESC
    `);
    
    console.log('📊 PAGOS EN TABLA MySQL:');
    console.table(results);
    
    // Estadísticas
    const [stats] = await sequelize.query(`
      SELECT 
        COUNT(*) as 'Total Pagos',
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as 'Pendientes',
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as 'Aprobados',
        SUM(monto) as 'Monto Total'
      FROM Payments
    `);
    
    console.log('📈 ESTADÍSTICAS:');
    console.table(stats);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

viewPayments();

// scripts/check-payments.js
const Payment = require('../models/Payment');

async function checkPayments() {
  try {
    const payments = await Payment.findAll();
    console.log('📊 PAGOS EN BASE DE DATOS:');
    console.log('Total:', payments.length);
    
    payments.forEach(payment => {
      console.log('---');
      console.log('ID:', payment.id);
      console.log('Usuario:', payment.userId);
      console.log('Tipo:', payment.tipoMembresia);
      console.log('Monto:', payment.monto);
      console.log('Status:', payment.status);
      console.log('Preference ID:', payment.preferenceId);
      console.log('Creado:', payment.createdAt);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkPayments();

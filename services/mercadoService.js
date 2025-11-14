'use strict';

console.log(" CARGANDO ARCHIVO MERCADO SERVICE DESDE:", __filename);

require('dotenv').config();
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');

//  Configuración SDK
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

async function createPreference({ items, external_reference }) {

  const preference = new Preference(client);

  //  Formato correcto según MP SDK v2 (2024+)
  const response = await preference.create({
    preference: {
      items: items,
      external_reference: external_reference,

      back_urls: {
        success: "http://localhost:3000/payments/success",
        failure: "http://localhost:3000/payments/failure",
        pending: "http://localhost:3000/payments/pending"
      },

      auto_return: "approved"
    }
  });

  return response;
}

function generateQrUrlFromString(url) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
}

async function getPaymentInfo(payment_id) {
  const payment = new Payment(client);
  return await payment.get({ id: payment_id });
}

module.exports = {
  createPreference,
  generateQrUrlFromString,
  getPaymentInfo
};

// services/mercadoService.js - Versión mínima funcional
console.log(" CARGANDO ARCHIVO MERCADO SERVICE DESDE:", __filename);

require('dotenv').config();
const { MercadoPagoConfig, Preference } = require('mercadopago');

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

async function createPreference({ items, external_reference }) {
  const preference = new Preference(client);

  const requestBody = {
    body: {
      items: items.map(item => ({
        title: item.title.substring(0, 255), // Máximo 255 chars
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price),
        currency_id: "COP"
      })),
      external_reference: external_reference.substring(0, 256)
    }
  };

  console.log("📦 Creando preferencia en MP...");
  const response = await preference.create(requestBody);
  console.log("✅ Preferencia creada:", response.id);
  
  return response;
}

function generateQrUrlFromString(url) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
}

module.exports = {
  createPreference,
  generateQrUrlFromString
};

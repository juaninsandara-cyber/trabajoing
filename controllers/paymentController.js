'use strict';

const {
  createPreference,
  generateQrUrlFromString
} = require('../services/mercadoService');

exports.pagarMembresia = async (req, res) => {
  try {
    const { userId, tipo } = req.body;

    if (!userId || !tipo) {
      return res.status(400).json({ error: "userId y tipo son obligatorios" });
    }

    const precios = {
      mensual: 30000,
      trimestral: 80000,
      anual: 250000
    };

    const amount = precios[tipo];

    if (!amount) {
      return res.status(400).json({ error: "Tipo de membresía inválido" });
    }

    //  Crear preferencia con API REST
    const pref = await createPreference({
      items: [
        {
          title: `Membresia ${tipo}`,
          quantity: 1,
          unit_price: amount,
          currency: "COP"
        }
      ],
      external_reference: `membresia_${userId}_${Date.now()}`
    });

    const initPoint = pref.init_point || pref.sandbox_init_point;

    if (!initPoint) {
      console.error(" MercadoPago no devolvió init_point", pref);
      return res.status(500).json({ error: "MercadoPago no devolvió init_point", raw: pref });
    }

    const qr = generateQrUrlFromString(initPoint);

    return res.json({
      message: "Preferencia creada",
      init_point: initPoint,
      qr
    });

  } catch (err) {
    // Captura completa del error
    console.error(" Error interno en membresías:", err.response?.data || err);

    res.status(500).json({
      error: "Error interno en membresías",
      message: err.message || null,
      code: err.code || null,
      status: err.status || 500,
      blocked_by: err.blocked_by || null,
      raw: err.response?.data || err
    });
  }
};
	


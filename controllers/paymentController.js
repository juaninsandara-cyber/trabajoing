// controllers/paymentController.js - VERSIÓN CON GUARDADO EN BD
const Payment = require('../models/Payment');

exports.pagarMembresia = async (req, res) => {
  try {
    console.log("📨 Body recibido:", JSON.stringify(req.body, null, 2));
    
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

    // Crear preferencia en Mercado Pago
    const pref = await require('../services/mercadoService').createPreference({
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
      console.error("MercadoPago no devolvió init_point", pref);
      return res.status(500).json({ error: "MercadoPago no devolvió init_point" });
    }

    // 🔥 GUARDAR EN BASE DE DATOS
    const paymentRecord = await Payment.create({
      userId: userId,
      tipoMembresia: tipo,
      monto: amount,
      preferenceId: pref.id,
      status: 'pending'
    });

    console.log("💾 Pago guardado en BD con ID:", paymentRecord.id);

    const qr = require('../services/mercadoService').generateQrUrlFromString(initPoint);

    console.log("✅ Pago creado exitosamente - ID BD:", paymentRecord.id);
    
    return res.json({
      success: true,
      message: "Preferencia creada y guardada en BD",
      paymentId: paymentRecord.id, // ← NUEVO: ID en tu BD
      preference_id: pref.id,
      init_point: initPoint,
      qr: qr,
      monto: amount,
      tipo: tipo
    });

  } catch (err) {
    console.error("💥 Error completo en controlador:", err);
    
    res.status(500).json({
      success: false,
      error: "Error interno en membresías", 
      message: err.message,
      status: err.status,
      details: err.cause
    });
  }
};


const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
dotenv.config();

var app = express();




var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var paymentsRouter = require('./routes/payments');
const membresiasRouter = require('./routes/membresias');
const ingresosRouter = require('./routes/ingresos');
const activosRouter = require('./routes/activos');
const notificacionRoutes = require('./routes/notificaciones');




// Configuración básica
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Conexión base de datos con reintento
const { sequelize } = require('./models');



(async () => {
  console.log('Iniciando aplicación...');

  try {
    await sequelize.authenticate();
    console.log('Conectado correctamente a MySQL');

    await sequelize.sync({ alter: true }); // crea o actualiza tablas
    console.log('Tablas sincronizadas correctamente');
  } catch (err) {
    console.error('Error al conectar o sincronizar la base de datos:', err.message);
  }
})();



// Importar modelos de Sequelize
require('./models/user');
require('./models/ingreso');
require('./models/membresia');

// Configuración de variables de entorno
dotenv.config();

// =============================================================================
// CONFIGURACIÓN DE SEGURIDAD
// =============================================================================

const SECURITY_CONFIG = {
  PAYLOAD: { JSON_LIMIT: '1mb', URLENCODED_LIMIT: '1mb', MAX_STRING_LENGTH: 200, MAX_ARRAY_ITEMS: 50 },
  RATE_LIMIT: { WINDOW_TIME: 60 * 1000, MAX_REQUESTS: 10 },
  SENSITIVE_OPS: {
    MAX_ATTEMPTS: 3,
    TIME_WINDOW: 10 * 60 * 1000,
    PROTECTED_ENDPOINTS: ['/recuperar-password', '/validar-otp']
  },
  SPENDING_LIMIT: { MAX_AMOUNT: 1000, ALERT_INTERVAL: 60 * 60 * 1000 },
  PAGINATION: { MAX_LIMIT: 100, DEFAULT_LIMIT: 10, DEFAULT_OFFSET: 0 }
};

const securityStorage = {
  rateLimit: {},
  sensitiveAttempts: {},
  userSpending: {}
};

// Middleware de tamaño de payload
app.use(express.json({ limit: SECURITY_CONFIG.PAYLOAD.JSON_LIMIT }));
app.use(express.urlencoded({ limit: SECURITY_CONFIG.PAYLOAD.URLENCODED_LIMIT, extended: true }));


// Validar límites de paginación
app.use((req, res, next) => {
  const { limit, offset } = req.query;
  const { MAX_LIMIT, DEFAULT_LIMIT, DEFAULT_OFFSET } = SECURITY_CONFIG.PAGINATION;

  if (limit && (isNaN(limit) || limit > MAX_LIMIT)) {
    return res.status(400).json({ error: `El parámetro "limit" no puede exceder ${MAX_LIMIT}` });
  }

  if (offset && (isNaN(offset) || offset < 0)) {
    return res.status(400).json({ error: 'El parámetro "offset" debe ser un número positivo' });
  }

  // Si no hay limit/offset, los define por defecto
  req.query.limit = limit || DEFAULT_LIMIT;
  req.query.offset = offset || DEFAULT_OFFSET;
  next();
});



// Límite de tamaño de archivos (máx. 2MB)
app.use((req, res, next) => {
  const contentLength = parseInt(req.headers['content-length'] || '0');
  const MAX_SIZE = 2 * 1024 * 1024; // 2 MB
  if (contentLength > MAX_SIZE) {
    return res.status(413).json({ error: 'Archivo demasiado grande (máx. 2MB).' });
  }
  next();
});


// Validación de tamaño de datos
app.use((req, res, next) => {
  const { MAX_STRING_LENGTH, MAX_ARRAY_ITEMS } = SECURITY_CONFIG.PAYLOAD;
  for (const key in req.body) {
    const value = req.body[key];
    if (typeof value === 'string' && value.length > MAX_STRING_LENGTH) {
      return res.status(400).json({ error: `El campo "${key}" supera el tamaño máximo permitido` });
    }
    if (Array.isArray(value) && value.length > MAX_ARRAY_ITEMS) {
      return res.status(400).json({ error: `El arreglo "${key}" tiene demasiados elementos` });
    }
  }
  next();
});

// Rate limiting global
app.use((req, res, next) => {
  const ip = req.ip;
  const currentTime = Date.now();
  const { WINDOW_TIME, MAX_REQUESTS } = SECURITY_CONFIG.RATE_LIMIT;
  if (!securityStorage.rateLimit[ip]) securityStorage.rateLimit[ip] = [];
  securityStorage.rateLimit[ip] = securityStorage.rateLimit[ip].filter(ts => currentTime - ts < WINDOW_TIME);
  if (securityStorage.rateLimit[ip].length >= MAX_REQUESTS) {
    return res.status(429).json({ error: 'Demasiadas solicitudes. Inténtalo más tarde.' });
  }
  securityStorage.rateLimit[ip].push(currentTime);
  next();
});

// Operaciones sensibles
app.use((req, res, next) => {
  const ip = req.ip;
  const ahora = Date.now();
  const { MAX_ATTEMPTS, TIME_WINDOW, PROTECTED_ENDPOINTS } = SECURITY_CONFIG.SENSITIVE_OPS;
  if (PROTECTED_ENDPOINTS.includes(req.path)) {
    if (!securityStorage.sensitiveAttempts[ip]) {
      securityStorage.sensitiveAttempts[ip] = { count: 1, timestamp: ahora };
    } else {
      const data = securityStorage.sensitiveAttempts[ip];
      if (ahora - data.timestamp > TIME_WINDOW) {
        data.count = 1;
        data.timestamp = ahora;
      } else {
        data.count++;
      }
      if (data.count > MAX_ATTEMPTS) {
        return res.status(429).json({ error: 'Demasiadas solicitudes. Intente en 10 minutos.' });
      }
    }
  }
  next();
});
// Validación de parámetros de consulta (query)
app.use((req, res, next) => {
  for (const [key, value] of Object.entries(req.query)) {
    if (typeof value === 'string' && value.length > 100) {
      return res.status(400).json({ error: `El parámetro '${key}' es demasiado largo` });
    }
  }
  next();
});

// =============================================================================
// RUTAS PRINCIPALES
// =============================================================================

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/payments', paymentsRouter);
app.use('/api/ingresos', ingresosRouter);
app.use('/api/membresias', membresiasRouter);
app.use('/activos', activosRouter);
app.use('/notificaciones', notificacionRoutes);

// =============================================================================
// ENDPOINTS DE SEGURIDAD Y PRUEBA
// =============================================================================

function verificarLimiteGasto(req, res, next) {
  const ip = req.ip;
  const monto = parseFloat(req.body.monto || 0);
  const { MAX_AMOUNT, ALERT_INTERVAL } = SECURITY_CONFIG.SPENDING_LIMIT;
  if (!securityStorage.userSpending[ip]) {
    securityStorage.userSpending[ip] = { total: 0, ultimaAlerta: 0 };
  }
  if (!monto || isNaN(monto)) return res.status(400).json({ error: 'Monto inválido.' });
  securityStorage.userSpending[ip].total += monto;
  if (securityStorage.userSpending[ip].total > MAX_AMOUNT) {
    const ahora = Date.now();
    if (ahora - securityStorage.userSpending[ip].ultimaAlerta > ALERT_INTERVAL) {
      securityStorage.userSpending[ip].ultimaAlerta = ahora;
      console.warn(`⚠️ IP ${ip} superó el límite de gasto de $${MAX_AMOUNT}`);
    }
    return res.status(429).json({ error: `Límite de gasto superado ($${MAX_AMOUNT}).` });
  }
  next();
}

app.post('/pago', verificarLimiteGasto, (req, res) => {
  const { monto } = req.body;
  const ip = req.ip;
  res.json({
    mensaje: `Pago de $${monto} procesado correctamente.`,
    totalGastado: securityStorage.userSpending[ip].total,
    limiteRestante: SECURITY_CONFIG.SPENDING_LIMIT.MAX_AMOUNT - securityStorage.userSpending[ip].total
  });
});

app.get('/', (req, res) => {
  res.json({
    mensaje: 'Servidor Node + Express + MySQL funcionando correctamente',
    seguridad: 'Sistema de seguridad activado',
    endpoints: {
      usuarios: '/usuarios',
      pagos: '/pago',
      registro: '/registro',
      api: '/api/'
    }
  });
});

module.exports = app;

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//pruebas
const sequelize = require('./config/database');

sequelize.authenticate()
  .then(() => console.log(' Conexión a la base de datos exitosa'))
  .catch(err => console.error(' Error de conexión a la base de datos:', err));

// app.js
const dotenv = require('dotenv');

// Routers
const ingresosRouter = require('./routes/ingresos'); 
const membresiasRouter = require('./routes/membresias');

// Importar modelos de Sequelize
require('./models/user');
require('./models/ingreso');
require('./models/membresia');

// =============================================================================
//  CONFIGURACIÓN INICIAL Y CONSTANTES
// =============================================================================

dotenv.config();

// Constantes de seguridad
const SECURITY_CONFIG = {
    // Límites de tamaño de datos
    PAYLOAD: {
        JSON_LIMIT: '1mb',
        URLENCODED_LIMIT: '1mb',
        MAX_STRING_LENGTH: 200,
        MAX_ARRAY_ITEMS: 50
    },

    // Limitación de velocidad
    RATE_LIMIT: {
        WINDOW_TIME: 60 * 1000,        // 1 minuto
        MAX_REQUESTS: 10               // 10 peticiones por minuto
    },
    
    // Operaciones sensibles
    SENSITIVE_OPS: {
        MAX_ATTEMPTS: 3,               // 3 intentos máximos
        TIME_WINDOW: 10 * 60 * 1000,   // 10 minutos
        PROTECTED_ENDPOINTS: ['/recuperar-password', '/validar-otp']
    },
    
    //  Control de gastos
    SPENDING_LIMIT: {
        MAX_AMOUNT: 1000,              // $1000 límite
        ALERT_INTERVAL: 60 * 60 * 1000 // Alertas cada 1 hora
    },
    
    //  Paginación
    PAGINATION: {
        MAX_LIMIT: 100,
        DEFAULT_LIMIT: 10,
        DEFAULT_OFFSET: 0
    }
};

// =============================================================================
//  ALMACENAMIENTO EN MEMORIA PARA SEGURIDAD
// =============================================================================

const securityStorage = {
    rateLimit: {},          // Almacén para rate limiting: { ip: [timestamps] }
    sensitiveAttempts: {},  // Intentos de operaciones sensibles: { ip: { count, timestamp } }
    userSpending: {}        // Control de gastos: { ip: { total: 0, ultimaAlerta: 0 } }
};

// =============================================================================
// MIDDLEWARES DE SEGURIDAD
// =============================================================================

// MIDDLEWARE 1: Limitación de tamaño de payloads
app.use(express.json({ limit: SECURITY_CONFIG.PAYLOAD.JSON_LIMIT }));
app.use(express.urlencoded({ 
    limit: SECURITY_CONFIG.PAYLOAD.URLENCODED_LIMIT, 
    extended: true 
}));

//  MIDDLEWARE 2: Validación de tamaño de datos en body
app.use((req, res, next) => {
    const { MAX_STRING_LENGTH, MAX_ARRAY_ITEMS } = SECURITY_CONFIG.PAYLOAD;
    
    for (const key in req.body) {
        const value = req.body[key];
        
        // Validar longitud de strings
        if (typeof value === 'string' && value.length > MAX_STRING_LENGTH) {
            return res.status(400).json({ 
                error: `El campo "${key}" supera el tamaño máximo permitido (${MAX_STRING_LENGTH} caracteres)` 
            });
        }
        
        // Validar número de elementos en arrays
        if (Array.isArray(value) && value.length > MAX_ARRAY_ITEMS) {
            return res.status(400).json({ 
                error: `El arreglo "${key}" tiene demasiados elementos (${MAX_ARRAY_ITEMS} máx)` 
            });
        }
    }
    next();
});

//  MIDDLEWARE 3: Rate Limiting Global
app.use((req, res, next) => {
    const ip = req.ip;
    const currentTime = Date.now();
    const { WINDOW_TIME, MAX_REQUESTS } = SECURITY_CONFIG.RATE_LIMIT;
    
    // Inicializar registro para IP
    if (!securityStorage.rateLimit[ip]) {
        securityStorage.rateLimit[ip] = [];
    }
    
    // Limpiar peticiones fuera de la ventana de tiempo
    securityStorage.rateLimit[ip] = securityStorage.rateLimit[ip].filter(
        timestamp => currentTime - timestamp < WINDOW_TIME
    );
    
    // Verificar si excede el límite
    if (securityStorage.rateLimit[ip].length >= MAX_REQUESTS) {
        return res.status(429).json({
            error: 'Demasiadas solicitudes. Inténtalo de nuevo más tarde.'
        });
    }
    
    // Registrar nueva solicitud
    securityStorage.rateLimit[ip].push(currentTime);
    next();
});

// MIDDLEWARE 4: Limitación de Operaciones Sensibles
app.use((req, res, next) => {
    const ip = req.ip;
    const ahora = Date.now();
    const { MAX_ATTEMPTS, TIME_WINDOW, PROTECTED_ENDPOINTS } = SECURITY_CONFIG.SENSITIVE_OPS;
    
    // Verificar si es un endpoint protegido
    if (PROTECTED_ENDPOINTS.includes(req.path)) {
        if (!securityStorage.sensitiveAttempts[ip]) {
            securityStorage.sensitiveAttempts[ip] = { count: 1, timestamp: ahora };
        } else {
            const data = securityStorage.sensitiveAttempts[ip];
            
            // Reiniciar contador si ha pasado el tiempo de ventana
            if (ahora - data.timestamp > TIME_WINDOW) {
                data.count = 1;
                data.timestamp = ahora;
            } else {
                data.count++;
            }
            
            // Bloquear si excede los intentos permitidos
            if (data.count > MAX_ATTEMPTS) {
                return res.status(429).json({
                    error: 'Demasiadas solicitudes de recuperación. Intente nuevamente en 10 minutos.'
                });
            }
        }
    }
    next();
});

// =============================================================================
//  RUTAS DE LA API
// =============================================================================

// Registrar routers
app.use('/api/ingresos', ingresosRouter);
app.use('/api/membresias', membresiasRouter);
app.use('/api/users', usersRouter);

// =============================================================================
// CONTROL DE GASTOS - MIDDLEWARE ESPECÍFICO
// =============================================================================

/**
 * Middleware para verificar límites de gasto
 * @param {Object} req - Request object
 * @param {Object} res - Response object  
 * @param {Function} next - Next middleware
 */
function verificarLimiteGasto(req, res, next) {
    const ip = req.ip;
    const monto = parseFloat(req.body.monto || 0);
    const { MAX_AMOUNT, ALERT_INTERVAL } = SECURITY_CONFIG.SPENDING_LIMIT;
    
    // Inicializar registro de gastos para IP
    if (!securityStorage.userSpending[ip]) {
        securityStorage.userSpending[ip] = { total: 0, ultimaAlerta: 0 };
    }
    
    // Verificar que el monto sea válido
    if (!monto || isNaN(monto)) {
        return res.status(400).json({ error: 'Monto inválido.' });
    }
    
    // Acumular gasto
    securityStorage.userSpending[ip].total += monto;
    
    // Verificar si supera el límite
    if (securityStorage.userSpending[ip].total > MAX_AMOUNT) {
        const ahora = Date.now();
        
        // Enviar alerta solo si ha pasado el intervalo desde la última
        if (ahora - securityStorage.userSpending[ip].ultimaAlerta > ALERT_INTERVAL) {
            securityStorage.userSpending[ip].ultimaAlerta = ahora;
            console.warn(`ALERTA: IP ${ip} superó límite de gasto de $${MAX_AMOUNT}. Total: $${securityStorage.userSpending[ip].total}`);
        }
        
        return res.status(429).json({
            error: `Límite de gasto superado ($${MAX_AMOUNT}). Espere antes de realizar más operaciones.`
        });
    }
    
    next();
}

// =============================================================================
// ENDPOINTS CON VALIDACIONES ESPECÍFICAS
// =============================================================================

// ENDPOINT: Procesamiento de pagos con control de gastos
app.post('/pago', verificarLimiteGasto, (req, res) => {
    const { monto } = req.body;
    const ip = req.ip;
    
    res.json({
        mensaje: `Pago de $${monto} procesado correctamente.`,
        totalGastado: securityStorage.userSpending[ip].total,
        limiteRestante: SECURITY_CONFIG.SPENDING_LIMIT.MAX_AMOUNT - securityStorage.userSpending[ip].total
    });
});

//  ENDPOINT: Listado de usuarios con validación de parámetros
app.get('/usuarios', (req, res) => {
    const { limit = SECURITY_CONFIG.PAGINATION.DEFAULT_LIMIT.toString(), 
            offset = SECURITY_CONFIG.PAGINATION.DEFAULT_OFFSET.toString() } = req.query;
    
    const limitNum = parseInt(limit, 10);
    const offsetNum = parseInt(offset, 10);
    
    // Validación del parámetro "limit"
    if (isNaN(limitNum) || limitNum < 1 || limitNum > SECURITY_CONFIG.PAGINATION.MAX_LIMIT) {
        return res.status(400).json({
            error: `El parámetro "limit" debe ser un número entre 1 y ${SECURITY_CONFIG.PAGINATION.MAX_LIMIT}.`
        });
    }
    
    // Validación del parámetro "offset"
    if (isNaN(offsetNum) || offsetNum < 0) {
        return res.status(400).json({
            error: 'El parámetro "offset" debe ser un número mayor o igual a 0.'
        });
    }
    
    res.json({
        mensaje: `Mostrando ${limitNum} usuarios desde el índice ${offsetNum}`,
        pagination: {
            limit: limitNum,
            offset: offsetNum,
            maxLimit: SECURITY_CONFIG.PAGINATION.MAX_LIMIT
        }
    });
});

// ENDPOINT: Registro con validación de datos
app.post('/registro', (req, res) => {
    const { nombre, correo, roles } = req.body;
    
    // Validación específica de campos
    if (typeof nombre !== 'string' || nombre.length > 50) {
        return res.status(400).json({ 
            error: 'Nombre demasiado largo (máx 50 caracteres)' 
        });
    }
    
    if (typeof correo !== 'string' || correo.length > 100) {
        return res.status(400).json({ 
            error: 'Correo demasiado largo (máx 100 caracteres)' 
        });
    }
    
    if (Array.isArray(roles) && roles.length > 5) {
        return res.status(400).json({ 
            error: 'Máximo 5 roles permitidos' 
        });
    }
    
    res.json({ 
        mensaje: 'Usuario registrado correctamente',
        datos: { nombre, correo, roles: roles || [] }
    });
});

// =============================================================================
// RUTAS BÁSICAS
// =============================================================================

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

// =============================================================================
//  CONEXIÓN A BASE DE DATOS
// =============================================================================

const connectDB = async () => {
    let retries = 15;
    const delay = 5000;

    while (retries > 0) {
        try {
            console.log(`🔌 Intentando conectar a la base de datos... (${16 - retries}/15)`);
            await sequelize.authenticate();
            console.log('Conexión a la base de datos exitosa');
            await sequelize.sync();
            console.log(' Tablas sincronizadas');
            break;
        } catch (err) {
            console.error(` Error de conexión: ${err.message}`);
            retries -= 1;
            if (retries === 0) {
                console.error(' No se pudo conectar a la base de datos. Abortando.');
                process.exit(1);
            }
            console.log(` Reintentando en ${delay / 1000} segundos... (${retries} intentos restantes)`);
            await new Promise((res) => setTimeout(res, delay));
        }
    }
};

connectDB();

module.exports = app;
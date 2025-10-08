var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const membresiasRouter = require('./routes/membresias');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/membresias', membresiasRouter);

// Base de datos
const sequelize = require('./config/database');
sequelize.authenticate()
  .then(() => console.log('Conexión a la base de datos exitosa'))
  .catch(err => console.error(' Error de conexión a la base de datos:', err));

if (process.env.NODE_ENV !== 'test') {
  sequelize.sync()
    .then(() => console.log('Tablas sincronizadas'))
    .catch(err => console.error(' Error al sincronizar BD:', err));
}

const activosRouter = require('./routes/activos');
app.use('/activos', activosRouter);
module.exports = app;

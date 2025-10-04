var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const userRoutes = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', userRoutes);

//pruebas
const sequelize = require('./config/database');

sequelize.authenticate()
  .then(() => console.log('✅ Conexión a la base de datos exitosa'))
  .catch(err => console.error('❌ Error de conexión a la base de datos:', err));
  sequelize.sync()
  .then(() => console.log('✅ Tablas sincronizadas'))
  .catch(err => console.error('❌ Error al sincronizar BD:', err));


app.use(express.json()); // para leer JSON en el body
app.use('/users', userRoutes);
app.use('/auth', userRoutes);





module.exports = app;

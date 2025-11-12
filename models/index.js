
'use strict';

const sequelize = require('../config/database');
const User = require('./user');
const Ingreso = require('./ingreso');
const Membresia = require('./membresia');


User.hasMany(Ingreso, { foreignKey: 'userId' });
Ingreso.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Membresia, { foreignKey: 'userId' });
Membresia.belongsTo(User, { foreignKey: 'userId' });

const db = {
  sequelize,
  User,
  Ingreso, 
  Membresia
};

module.exports = db;


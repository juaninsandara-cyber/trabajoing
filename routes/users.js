var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('SAUVE ESA PARTE');
});
router.post('/login', userController.login);

// Registro de usuario
router.post('/registro', userController.register);

// Login de usuario
router.post('/login', userController.login);

const ingresoController = require('../controllers/ingresoController');
// ingreso 
router.post('/ingreso', ingresoController.registrarIngreso);
// salida 
router.post('/salida', ingresoController.registrarSalida);


module.exports = router;

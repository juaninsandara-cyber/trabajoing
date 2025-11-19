var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');

router.get('/', function(req, res, next) {
  res.send('SAUVE ESA PARTE');
});
const ingresoController = require('../controllers/ingresoController');
router.post('/login', userController.login);
router.post('/registro', userController.register);

router.post('/ingreso', ingresoController.registrarIngreso);
router.post('/salida', ingresoController.registrarSalida);

module.exports = router;
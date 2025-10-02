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


module.exports = router;

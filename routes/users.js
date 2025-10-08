var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');

router.get('/', function(req, res, next) {
  res.send('SAUVE ESA PARTE');
});

router.post('/login', userController.login);
router.post('/registro', userController.register);

module.exports = router;
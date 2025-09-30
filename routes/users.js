var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('SAUVE ESA PARTE');
});
router.post('/login', userController.login);

 router.get('/login', (req, res) => {
  res.send('Formulario de login');
 });


module.exports = router;

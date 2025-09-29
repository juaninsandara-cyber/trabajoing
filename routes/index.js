var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req,res)=>{ res.send("Hola clase!!")});


router.get('/', (req,res)=>{ res.send("Parqueadero futuro")});

router.get('/productos', (req,res)=>{ res.send("LISTA DE PRODUCTOS")});

module.exports = router;

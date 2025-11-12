var express = require('express');
var router = express.Router();



router.get('/', (req,res)=>{ res.send("Hola clase!!")});


router.get('/1', (req,res)=>{ res.send("Parqueadero futuro")});


router.get('/productos', (req,res)=>{ res.send("LISTA DE PRODUCTOS")});

module.exports = router;

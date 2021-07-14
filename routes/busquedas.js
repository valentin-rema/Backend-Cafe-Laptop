
//vamos a comenzar con las rutas de busqueda

const { Router } = require('express');

const { buscando } = require('../controllers/buscar');

const ruta = Router();


//vamos a comenzar por definir la ruta a mi parecer con una es suficiente

//entoces con una sola busqueda es mas que suficiente

ruta.get('/:coleccion/:termino', buscando);

module.exports = ruta;
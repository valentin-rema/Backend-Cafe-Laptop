//bien vamos a crear la ruta de autenticacion

const { Router } = require('express');

const { login, loginGoogle } = require('../controllers/auth');

const { validarCampos }  = require('../middlewares/validar-campos');

const { check } = require('express-validator');

const rutas = Router();


//en esta peticion lo unico que vamos a hacer es a devolver el token
rutas.post('/', [
    //vamos a colocar los middlewares
    check('correo', 'El correo debe de ser un correo valido').isEmail(),
    check('password', 'el password debe de ser de al menos 6 caracteres').not().isEmpty(),
    //ahora vamos a evaluar los posibles errores
    validarCampos
],
login);


//vamos a agregar una nueva ruta de autenticacion a travez de google 
rutas.post('/google', [
    //a continuacion vamos a agregar los middlewares que vamos a necesitar 
    //vamos a ver si nos mandaron el token
    check('id_token', 'Error el token es necesario').not().isEmpty(),
    validarCampos
],
loginGoogle
)


module.exports = rutas;

//ok entonces ahora 
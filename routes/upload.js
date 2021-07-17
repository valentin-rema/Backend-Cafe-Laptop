//vamos a comenzar a definir la ruta de la subida de archivos
const path = require('path');

const { v4 : uuidv4 } = require('uuid');

const fs = require('fs');

const { Router, response } = require('express');

const { check } = require('express-validator');

const { validarArchivoSubir, categoriasPermitidas } = require('../helpers/operaciones-archivos');
const { CargarArchivo, actualizarImagenCloud, getImagen, actualizarImagen } = require('../controllers/upload');

const { validarCampos } = require('../middlewares/validar-campos');


const ruta = Router();

//vamos a comenzar a definir los caminos que vamos a necesitar
ruta.post('/', validarArchivoSubir, CargarArchivo);

//ruta para que insertemos una imagen a nuestra base de datos ya sea de un producto o de una categoria
ruta.put('/:coleccion/:id', [
    //vamos a empezar a definir nuestros middlewares van a ser publicos no se necesita autenticacion
    check('coleccion', 'Error coleccion no permitida').custom(categoriasPermitidas),
    check('id', 'Error el id no es valido').isMongoId(),
    validarCampos
],
//aqui va nuestro controlador
actualizarImagenCloud   
)

//vamos a construir la ruta para mostrar una imagen asi que manos a la obra
ruta.get('/:coleccion/:id', [
    //vamos a colocar los middlewares   
    check('id', 'Error el id debe de ser un id valido').isMongoId(),
    check('coleccion', 'Error coleccion no permitida').custom(categoriasPermitidas),
    validarCampos
],
//aqui va nuestro controlador
getImagen
)

module.exports = ruta;







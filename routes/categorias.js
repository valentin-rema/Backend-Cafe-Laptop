
//vamos a crear las rutas que vamos a necesitar para las categorias
const { Router, response } = require('express');
const { check } = require('express-validator');


const { validarJwt } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');

const { crearCategoria, mostrarCategorias, mostrarCategoriasId, actualizarCategoria, borrarCategoria } = require('../controllers/categoria');

const { existeCategoriaId } = require('../helpers/db-validators');

const ruta = Router();

//vamos a colocar todas las peticiones de categoria que vamos a necesita

//ruta para ver todas las categorias -publica
ruta.get('/',mostrarCategorias);

//ruta para ver solo una categoria por id -publica

ruta.get('/:id',[
    check('id', 'El id tiene que ser un id valido').isMongoId(),
    //ahora vamos a ver si el id existe en la base de datos 
    check('id').custom(existeCategoriaId),
    validarCampos
],  
//coloquemos el controlador 
mostrarCategoriasId
);

//ruta para la creacion de una categoria, cualquiera con un token autenticado

//ya tenemos listo lo que es el modelo entonces lo que vamos es crear nuestra primera categoria asi que sin 
//mas manos a la obra
ruta.post('/', [
    //vamos a necesitar middlewares
    validarJwt, //=>lo que aqui hacemos es obtener los datos del usuario y los mandamos en el requerimiento
    check('nombre', 'El nombre de la categoria es obligatorio').not().isEmpty(),
    validarCampos
],
//ya por ultimo una vez hecho todas las validaciones ahora si vamos a proceder a ir al controlador
crearCategoria
);

//ruta para la actualizacion de una categoria -con token autenticado 
ruta.put('/:id', [
    //bien ahora vamos con la parte de las actualizaciones asi que manos a la obra
    validarJwt,
    check('nombre', 'Error tiene que mandar el nombre para hacer la actualizacion').not().isEmpty(),
    check('id', 'El id tiene que ser un id valido').isMongoId(),
    check('id').custom(existeCategoriaId),
    validarCampos
],
//vamos a definir el controlador 
actualizarCategoria
);

//ruta para la eliminacion de una categoria -con un token autenticado y que el rol del usuario sea 'ADMIN_ROLE'
ruta.delete('/:id', [
    //vamos a definir los middlewares que vamos a necesitar
    validarJwt,
    check('id', 'El id tiene que ser un id valido').isMongoId(),
    check('id').custom(existeCategoriaId),
    validarCampos
],
//ahora vamos a definir el controlador
borrarCategoria
);

module.exports = ruta;


//ahora vamos con la creacion de un modelo para el control de las categorias


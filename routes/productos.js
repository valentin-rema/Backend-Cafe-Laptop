//vamos a definir la ruta de los productos

const { Router, response } = require('express');

const { check } = require('express-validator');

const { validarJwt } = require('../middlewares/validar-jwt');

const { existeCategoriaId, existeProductoId, verificandoRol } = require('../helpers/db-validators');

const { validarCampos } = require('../middlewares/validar-campos');

const { crearProducto, mostrarProductos, mostrarProducto, actualizarProducto, eliminarProducto } = require('../controllers/producto');

const ruta = Router();
//vamos a comenzar a definir las rutas

//ruta para mostrar todos los productos
//vamos a por el controlador de mostrar los productos
ruta.get('/', mostrarProductos);

//ruta para mostrar un producto por el id -publica lo puede hacer cualquier persona
ruta.get('/:id', [
    //vamos a comenzar con mostrar un solo producto por su id
    check('id','El id tiene que ser un id valido').isMongoId(),
    check('id', 'El id no existe').custom(existeProductoId),
    validarCampos
],
//vamos a definir el controlador
mostrarProducto
)

//ruta para crear un producto -tiene que tener un token valido puede crearlo cualquier usuario
ruta.post('/', [
    //middlewares para la creacion de productos
    validarJwt,
    check('nombre', 'Error tiene que agregar el nombre del producto').not().isEmpty(),
    check('categoria', 'Error el id de la categoria no es valido').isMongoId(),
    //ahora vamos a validar si existe ese id de la categoria
    check('categoria').custom(existeCategoriaId),
    validarCampos
],
//controlador para la creacion de un producto
crearProducto
)

//ruta para actualizar un producto -tiene que tener un token valido, un id valido ademas de los datos a cambiar
ruta.put('/:id', [
    //vamos con la parte de actualizar un producto entonces manos a la obra
    validarJwt,
    check('nombre', 'Error tiene que mandar un nombre').not().isEmpty(),
    check('id', 'Error el id tiene que ser un id valido').isMongoId(),
    check('id').custom(existeProductoId),
    validarCampos
],
//vamos a construir el controlador 
actualizarProducto
);

//ruta para eliminar un producto -tiene que tener un token valido, un id valido, y ademas el usuario debe de ser
//ADMIN_ROLE
ruta.delete('/:id', [
    //ahora vamos con la ultima parte que es el delete asi que manos a la obra
    validarJwt,
    check('id', 'Error el id debe de ser un id valido').isMongoId(),
    check('id').custom(existeProductoId),
    verificandoRol("ADMIN_ROLE"),
    validarCampos
],
//vamos a definir el controlador
eliminarProducto
); 

module.exports = ruta;
const { response, request } = require('express');
const Categoria = require('../models/categoria');
const Role = require('../models/role');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const esRoleValido = async(rol = '') => {

    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }
}

const emailExiste = async( correo = '' ) => {

    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail ) {
        throw new Error(`El correo: ${ correo }, ya está registrado`);
    }
}

const existeUsuarioPorId = async( id ) => {

    // Verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

//vamos a crer un metodo el cual me va servir para comprobar que el rol que tiene nuestro usuario es valido para
//borrar a un usuario

const verificandoRol = ( roles = [] ) => {
    return (req = request, res = response, next) => { 
        //entonces sin mas vamos a comenzar 
        if(!req.usuario){
            return res.status(400).json({
                ok: false,
                msg: 'Se quiere borrar un usuario sin haber hecho la validacion'
            });
        }

        //si es que tenemos un usuario ahora vamos a ver si tiene el puesto para borrar un usuario
        if(!roles.includes(req.usuario.rol)){
            //como no tiene ese rol entonces 
            return res.status(400).json({
                ok: false,
                msg: 'Error el usuario autenticado no tiene los permisos para hacer la eliminacion'
            });
        }

        //entonces ya que verificamos al usuario y vimos que tiene los permisos nos pasamos a lo siguiente
        next();
    }
}

const existeCategoriaId = async (id = '') => {
        //vamos a ver si el id que nos mandan existen 
        const existeCategoria = await Categoria.findById(id);

        if(!existeCategoria){
            //si la categoria no existe entonces
            return res.status(400).json({
                ok: false,
                msg: `Error el id: ${id} no existe`
            });
        }
}

const existeProductoId = async( id ) => {
    //entonces sin mas vamos a comenzar
    const existeProducto = await Producto.findById(id);
    
    if(!existeProducto){
        return res.status(400).json({
            ok: false,
            msg: `Error el id: ${id} no existe en la base de datos`
        });
    }
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    verificandoRol,
    existeCategoriaId,
    existeProductoId
}


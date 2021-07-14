//vamos a continuar con el controlador de busqueda

const { response } = require("express");

const { ObjectId } = require('mongoose').Types;

const Usuario = require('../models/usuario');

const Categoria = require('../models/categoria');

const Producto = require('../models/producto');

const colecciones = [
    "usuario",
    "categoria",
    "producto"
];

//metodo que me va a servir para buscar a un usuario
const buscandoUsuario = async (termino = '', res= response) => {
    //vamos a comenzar 
    const validarTermino = ObjectId.isValid(termino);

    if(validarTermino){
        //si el termino es un id entonces buscamos el usuario
        const usuario = await Usuario.findById(termino);
        
        //vamos a ver si la busqueda arrojo algo
        return res.status(200).json({
            ok: true,
            resultado : (usuario.estado) ? usuario : []
        })
    }

    //si no es un id valido entonces el producto se va a buscar por nombre
    const regex = new RegExp(termino, 'i');

    //ahora vamos a intentar hacer la busqueda
    const buscarNC = await Usuario.find({
        $or: [{nombre: regex}, {correo: regex}],
        $and: [{estado:true}]
    });

    //ahora ya sin mas vamos a mostrar el resultado
    res.status(200).json({
        ok: true,
        resultados: (buscarNC) ? buscarNC : []
    });
}


const buscandoCategoria = async (termino = '', res = response) => {
    //vamos a comenzar
    
    const validarId = ObjectId.isValid(termino);

    if(validarId){
        //si es que el termino es un id entonces
        const existeCategoria = await Categoria.findById(termino).populate('usuario', 'nombre');

        //vamos a devolver el resultado
        return res.status(200).json({
            ok: true,
            resultado: (existeCategoria.estado) ? existeCategoria : []
        })
    }

    //si el termino no es un id entonces la busqueda va a ser por nombre
    const regex = new RegExp(termino, 'i');

    //ahora vamos a intentar hacer la busqueda de la categoria
    const existeCategoria = await Categoria.find({nombre: regex, estado: true}).populate('usuario','nombre');

    //entonces ya solo vamos a devolver la respuesta
    res.status(200).json({
        ok: true,
        resultados: (existeCategoria) ? existeCategoria : []
    });
}


//metodo para buscar un producto
const buscandoProducto = async (termino = '', res = response) => {
    //vamos a terminar
    const validarId = ObjectId.isValid(termino);

    //vamos a ver si es un id
    if(validarId){
        //si el id existe entonces vamos a buscarlo
        const existeProducto = await Producto.findById(termino)
                                .populate('usuario','nombre')
                                .populate('categoria','nombre');

        //vamos a devolver la respuesta
        return res.status(200).json({
            ok: true,
            resultados: (existeProducto.estado) ? existeProducto : []
        });
    }

    //vamos a buscar por nombre del producto
    const regex = new RegExp(termino, 'i');
    
    //ahora vamos a buscar los productos
    const existeProducto = await Producto.find({nombre: regex, estado:true})
                                    .populate('usuario','nombre')
                                    .populate('categoria', 'nombre');

    //vamos a devolver la respuesta
    res.status(200).json({
        ok: true,
        resultados: (existeProducto) ? existeProducto : []
    })
}

const buscando = async(req, res=response) => {
    //vamos a comenzar
    const { coleccion, termino } = req.params;  

    //primero que nada vamos a ver que es lo que vamos a buscar
    const existeCol = colecciones.includes(coleccion);

    if(!existeCol){
        //si es que la coleccion no existe entonces
        return res.status(400).json({
            ok: false,
            msg: `Error la coleccion: ${coleccion} no se encuentra en la base de datos`
        });
    }

    //entonces si encontramos la categoria
    switch(coleccion){
        case 'usuario' :
            //entonces vamos a buscar a un usuario
            buscandoUsuario(termino, res);
        break;
    
        case 'categoria':
            //vamos con la parte de busqueda por categorias asi que manos a la obra
            buscandoCategoria(termino, res);
        break;
            //por ultimo vamos a terminar con la busqueda de un producto en particular    
        case 'producto':
            buscandoProducto(termino, res);
        break;

    }

}

module.exports = {
    buscando
}
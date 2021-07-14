//vamos a definir el controlador de la categoria

const { response } = require("express");

const Categoria = require('../models/categoria');

//vamos con con la funcion para poder visualizar las categorias que tenemos 
const mostrarCategorias = async (req, res = response) => {

    const { inicio = 0, fin = 2 } = req.query;

    const query = { estado: true };

    const [total, cate] = await Promise.all([
        //vamos a mandar a correr todas las promesas al mismo tiempo
        Categoria.countDocuments(query),
        //promesa para conseguir las categorias
        Categoria.find(query)
            .skip(inicio)
            .limit(fin)
            .populate('usuario','nombre')
    ]);

    //entonces ya por ultimo vamos a mostrar todos los resultados de las categorias disponibles
    res.status(200).json({
        ok: true,
        total,
        categorias: (cate) ? cate : []
    });
}

//funcion para mostrar las categorias pero ahora por id
const mostrarCategoriasId = async (req, res = response) => {
    //sin mas vamos a comenzar con la parte de mostrar la categoria por id
    
    //hasta donde tengo entendido ya pasamos por las validaciones de que es un id de mongo 
    //y que ademas ese id existe como tal en la base de datos entonces no queda mas que mostrarlo

    const { id } = req.params;

    const eCategoria = await Categoria.findById(id).populate('usuario', 'nombre');

    res.status(200).json({
        ok: true,
        categoria : eCategoria
    });    
}


//funcion para crear una nueva categoria 
const crearCategoria = async(req, res=response) => {

    //vamos a sacar la categoria del body
    const { estado, usuario, ...data } = req.body; 

    //ahora vamos a ver que no haya una categoria con el mismo nombre
    const existeCategoria = await Categoria.findOne({nombre: data.nombre});

    if(existeCategoria){
        //si es que si existe entonces
        return res.status(400).json({
            ok: false,
            msg: `Error la categoria ${data.nombre} ya existe`
        })
    }

    data.nombre = data.nombre.toUpperCase();
    //si es que no existe entonces vamos a crear la nueva categoria
    const datosCategoria = {
        nombre: data.nombre,
        usuario: req.usuario._id
    };

    //ahora vamos a intentar crear la nueva categoria
    const nuevaCategoria = new Categoria(datosCategoria);

    await nuevaCategoria.save();

    res.status(201).json({
        ok: true,
        nuevaCategoria 
    });
}

const actualizarCategoria = async (req, res = response )=> {
    //vamos a comenzar
    const { id } = req.params;    

    //ahora vamos a obtener los datos que vamos a actualizar
    const {usuario, estado, ...data} = req.body;

    data.nombre = data.nombre.toUpperCase();
    //bien ahora vamos a almacenarlos
    const updateDatos = {
        nombre: data.nombre,
        usuario: req.usuario._id
    };

    //ahora si vamos a preparar la actualizacion.
    const updateCategoria = await Categoria.findByIdAndUpdate(id, updateDatos, {new: true}).populate('usuario', 'nombre');

    //vamos a mandar la actualizacion
    res.status(201).json({
        ok: true,
        categoria: updateCategoria
    })
}


//funcion para poder borrar la categoria
const borrarCategoria = async (req, res= response) => {
    //bien sin mas vamos a comenzar
    const { id } = req.params;

    //ok vamos a comenzar con la eliminacion
    const eliminarCategoria = await Categoria.findByIdAndUpdate(id, { estado:false }, {new: true}).populate('usuario','nombre');

    //ahora por ultimo vamos a mostrar la categoria eliminada
    res.status(200).json({
        ok: true,
        categoriaEliminada: eliminarCategoria
    })

}

module.exports = {
    crearCategoria,
    mostrarCategorias,
    mostrarCategoriasId,
    actualizarCategoria,
    borrarCategoria
}

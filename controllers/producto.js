//vamos a crear el controlador del producto asi que manos a la obra

const { response } = require("express");

const Producto = require('../models/producto');

//controlador para mostrar los productos
const mostrarProductos = async (req, res = response) => {
    //vamos a comenzar 
    const { inicio = 0, fin = 10 } = req.query;

    const condicion = { estado: true };
    //ahora vamos a mostrar los productos
    const [total, articulos] = await Promise.all([
        //vamos con la primera promesa
        Producto.countDocuments(condicion),
        //vamos con la segunda promesa
        Producto.find(condicion)
            .skip(inicio)
            .limit(fin)
            .populate('usuario','nombre')
            .populate('categoria', 'nombre')
    ]);

    //ahora solo nos queda mostrarlos
    res.status(200).json({
        ok: false,
        total,
        productos: (articulos) ? articulos : []
    })
}

//controlador para mostrar un producto por id 
const mostrarProducto = async(req, res= response) => {
    //entonces vamos a comenzar 
    const { id } = req.params;

    //entonces vamos a comenzar
    const articulo = await Producto.findById(id).populate('usuario', 'nombre').populate('categoria','nombre');

    //ahora ya solo lo vamos a mostrar
    res.status(200).json({
        ok: true,
        producto: articulo
    })
}



//controlador para crear un producto
const crearProducto = async(req, res=response) => {
    //vamos a comenzar 

    const { nombre, categoria} = req.body;

    //primero vamos a ver si ya existe un producto con ese nombre
    const existeProducto = await Producto.findOne({nombre});

    //vamos con la condicional
    if(existeProducto){
        return res.status(400).json({
            ok: false,
            msg: `Error el producto ${nombre} ya existe`
        });
    }
    
    const nombreCapitalizado = nombre.toUpperCase();

    //si es que no existe entonces vamos a acomodar los datos 
    const datos = {
        nombre: nombreCapitalizado,
        usuario : req.usuario._id,
        categoria,  
    };
    //ahora si vamos a guardar el producto 
    const nuevoProducto = new Producto(datos);

    await nuevoProducto.save();

    res.status(201).json({
        ok: true,
        producto: nuevoProducto
    })
}

//controlador para actualizar un producto 
const actualizarProducto = async (req, res= response ) => {
    //vamos a comenzar 
    const { id } = req.params;

    const { precio = 0, nombre } = req.body;

    //ahora vamos a acomodar los dato
    const nombreCapitalizado = nombre.toUpperCase();

    const nuevosDatos = {
        nombre: nombreCapitalizado,
        usuario: req.usuario._id,
        precio,
    };

    //vamos con la actualizacion
    const updateProducto = await Producto.findByIdAndUpdate(id, nuevosDatos, {new: true})
                            .populate('usuario','nombre')
                            .populate('categoria','nombre');


    //una vez hecha la actualizacion mandamos el nuevo dato
    res.status(200).json({
        ok: true,
        productoActualizado: updateProducto
    });
}

//controlador para eliminar un producto
const eliminarProducto = async(req, res = response ) => {
    //vamos a comenzar
    const { id } = req.params;

    //vamos a hacer la disque eliminacion
    const eliminando = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true})
                            .populate('usuario', 'nombre')
                            .populate('categoria','nombre');

    //ahora vamos a devolver el producto eliminado
    res.status(202).json({
        ok: true,
        usuarioEliminado : eliminando
    });
}



module.exports = {
    crearProducto,
    mostrarProductos,
    mostrarProducto,
    actualizarProducto,
    actualizarProducto,
    eliminarProducto
}
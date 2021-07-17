
//vamos a empezar a definir los constroladores de la parte de la subida de archivos

//vamos a definir las variables que vamos a necesitar
const { response } = require('express');

const path = require('path');

const fs = require('fs');

require('dotenv').config();

var cloudinary = require('cloudinary').v2;

const { subirArchivo } = require('../helpers/operaciones-archivos');

const Usuario = require('../models/usuario');

const Producto = require('../models/producto');

const CargarArchivo = async (req, res = response ) => {

    try{
        const nombreArchivo = await subirArchivo(req.files, undefined, 'imagenes');      
        res.status(201).json({
            msg: `Se subio el archivo ${nombreArchivo}`
        })
    }catch(error){
        //vamos a comenzar 
        res.status(400).json({
            msg: error
        })
    }
}

//controlador para hacer la actualizacion de una imagen
const actualizarImagen = async (req, res= response) => {
    
    const { coleccion, id } = req.params;

    let modelo;
    //vamos a ver que imagen es la que queremos insertar
    switch(coleccion){

        case 'usuario' :
            //vamos con la parte del producto
            modelo = await Usuario.findById(id);
            if(!modelo){
                //si es que el usuario existe entonces vamos a hacer algo
                return res.status(400).json({
                    msg: 'Error el id del usuario es invalido'
                });
            }
        break;

        case 'producto':
            modelo = await Producto.findById(id);
            if(!modelo){
                //si es que el usuario existe entonces vamos a hacer algo
                return res.status(400).json({
                    msg: 'Error el id del producto es invalido'
                });
            }
        break;
    }
    if(modelo.imagen){

        const pathTemporal = path.join(__dirname, '../uploads/', 'imagenes', modelo.imagen);

        if(fs.existsSync(pathTemporal)){
            //vamos a eliminar el archivo 
            fs.rmSync(pathTemporal);
        }
    }

    //si no existe entonces simplemente lo subo
    const nombreImagen = await subirArchivo(req.files, undefined, 'imagenes');

    //ahora vamos a poner la descripcion de la foto a la base de datos
    modelo.imagen = nombreImagen;

    await modelo.save();

    res.status(200).json({
        msg: 'La imagen se cargo de forma exitosa'
    });

}


const actualizarImagenCloud = async (req, res= response) => {

    cloudinary.config(process.env.CLOUDINARY_URL);

    //bien entonces sin mas vamos a comenzar
    const { coleccion, id } = req.params;
    
    //vamos a darle entonces
    let modelo;

    switch(coleccion){
        case 'usuario' : 
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: 'Error el id del usuario es incorrecto'
                });
            }
        break;

        case 'producto' : 
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: 'Error el id del producto es incorrecto'
                });
            }
        break;
    }
    
    //vamos a ver primero si el usuario tiene ya asignada una imagen
    if(modelo.imagen){
        //si el modelo tiene una imagen entonces
            try{
                const urlImagen = modelo.imagen.split('/');
        
                const nameImage = urlImagen[urlImagen.length - 1];

                const [public_id] = nameImage.split('.');

                await cloudinary.uploader.destroy(`node/${public_id}`);
            }catch(error){
                console.log('El atributo imagen tenia informacion basura');
            }
    }

    //vamos a subir primero una imagen mejor
    const { tempFilePath } = req.files.archivo;
    
    try{
        const archivoSubido = await cloudinary.uploader.upload(tempFilePath, {
            folder: 'node'
        });
        //subimos el archivo sin el menor problema ahora vamos a almacenarlo
        modelo.imagen = archivoSubido.secure_url;

        await modelo.save();

        //vamos a devolver el modelo actualizado
        res.status(200).json({
            ok: true,
            coleccionActualizada: modelo
        })

    }catch(error){
        console.log('el error es => ',error.toString());
        res.status(500).json({
            msg: 'Error al querer subir el archivo el cloudinary'
        });
    }
}

//controlador que sirve para mostrar la imagen
const getImagen = async(req, res= response) => {
    //vamos a comenzar 
    const { coleccion, id } = req.params;

    let modelo;
    //vamos a comenzar entonces
    switch(coleccion){
        case 'usuario' :
            modelo = await Usuario.findById(id);
            if(!modelo){
                res.status(400).json({
                    msg: 'Error el id de usuario no se encuentra en la base de datos'
                });
            }
        break;

        case 'producto': 
        modelo = await Producto.findById(id);
        if(!modelo){
            res.status(400).json({
                msg: 'Error el id de producto no se encuentra en la base de datos'
            });
        }
        break;
    }

    //bien ya tenemos el modelo sobre el cual vamos a mostrar el producto
    if(modelo.imagen){
        //este controlador lo obtiene imagenes que se encuentren en la parte del servidor asi que sin mas vamos a comenzar
        
        //vamos a poner el path
        const ubicacion = path.join(__dirname, '../uploads/', 'imagenes', modelo.imagen);

        //ahora vamos a ver si existe la imagen
        if(!fs.existsSync(ubicacion)){
            //si es que la imagen no existe

            const pathnot = path.join(__dirname,'../assets/not_found.jpg');

            return res.sendFile(pathnot);
        }
       
        //si es que si esta entonces la devolvemos
        res.sendFile(ubicacion);
    }else{
        const pathnot = path.join(__dirname,'../assets/not_found.jpg');

        res.sendFile(pathnot);
    }
}


module.exports = {
    CargarArchivo,
    actualizarImagen,
    actualizarImagenCloud,
    getImagen

}

//vamos a continuar con la seccion 13 del curso asi que manos a la obra

//al parecer ya tenemos listo la parte de subir la imagen entonces ahora vamos con la parte de mostrar

//ya le puse una imagen a aldo, ahora vamos a ponerle una imagen a
//carmen id => 60db6e48354fa31338d040c2
//arturo mariano id => 60db6fc35f122e1704574227
//vamos con la validacion del archivo
const path = require('path');

const fs = require('fs');


const { response } = require('express');

const { v4: uuidv4 } = require('uuid');

const validarArchivoSubir = (req, res= response, next) => {

    //ahora si vamos a comenzar con la validacion
    if(!req.files || Object.keys(req.files).length === 0 || !req.files.archivo){
        //entonces vamos a hacer lo siguiente
        return res.status(200).json({
            msg: 'Error tenemos que recibir un archivo para poder subirlo'
        });
    }
    //bien ahora sin mas vamos a comenzar con la subida de archivos asi que manos a la obra
    next();
}


//metodo para hacer la parte de la subida del archivo

//vamos a recibir los siguientes parametros
const subirArchivo = ( files, archivosPermitidos = ['png', 'jpg', 'jpeg', 'gif'], carpeta = 'imagenes' ) => {
    //entonces sin mas vamos a comenzar con la parte de subida de archivos
    return new Promise( (resolve, reject) => {
        //vamos a comenzar 
        const {archivo} = files;

        const nombreT = archivo.name;
        //vamos a preparar el archivo a subir
        const arrNombre = nombreT.split('.');
        
        //vamos a guardar la extension 
        const extension = arrNombre[arrNombre.length - 1].toLowerCase();

        //vamos a colocar la condicional para ver si el archivo es valido
        if(!archivosPermitidos.includes(extension)){
            //si es que la extension del archivo no corresponde entonces
            return reject(`Error el archivo tiene una extension no permitida --${archivosPermitidos}`);
        }
        //ahora vamos a generar el nombre
        let nombre = uuidv4()+'.'+extension;

        //ahora vamos a colocar el path
        const pathTemp = path.join(__dirname, '../uploads/', carpeta, nombre);

        //ahora si vamos a subir el archivo
        archivo.mv(pathTemp, (error) => {
            if(error){
                reject('Error al querer subir el archivo');
            }

            resolve(nombre);
        });
    });
}

    //metodo para ver si la coleccion que nos mandaron esta permitida
    const categoriasPermitidas = async (categoria = '') => {
        //vamos a comenzar
        const categoriasP = ['usuario', 'producto'];

        const categoriacapitalizada = categoria.toLowerCase();

        if(!categoriasP.includes(categoriacapitalizada)){
            //si no puso la categoria permitida entonces
            return new Error(`Error la coleccion no es valida --${categoriasP}`);
        }

        //si la coleccion es valida entonces
        return true;
    }

module.exports = {
    validarArchivoSubir,
    subirArchivo,
    categoriasPermitidas
}
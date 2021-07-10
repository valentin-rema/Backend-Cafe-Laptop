
//vamos a intentar validar el token que recibimos en el parametro 
const { request, response } = require('express');

const Usuario = require('../models/usuario');

const jwt = require('jsonwebtoken');

require('dotenv').config();

const validarJwt = async (req= request, res = response, next) => {

    //bien primero que nada vamos a extraer el token
    const token = req.header('x-token');

    //ahora vamos a validar si tenemos el token
    if(!token){
        //si es que no tenemos el token entonces
        return res.status(400).json({
            ok: false,
            msg: 'Error debe de enviar el token de autenticacion'
        })
    }
    //bien ya que validamos el token ahora vamos a ver si ee token es valido
    try{
        //vamos a comenzar 
        const { uid } = await jwt.verify(token, process.env.LLAVE_JWT);
        //bien vamos a ver si el token es valido

        //ok entonces si ya tenemos el token vamos a sacar el usuario que necesitamos
        const existeUsuario = await Usuario.findById(uid);

        //ahora vamos a ver si existe ese usuario
        if(!existeUsuario){
            return res.status(400).json({
                ok: false,
                msg: 'Error no se encontro el usuario con ese token'
            });
        }
        req.usuario = existeUsuario;
        next();

    }catch(error){
        return res.status(400).json({
            ok: false,
            msg: 'Error el token que envio no es valido'
        })
    }
}

module.exports = {
    validarJwt
}

//vamos a ingresar los controladores de la parte de las autenticaciones
const { request, response } = require('express');

const bcryptjs = require('bcryptjs');

const { generarToken} = require('../middlewares/token');

const { validarGoogle } = require('../middlewares/validar-google');

const Usuario = require('../models/usuario');

const login = async(req = request, res = response) => {
    
    //ahora si vamos a darle a la parte del login
    const { correo, password } = req.body;

    //bien ahora lo que vamos a hacer son las respectivas validaciones
    const existeEmail = await Usuario.findOne({correo});

    if(!existeEmail){
        //si no tenemos el correo entonces
        return res.status(400).json({
            msg: 'El correo que ingreso no existe'
        });
    }

    //vamos ahora con el password   
    const cPassword = bcryptjs.compareSync(password, existeEmail.password);
    if(!cPassword){
        return res.status(400).json({
            msg: 'Error la contraseña es incorrecta'
        });
    }

    //ahora vamos a validar si el usuario esta inactivo
    if(!existeEmail.estado){
        return res.status(400).json({
            msg: 'El usuario actualmente se encuentra sin autorizacion para acceder'
        });
    }

    //bien entonces una vez haciendo todas las validaciones procedemos a crear el token
    const token = await generarToken(existeEmail.id);

    res.status(200).json({
        ok: true,
        existeEmail,
        token
    })
};

//controlador para poder acceder al sistema a travez de una cuenta de google
const loginGoogle = async(req = request, res = response) => {
    
    const { id_token } = req.body;

    //vamos a comenzar con la verificacion del token del usuario
    const usuarioGoogle = await validarGoogle(id_token);

    const { correo, nombre, imagen } = usuarioGoogle;


    //ahora vamos a ver si existe un correo
    const existeEmail = await Usuario.findOne({correo});

    if(existeEmail){
        //si el email ya existe entonces 
        return res.status(400).json({
            msg: 'Error la cuenta ya existe intente con otra'
        })
    }

    //si no existe el usuario entonces vamos a crear uno nuevo
    const data = {
        imagen,
        google: true,
        nombre,
        correo,
        password: '12345',
    };

    //ahora lo que vamos a hacer es crear un nuevo usuario
    const usuarioNuevo = await new Usuario(data);

    await usuarioNuevo.save();

    //vamos a retornar el nuevo usuario creado
    res.status(200).json({
        ok: true,
        usuarioNuevo
    });
}

module.exports = {
    login,
    loginGoogle
}

//bien señores vamos a continuar con el proyecto al parecer ya tenemos la parte de generar el token ahora vamos a 
//intentar querer borrar algun usuario asi que sin mas manos a la obra




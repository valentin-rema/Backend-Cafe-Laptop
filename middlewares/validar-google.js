//bien vamos a validar el token que recibimos de parte de google

require('dotenv').config();

const { request, response } = require('express');

const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_ID);

const validarGoogle = async (token = '') => {

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_ID
    });
    const {
            email: correo,
            name: nombre,
            picture: imagen
          } = ticket.getPayload();

    return {correo, nombre, imagen};
}

module.exports = {
    validarGoogle
}
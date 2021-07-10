//bien ahora si vamos a crear el token

const jwt = require('jsonwebtoken');

require('dotenv').config();

const generarToken = async( uid = '') => {
    return new Promise((resolve, reject) => {
        //entonces sin mas vamos a comenzar 
        const payload = { uid };
        //generando token
        jwt.sign(payload, process.env.LLAVE_JWT, {
            expiresIn: '2h'
        }, (err, token) => {
            if(err){
                reject('Error al generar el token');
            }else{
                resolve(token)
            }
        });
    });
};

module.exports = {
    generarToken
}
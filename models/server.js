const express = require('express');
const cors = require('cors');

const fileUpload = require('express-fileupload');


const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app  = express();
        this.port = process.env.PORT;

        //vamos a crear una varible que almacene todas las rutas de nuestro RestServer
      
        //vamos a ingresar una nueva ruta

        this.paths = {
            usuarios:   '/api/usuarios',
            login:      '/api/auth',
            categorias: '/api/categorias',
            productos: '/api/productos',
            busqueda: '/api/busqueda',
            upload: '/api/uploads'
        }
        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }


    middlewares() {

        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio Público
        this.app.use( express.static('public') );

        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));

    }

    routes() {
        this.app.use( this.paths.usuarios, require('../routes/usuarios'));
        this.app.use( this.paths.login, require('../routes/auth'));
        this.app.use( this.paths.categorias, require('../routes/categorias'));
        this.app.use( this.paths.productos, require('../routes/productos'));
        this.app.use( this.paths.busqueda, require('../routes/busquedas'));
        this.app.use( this.paths.upload, require('../routes/upload'));
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }

}

module.exports = Server;


//Vamos bien ahora vamos a intentar crear el modelo para la parte de las categorias


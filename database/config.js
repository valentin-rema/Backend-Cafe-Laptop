const mongoose = require('mongoose');



const dbConnection = async() => {

    try {

        await mongoose.connect( process.env.URL_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
    
        console.log('Base de datos online');

    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la base de datos');
    }
}

module.exports = {
    dbConnection
}

//ok señores entonces sin mas vamos a comenzar con la parte de los jsonwebtoken



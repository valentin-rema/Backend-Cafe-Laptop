
//vamos a crear el modelo de la categoria

const { Schema, model } = require('mongoose');


const schemeCategoria = new Schema({
    //vamos a definir los atributos de nuestro esquema
    nombre: {
        type: String,
        required: true,
        unique: true
    },
    estado: {
        type: Boolean,
        required: true,
        default: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});


//vamos a mandar los datos de la categoria de una manera mas limpia
schemeCategoria.methods.toJSON = function(){
    const { _id, __v, ...categoria} = this.toObject();
    categoria.id = _id;
    return categoria;
}

//entonces una vez terminado nuestro esquema ya solo vamos a exportarlo
module.exports = model('Categoria', schemeCategoria);


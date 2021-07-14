//bien vamos a comenzar con la construccion del modelo para el producto
const { Schema, model } = require('mongoose');


//a darle caña
const schemaProducto = new Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true,

    },
    descripcion: {
        type: String,
        default: 'Esta Rico'
    },
    disponible: {
        type: Boolean,
        default: true
    }
});

//metodo para devolver el esquema como nosotros quieramos 
//schemaProducto.methods.toJSON = function(){
//    const {  }
//}



//vamos a exportar nuestro esquema
module.exports = model('Producto', schemaProducto);
const {Schema, model} = require('mongoose');

const CarShema = new Schema({
    idPlaca: {
        type : String,
        required : true
    },
    nombreCarro: {
        type : String,
        required : true
    },
    marcaCarro: {
        type : String,
        required : true
    },
    modeloCarro: {
        type : String,
        required : true
    },
    colorCarro: {
        type : String,
        required : true
    },
    valorCarro: {
        type : Number,
        required : true
    },
    pais: {
        type: String,
        require: true
    },
    imagenCarro: {
        type : String,
        required : true
    },
    user: {
        type : String,
        required : true
    },
    idUser: {
        type : String,
        required : true
    },
    idCompra: {
        type : String,
        required : false
    },
    idVenta: {
        type : String,
        required : false
    }
}, {
    timestamps : true
})

module.exports = model('Car', CarShema);
const {Schema, model} = require('mongoose');

const SaleShema = new Schema({
    idVenta: {
        type : String,
        required : true
    },
    fechaVenta: {
        type : Date,
        required : true
    },
    valorVenta: {
        type : Number,
        required : true
    },
    idVendedor: {
        type : String,
        required : true
    },
    placaCarro: {
        type : String,
        required : true
    }
}, {
    timestamps : true
})

module.exports = model('Sale', SaleShema);
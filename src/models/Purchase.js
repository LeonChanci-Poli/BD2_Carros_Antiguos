const {Schema, model} = require('mongoose');

const PurchaseShema = new Schema({
    idPlaca: {
        type : String,
        required : true
    },
    fechaCompra: {
        type : String,
        required : true
    },
    valorCompra: {
        type : Number,
        required : true
    },
    identificacionCliente: {
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

module.exports = model('Purchase', PurchaseShema);
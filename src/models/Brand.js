const {Schema, model} = require('mongoose');

const BrandShema = new Schema({
    idMarca: {
        type : String,
        required : true
    },
    nombreMarca: {
        type : String,
        required : true
    }
}, {
    timestamps : true
})

module.exports = model('Brand', BrandShema);
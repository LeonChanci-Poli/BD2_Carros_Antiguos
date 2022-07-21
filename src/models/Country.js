const {Schema, model} = require('mongoose');

const CountryShema = new Schema({
    idPais: {
        type : String,
        required : true
    },
    nombrePais: {
        type : String,
        required : true
    }
}, {
    timestamps : true
})

module.exports = model('Country', CountryShema);
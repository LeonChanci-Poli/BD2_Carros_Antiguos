const {Schema, model} = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new Schema ({
    numeroIdentificacion :  {
        type : String,
        required : true
    },
    nombreCompleto : {
        type : String,
        required : true
    },
    primerNombre : {
        type : String,
        required : true
    },
    segundoNombre : {
        type : String,
        required : false
    },
    primerApellido : {
        type : String,
        required : true
    },
    segundoApellido : {
        type : String,
        required : false
    },
    correoElectronico : {
        type : String,
        required : true,
        unique : true
    },
    contrasena : {
        type : String,
        required : true
    },
    telefono : {
        type : String,
        required : false
    },
    direccion : {
        type : String,
        required : false
    },
    celular : {
        type : String,
        required : false
    }
}, {
    timestamps : true
});

//Método asincrono async -> (se ejecuta en backgraund) para encriptar la contraseña 
UserSchema.methods.encriptarContrasena = async contrasena => {
    //await identifica que es un método asincrono -> Continua con el código siguiente mientras se hace la encriptación
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(contrasena, salt);
};

//Método para desencriptar la contraseña
UserSchema.methods.matchContrasena = async function(contrasena) {
    return await bcrypt.compare(contrasena, this.contrasena);
}

module.exports = model('User', UserSchema);
//Es un módulo que nos ayuda a gestionar la sessión del usuario en la página
const passport = require('passport');
//Es un módulo que nos ayuda a interactuar con la BD
const LocalStrategy = require('passport-local').Strategy;
//Exportamos el modelo de la BD (User)
const User = require('../models/User');

passport.use(new LocalStrategy({
    usernameField : 'correoElectronico',
    passwordField : 'contrasena'
}, async (correoElectronico, contrasena, done) => {
    const user = await User.findOne({correoElectronico});
    //Validar si el correo electrónico existe en BD
    if (!user){
        return done(null, false, { message: '¡No se encotró el usuario!'})
    } else{
        //Si el correo existe, validar si la contraseña coincide desencriptandola
        const match = await user.matchContrasena(contrasena);
        if (match){
            return done(null, user);
        }else{
            return done(null, false, { message: '¡Contraseña Incorrecta!'})
        }
    }
}));

//Serializar el usuario -> Guardar el id
passport.serializeUser((user, done) => {
    //Guardarlo en la sessión del servidor
    done(null, user.id);
});

//Deserializar el usuario -> Obtenerlo con el id
passport.deserializeUser((id, done) => {
    //Comprobar si el usuario tiene permisos para estar en la página
    User.findById(id, (err, user) => {
        done(err, user);
   });
});
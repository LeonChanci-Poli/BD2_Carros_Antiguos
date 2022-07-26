//Se crea un objeto para guardar las funciones
const usersCtrl = {};

//Es un módulo que nos ayuda a gestionar la sessión del usuario en la página
const passport = require('passport');

//Exportamos el modelo de la BD (User)
const User = require('../models/User');

//Función para mostrar el formulario de Registro de Usuario
usersCtrl.renderSignUpForm = (req, res)=> {
    res.render('users/signup');
}

//Función asíncrona para mostrar la pantalla de Registro
usersCtrl.signUp = async (req, res)=> {
    //Se crea variable tipo arreglo para almacenar los tipos de errores
    const errors = [];

    //Obtenemos las variables que llegan del req.body
    const { numeroIdentificacion, primerNombre, segundoNombre,
            primerApellido, segundoApellido, correoElectronico, 
            contrasena, confirmarContrasena } = req.body;
    
    //Validar que las contraseñas sean iguales
    if(contrasena != confirmarContrasena){
        errors.push({text: '¡Las Contraseñas no son iguales!'});
    }
    //Validar el número de caracteres que tiene la contraseña
    if(contrasena.length < 4){
        errors.push({text: '¡La contraseña No debe ser menor a 4 caracteres!'});
    }
    //Validar si hay almenos 1 error 
    if(errors.length > 1){
        //volver a la pantalla 'users/signup', pasandole de nuevo los campos llenos
        res.render('users/signup', {
            errors,
            numeroIdentificacion,
            primerNombre,
            segundoNombre,
            primerApellido, 
            segundoApellido,
            correoElectronico,
            contrasena,
            confirmarContrasena
        });
    //Si no hay ningun error
    }else{
        //Buscar en la base de datos por medio del "correoElectronico"
        const emailUser = await User.findOne({ correoElectronico : correoElectronico });

        const idUser = await User.findOne({ numeroIdentificacion : numeroIdentificacion });

        //Validar si el usuario ya existe o no
        if(emailUser){
            //Si ay existe saca mensaje de error o lo redirecciona
            req.flash('error_msg', '¡El usuario ya está registrado con ese Email!');
            res.redirect('/users/signup');
        }else if(idUser){
            req.flash('error_msg', '¡El usuario ya está registrado con esa Identificación!');
            res.redirect('/users/signup');
        }else{
            //Si no existe, se crea el usaurio en BD
            const telefono = null;
            const direccion = null;
            const celular = null;
            let nombreCompleto = primerNombre.trim()+" "+segundoNombre.trim()+" "
                                +primerApellido.trim()+" "+segundoApellido.trim();
            nombreCompleto = nombreCompleto.replace("  "," ").trim();

            const newUser = new User({numeroIdentificacion, nombreCompleto, primerNombre, segundoNombre,
                                      primerApellido, segundoApellido, correoElectronico, contrasena, 
                                      telefono, direccion, celular});
            newUser.contrasena = await newUser.encriptarContrasena(contrasena);
            console.log(newUser);
            await newUser.save();
            req.flash('success_msg', '¡Usuario registrado exitosamente!');
            res.redirect('/users/signin');
        }
    }
}

//Función para mostrar el formulario de Inicio de sessión
usersCtrl.renderSignInForm = (req, res)=> {
    res.render('users/signin');
}

//Función para usar la Autenticación creada en el passport
usersCtrl.signIn = passport.authenticate('local', {
    failureRedirect: '/users/signin',
    successRedirect: '/cars',
    failureFlash: true
});

//Función para salir de la sessión de usuario
usersCtrl.logout = (req, res)=> {
    //Finalizar la sessión
    req.logout();
    req.flash('success_msg','¡Sesión cerrada correctamente!');
    res.redirect('/users/signin');
}

//Función asíncrona para traer el usuario a editar y mostrarla en el formulario de edición
usersCtrl.renderEditFormUser = async (req, res)=> {
    const user = await User.findById(req.params.id).lean();
    res.render('users/edit-user', { user });
}

//Función asíncrona para actualizar los datos del usuario
usersCtrl.updateUser = async (req, res)=> {
    //Extraer las variables que llegan del req.body
    const { primerNombre, segundoNombre, primerApellido, segundoApellido, 
            correoElectronico, telefono, direccion, celular} = req.body;
    
    let nombreCompleto = primerNombre.trim()+" "+segundoNombre.trim()+" "
                        +primerApellido.trim()+" "+segundoApellido.trim();
    nombreCompleto = nombreCompleto.replace("  "," ").trim();        

    await User.findByIdAndUpdate(req.params.id, 
        {nombreCompleto, primerNombre, segundoNombre, primerApellido, segundoApellido,
         correoElectronico, telefono, direccion, celular});
    req.flash('success_msg', '¡Perfil actualizado exitosamente!');
    res.redirect('/cars');
}

//Exportar el objeto indexCtrl
module.exports = usersCtrl;
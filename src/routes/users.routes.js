//PÁGINA DE AUTENTICACIÓN Y REGISTRO
const { Router } = require('express');
const router = Router();

//Traer las funciones desde el controlador
const { renderSignUpForm, signUp, renderSignInForm, signIn, logout, 
        renderEditFormUser, updateUser, renderFormRecoverPass, 
        recoverPassword} = require('../controllers/user.controller')

//Trae la función de autenticación del usuario
const { isAuthenticated } = require('../helpers/auth')

//*****************************NEW USERS*****************************//
//Cuando se obtenga la ruta '/users/signup' ejecutar la función de renderSignUpForm
router.get('/users/signup', renderSignUpForm);

router.post('/users/signup', signUp);


//*****************************LOGIN USERS*****************************//
//Cuando se obtenga la ruta '/users/signin' ejecutar la función de renderSignInForm
router.get('/users/signin', renderSignInForm);

router.post('/users/signin', signIn);

router.get('/users/logout', logout);

//***************************EDIT PROFILE USER***************************//
//Obtenemos el usuario para renderizar el formulario de edición
router.get('/users/edit/:id', isAuthenticated, renderEditFormUser);
//Enviamos la actualización del usuario
router.put('/users/edit/:id', isAuthenticated, updateUser);

//************************RECOVER PASSWORD USER**************************//
//Obtenemos la ruta para renderizar el formulario de recuperación de contraseña
router.get('/users/renderRecoverPass', renderFormRecoverPass);

//Obtenemos la ruta para el envío de correo electrónico para la recuperación de contraseña
router.post('/users/recoverPassword', recoverPassword);


//Exportar router
module.exports = router;
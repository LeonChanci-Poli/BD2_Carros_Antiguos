//PÁGINA DE CARROS
const { Router } = require('express');
const router = Router();

//Es un módulo que contiene utilidades para trabajar con rutas de fichero
const path = require('path');
//Es un módulo que nos ayuda a gestionar el guardado de la imagenes subidas
const multer = require('multer');
//Es un módulo para generar UUIDS
const { v4: uuidv4 } = require('uuid');

//Configuración archivo imagen de subida
const imgStorage = multer.diskStorage({
    destination: path.join(__dirname, '../public/uploadImages'),
    filename: (req, file, cb) => {
        cb(null, uuidv4()+"_"+file.originalname)
    }
});


//Traer las funciones desde el controlador
const { 
    renderCarForm, 
    createNewCar,
    renderCars, 
    renderEditForm, 
    updateCar, 
    deleteCar
} = require('../controllers/car.controller')

//Trae la función de autenticación del usuario
const { isAuthenticated } = require('../helpers/auth')

//Usar multer para guardar las imagenes subidas
const uploadImage = multer({
    storage: imgStorage,
    dest: path.join(__dirname, '../public/uploadImages'),
    limits: {fileSize: 2000000},
    fileFilters: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const mimeType = fileTypes.test(file.mimetype);
        const extName = fileTypes.test(path.extname(file.originalname));
        if (mimeType && extName){
            return cb(null, true);
        }else{
            cb("Error: Archivo debe ser una imagen válida");
        }
    }
}).single('imagenCarro');

//*********************************** GET ALL MY CARS ***********************************//
//Cuando se obtenga la ruta '/cars' ejecutar la función de renderCars
router.get('/cars', isAuthenticated, renderCars);


//************************************* NEW CAR *************************************//
//Cuando se obtenga la ruta '/cars/add' ejecutar la función de renderCarForm
router.get('/cars/add', isAuthenticated, renderCarForm);

//Cuando se envíe por POST; desde la ruta '/cars/new-car' ejecutar la función de createNewCar
router.post('/cars/new-car', uploadImage, isAuthenticated, createNewCar);


//*********************************** EDIT CARS ***********************************//
//Cuando se obtenga la ruta '/cars/edit/:id' ejecutar la función de renderEditForm
router.get('/cars/edit/:id', isAuthenticated, renderEditForm);

//Cuando se envíe por PUT; desde la ruta '/cars/edit/:id' ejecutar la función de updateCar
router.put('/cars/edit/:id', uploadImage, isAuthenticated, updateCar);


//*********************************** DELETE CAR ***********************************//
//Cuando se envíe por DELETE; desde la ruta '/cars/edit/:id' ejecutar la función de deleteCar
router.delete('/cars/delete/:id', isAuthenticated, deleteCar);


//Exportar router
module.exports = router;
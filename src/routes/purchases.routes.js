//PÁGINA DE COMPRAS
const { Router } = require('express');
const router = Router();

//Traer las funciones desde el controlador
const { 
    renderAllCars
} = require('../controllers/purchase.controller')

//Trae la función de autenticación del usuario
const { isAuthenticated } = require('../helpers/auth')

//*********************************** GET ALL CARS ***********************************//
//Cuando se obtenga la ruta '/cars' ejecutar la función de renderCars
router.get('/purchase-cars', isAuthenticated, renderAllCars);

//Exportar router
module.exports = router;
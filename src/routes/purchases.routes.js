//PÁGINA DE COMPRAS
const { Router } = require('express');
const router = Router();

//Traer las funciones desde el controlador
const { 
    renderAllCars,
    renderPurchaseForm,
    createNewPurchase
} = require('../controllers/purchase.controller')

//Trae la función de autenticación del usuario
const { isAuthenticated } = require('../helpers/auth')

//*********************************** GET ALL CARS ***********************************//
//Cuando se obtenga la ruta '/cars' ejecutar la función de renderAllCars
router.get('/purchase-cars', isAuthenticated, renderAllCars);


//*********************************** NEW PURCHASE ***********************************//
//Cuando se obtenga la ruta '/purchase/add' ejecutar la función de renderPurchaseForm
router.get('/purchases/add/:id', isAuthenticated, renderPurchaseForm);

//Cuando se envíe por POST; desde la ruta '/purchase/new-purchase' ejecutar la función de createNewPurchase
router.post('/purchases/new-purchase', isAuthenticated, createNewPurchase);

//Exportar router
module.exports = router;
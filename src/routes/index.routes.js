//PÁGINA DE INICIO Y DE ATERRIZAJE
const { Router } = require('express');
const router = Router();

//Traer las funciones desde el controlador
const { renderIndex, renderAbout } = require('../controllers/index.controller')

//Cuando se obtenga la ruta '/' ejecutar la función de renderIndex
router.get('/', renderIndex);

//Cuando se obtenga la ruta '/about' ejecutar la función de renderAbout
router.get('/about', renderAbout);

//Exportar router
module.exports = router;
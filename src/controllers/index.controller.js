//Se crea un objeto para guardar las funciones
const indexCtrl = {};

//Función para mostrar la pantalla Index
indexCtrl.renderIndex = (req, res)=> {
    res.render('index');
}

//Función para mostrar la pantalla About
indexCtrl.renderAbout = (req, res)=> {
    res.render('about');
}

//Exportar el objeto indexCtrl
module.exports = indexCtrl;
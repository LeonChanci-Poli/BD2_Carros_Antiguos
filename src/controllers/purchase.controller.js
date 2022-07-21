//Se crea un objeto con 2 funciones
const purchaseCtrl = {};

//Exportamos el modelo de la BD (Purchase)
const Purchase = require('../models/Purchase');

//Exportamos el modelo de la BD (Car)
const Car = require('../models/Car');

//Exportamos el modelo de la BD (User)
const User = require('../models/User');

//Función asíncrona para obtener todas los carros
purchaseCtrl.renderAllCars = async (req, res) => {

    //Obtener los carros de la BD que no pertenezcan al usuario en sesión
    //Más la información de marca, pais y usuario(Vendedor)
    const cars = await Car.aggregate([
        {
            '$match': {'user': {'$ne': req.user.id}}
        }, {
            '$lookup': {
            'from': 'brands', 
            'localField': 'marcaCarro', 
            'foreignField': 'idMarca', 
            'as': 'brand'
            }
        }, {
            '$lookup': {
              'from': 'countries', 
              'localField': 'pais', 
              'foreignField': 'idPais', 
              'as': 'country'
            }
        }, {
            '$lookup': {
            'from': 'users', 
            'localField': 'idUser', 
            'foreignField': 'numeroIdentificacion', 
            'as': 'userInfo'
            }
        }
    ]);
    //Pasarle a la vista "all-cars.hbs" los carros retornados de la BD
    res.render('purchases/all-cars', { cars });

}

//Exportar el objeto carsCtrl
module.exports = purchaseCtrl;
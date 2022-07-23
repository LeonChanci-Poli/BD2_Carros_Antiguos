const {mongoose} = require('mongoose');

//Se crea un objeto con 2 funciones
const purchaseCtrl = {};

//Exportamos el modelo de la BD (Purchase)
const Purchase = require('../models/Purchase');

//Exportamos el modelo de la BD (Sale)
const Sale = require('../models/Sale');

//Exportamos el modelo de la BD (Car)
const Car = require('../models/Car');

//Exportamos el modelo de la BD (User)
const User = require('../models/User'); 

//Es un módulo para generar UUIDS
const { v4: uuidv4 } = require('uuid');

//Función asíncrona para obtener todas los carros
purchaseCtrl.renderAllCars = async (req, res) => {

    //Obtener los carros de la BD que NO pertenezcan al usuario en sesión y NO estén vendidos
    //Más la información de marca, pais y usuario(Vendedor)

    const cars = await Car.aggregate([
        {
            '$match': {'user': {'$ne': req.user.id},
                       'idVenta' : {$eq: null}}
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
    //Pasarle a la vista "all-cars.hbs" los carros retornados de la BD (que están en venta)
    res.render('purchases/all-cars', { cars });

}

//Función para mostrar el formulario de agregar una compra
purchaseCtrl.renderPurchaseForm = async (req, res) => {
 
    //Obtener el carro seleccionado que se va a comprar por medio de su ID
    //Obtenemos la información del Carro, Datos del Comprador y Vendedor
    const car = await Car.aggregate([
        {
            '$match': {'_id': new mongoose.Types.ObjectId(req.params.id)}
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

    //Traemos el usuario en sesión
    const user = await User.findById(req.user.id).lean();

    //Generamos la fecha a mostrar
    const date = new Date().toLocaleDateString('co', { weekday:"long", year:"numeric", month:"short", day:"numeric", hour: 'numeric', minute: 'numeric', hour12: true}) 

    res.render('purchases/new-purchase', {car, user, date});
}

//Función asíncrona para crear/insertar una nueva compra
purchaseCtrl.createNewPurchase = async (req, res) => {
    //Obtenemos las variables que llegan del req.body (names del FORM)
    const { idCar, valorCompra, idComprador, placaCarro, idVendedor} = req.body;
    const fechaNow = Date();
    const idCompra = idComprador+"_"+placaCarro+"_"+uuidv4();
    //Creamos un objeto Purchase para posteriormente guardarlo
    const newPurchase = new Purchase({
        idCompra, fechaCompra:fechaNow, 
        valorCompra, idComprador, placaCarro
    });

    const idVenta = idVendedor+"_"+placaCarro+"_"+uuidv4();
    //Creamos un objeto Sale para posteriormente guardarlo
    const newSale = new Sale({
        idVenta, fechaVenta:fechaNow, 
        valorVenta:valorCompra, idVendedor, placaCarro
    });
    
    //Guardamos los objetos de Compra, Venta y actualizamos el carro como "Vendido"
    await newPurchase.save();
    await newSale.save();
    await Car.findByIdAndUpdate(idCar, {idCompra, idVenta});

    req.flash('success_msg', '¡Compra exitosa!');
    res.redirect('/purchase-cars');
}

//Exportar el objeto carsCtrl
module.exports = purchaseCtrl;
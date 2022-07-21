
const {mongoose} = require('mongoose');

//Se crea un objeto con 2 funciones
const carsCtrl = {};

//Exportamos el modelo de la BD (Car)
const Car = require('../models/Car');

//Exportamos el modelo de la BD (Country)
const Country = require('../models/Country')

//Exportamos el modelo de la BD (Brand)
const Brand = require('../models/Brand')

//Función para mostrar el formulario de agregar carro
carsCtrl.renderCarForm = async (req, res) => {
    //Obtener los paises de la BD 
    const countries = await Country.find().lean();
    //Obtener las marcas de la BD 
    const brands = await Brand.find().lean();

    res.render('cars/new-car', {countries, brands});
}

//Función asíncrona para crear/insertar una nuevo carro
carsCtrl.createNewCar = async (req, res) => {
    //Obtenemos las variables que llegan del req.body
    const { idPlaca, nombreCarro, marcaCarro, modeloCarro, colorCarro, valorCarro, pais } = req.body;
    //Creamos un objeto, en formato JSON para posteriormente guardarlo
    const newCar = new Car({
                idPlaca, nombreCarro, marcaCarro, modeloCarro, colorCarro, valorCarro, pais
            });
    //Asociar el registro del carro, al usuario en sesión
    newCar.user = req.user.id;
    newCar.idUser = req.user.numeroIdentificacion;

    //Asociar la ruta de una imagen subida del carro a insertar

    console.log(req.file);

    if(req.file != null){
        newCar.imagenCarro = req.file.filename;      
    }
    //Funcionalidad asíncrona AWAIT = esperar una promesa
    await newCar.save();
    req.flash('success_msg', '¡Carro agregado exitosamente!');
    res.redirect('/cars');
}

//Función asíncrona para obtener todas los carros del usuario logeado
carsCtrl.renderCars = async (req, res) => {
    //Se crea un agregate para sacar el nombre de la marca
    const cars = await Car.aggregate([
        {
          '$match': { 'user': req.user.id }
        }, {
          '$lookup': {
            'from': 'brands', 
            'localField': 'marcaCarro', 
            'foreignField': 'idMarca', 
            'as': 'brand'
          }
        }
    ]);
    //Pasarle a la vista "all-cars.hbs" los carros retornados de la BD
    res.render('cars/all-cars', { cars });
}

//Función asíncrona para traer el carro a editar y mostrarla en el formulario de edición
carsCtrl.renderEditForm = async (req, res) => {
    //Obtener el carro a editar con su marca y pais, para mostrar en el formulario de edición
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
        }
      ]);

    //Obtener los paises de la BD 
    const countries = await Country.find().lean();

    //Obtener las marcas de la BD 
    const brands = await Brand.find().lean();

    //Validar si el carro a editar, pertenece al usuario en sesión
    if(car[0].user != req.user.id){
        req.flash('error_msg', '¡No Autorizado!')
        return res.redirect('/cars');
    }

    res.render('cars/edit-car', {car, brands, countries});
}

//Función asíncrona para actualizar un carro existente 
carsCtrl.updateCar = async (req, res) => {
    //Extraer las variables que llegan del req.body
    const { idPlaca, nombreCarro, marcaCarro, modeloCarro, colorCarro, valorCarro, pais} = req.body;
    
    let imagenCarro;
    if(req.file != null){
        imagenCarro = req.file.filename;
    }

    await Car.findByIdAndUpdate(req.params.id, 
        {idPlaca, nombreCarro, marcaCarro, modeloCarro, colorCarro, valorCarro, pais, imagenCarro});
    req.flash('success_msg', '¡Carro actualizado exitosamente!');
    res.redirect('/cars');
}

//Función asíncrona para eliminar un carro existente
carsCtrl.deleteCar = async (req, res) => {
    await Car.findByIdAndDelete(req.params.id);
    req.flash('success_msg', '¡Carro eliminado exitosamente!');
    res.redirect('/cars');
}

//Exportar el objeto carsCtrl
module.exports = carsCtrl;
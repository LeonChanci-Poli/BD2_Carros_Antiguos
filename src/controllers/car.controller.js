
const {mongoose} = require('mongoose');

//Se crea un objeto con 2 funciones
const carsCtrl = {};

//Exportamos el modelo de la BD (Car)
const Car = require('../models/Car');

//Exportamos el modelo de la BD (Country)
const Country = require('../models/Country');

//Exportamos el modelo de la BD (Brand)
const Brand = require('../models/Brand');

//Exportamos el modelo de la BD (Purchase)
const Purchase = require('../models/Purchase');

//Exportamos el modelo de la BD (Sale)
const Sale = require('../models/Sale');

//Función asíncrona para obtener todas los carros del usuario logeado, tanto los comprados como los creados
carsCtrl.renderCars = async (req, res) => {

  //Se traen los carros de las compras efectuadas del usuario logeado
  const myPurchaseCars = await Purchase.aggregate([
      {
          '$match': {
              'idComprador': req.user.numeroIdentificacion
          }
      }, {
          '$lookup': {
              'from': 'cars', 
              'localField': 'placaCarro', 
              'foreignField': 'idPlaca', 
              'as': 'car'
          }
      }, {
          '$lookup': {
              'from': 'brands', 
              'localField': 'car.marcaCarro', 
              'foreignField': 'idMarca', 
              'as': 'brand'
          }
      }, {
        '$lookup': {
            'from': 'purchases', 
            'localField': 'car.idCompra', 
            'foreignField': 'idCompra', 
            'as': 'purchase'
        }
      }, {
          //Se trae campo, para llearlo en el for
          $addFields: {
              'car.brand': [],
              'car.purchase':[]
          }
      }
  ]);

  //Se traen los carros de las ventas efectuadas del usuario logeado
  const mySaleCars = await Sale.aggregate([
      {
          '$match': {
              'idVendedor': req.user.numeroIdentificacion
          }
      }, {
          '$lookup': {
              'from': 'cars', 
              'localField': 'placaCarro', 
              'foreignField': 'idPlaca', 
              'as': 'car'
          }
      }, {
          '$lookup': {
              'from': 'brands', 
              'localField': 'car.marcaCarro', 
              'foreignField': 'idMarca', 
              'as': 'brand'
          }
      }, {
        '$lookup': {
            'from': 'sales', 
            'localField': 'car.idVenta', 
            'foreignField': 'idVenta', 
            'as': 'sale'
        }
      }, {
        '$addFields': {
            'car.brand': [], 
            'car.sale': []
        }
      }
  ]);

  //Se traen los carros (y la marca del carro) creados por el usuario logeado
  const myCars = await Car.aggregate([
      {
        '$match': { 'user': req.user.id, 'idVenta' : null, 'idCompra' : null }
      }, {
        '$lookup': {
          'from': 'brands', 
          'localField': 'marcaCarro', 
          'foreignField': 'idMarca', 
          'as': 'brand'
        }
      }
  ]);

  //Declaramos las variables para cada tipo De Carro (Comprados, Vendidos y Registrados)
  let myPurchasesCars = [];
  let mySalesCars = [];
  let myAllCars = [];

  //Se va llenando el array (myPurchasesCars) con los CARROS COMPRADOS
  if(myPurchaseCars.length != 0){
    for (let i = 0; i < myPurchaseCars.length; i++) { 
      myPurchasesCars[i] = llenarCarrosComprados(myPurchaseCars, i);
    }
  }

  //Se va llenando el array (mySalesCars) con los CARROS VENDIDOS
  if(mySaleCars.length != 0){
    for (let i = 0; i < mySaleCars.length; i++) {
      mySalesCars[i] = llenarCarrosVendidos(mySaleCars, i);
    }
  }

  if(myCars.length != 0){
    myAllCars = myCars;
  }

  //Almacenamos todos los array en un arrayCompleto
  let arrayComplet = [2];
  arrayComplet[0] = myPurchasesCars;
  arrayComplet[1] = mySalesCars;
  arrayComplet[2] = myAllCars;

  //Creamos variable para mostrar en el hbs, todos los carros en orden (Comprados, Vendidos y Registrados)
  let fullCars = [];
  fullCars = llenarCarsFull(arrayComplet, fullCars);


  //Pasarle a la vista "all-cars.hbs" los carros comprados, vendidos y registrados
  res.render('cars/all-cars', { fullCars } );
}

//Método para lleanr un array con todos los objetos de los carros, validando si estan null o no
llenarCarsFull = (arrayComplet, fullCars) =>{
  let indicePurchase = arrayComplet[0].length;
  let indiceSales = arrayComplet[1].length;
  
  //Llenamos el array si existen carros comprados
  if(arrayComplet[0].length != 0){
    for (let i = 0; i < arrayComplet[0].length; i++) {
      fullCars[i] = arrayComplet[0][i];
    }
  }
  
  //Llenamos el array si existen carros vendidos
  if(arrayComplet[1].length != 0){
    let indiceTotal = indicePurchase;
    for (let k = 0; k < arrayComplet[1].length; k++) {
      fullCars[indiceTotal] = arrayComplet[1][k];
      indiceTotal=indiceTotal+1;
    }
  }

  //Llenamos el array si existen carros registrados
  if(arrayComplet[2].length != 0){
    let indiceTotal2 = indicePurchase+indiceSales;
    for (let j = 0; j < arrayComplet[2].length; j++) {
      fullCars[indiceTotal2] = arrayComplet[2][j];
      indiceTotal2=indiceTotal2+1;
    }
  }
  
  return fullCars;
}

//Función para llenar los campos creados para el array myPurchaseCars (brand[], isPurchase y purchase[])
llenarCarrosComprados = (myPurchaseCars, indice) => {
  if(myPurchaseCars[indice].car != 0){
    //El campo agregado "brand" (con addFields), lo llenamos con la marca del carro
    myPurchaseCars[indice].car[0].brand[0] = myPurchaseCars[indice].brand[0];
    //Llenamos el campo booleano con true ya que fue comprado
    myPurchaseCars[indice].car[0].isPurchase = true;
    if(myPurchaseCars[indice].car[0].purchase[0] != 0){
      //El campo agregado "purchase" (con addFields), lo llenamos con el objeto de la compra del carro (si fue comprado)
      myPurchaseCars[indice].car[0].purchase[0] = myPurchaseCars[indice].purchase[0];
    }
  }
  return myPurchaseCars[indice].car[0];
}

//Función para llenar los campos creados para el array mySaleCars (brand[], isSale y sale[])
llenarCarrosVendidos = (mySaleCars, indice) => {
  if(mySaleCars[indice].car != 0){
    //El campo agregado "brand" (con addFields), lo llenamos con la marca del carro
    mySaleCars[indice].car[0].brand[0] = mySaleCars[indice].brand[0];
    //Llenamos el campo booleano con true ya que fue vendido
    mySaleCars[indice].car[0].isSale = true;
    if(mySaleCars[indice].car[0].sale[0] != 0){
      //El campo agregado "purchase" (con addFields), lo llenamos con el objeto de la compra del carro (si fue comprado)
      mySaleCars[indice].car[0].sale[0] = mySaleCars[indice].sale[0];
    }
  }
  return mySaleCars[indice].car[0];
}

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

  const errors = [];
    //Obtenemos las variables que llegan del req.body
    const { idPlaca, nombreCarro, marcaCarro, modeloCarro, colorCarro, valorCarro, pais } = req.body;
    //Creamos un objeto, en formato JSON para posteriormente guardarlo
    const newCar = new Car({
                idPlaca, nombreCarro, marcaCarro, modeloCarro, colorCarro, valorCarro, pais
            });
    //Asociar el registro del carro, al usuario en sesión
    newCar.user = req.user.id;
    //Asociar la ruta de una imagen subida del carro a insertar
    newCar.idUser = req.user.numeroIdentificacion;

    if(req.file != null){
        newCar.imagenCarro = req.file.filename;      
    }
    
    //Validar si el carro ya existe en bd con el número de la placa
    const car = await Car.findOne({ idPlaca : idPlaca });
    if(car){
      errors.push({text: '¡El carro ya está registrado con esa placa!'});
    }

    if(car){
      const countries = await Country.find().lean();
      const brands = await Brand.find().lean();
      //Buscamos la marca y el pais en bd
      const marca = await Brand.find({'idMarca': marcaCarro},{'nombreMarca': 1}).lean();
      const paisCarro = await Country.find({'idPais': pais},{'nombrePais': 1}).lean();
      //Extraemos las descripciones de los array
      const nameBrand = marca[0].nombreMarca;
      const nameCountry = paisCarro[0].nombrePais;

      //Renderizamos la pantalla de nuevo cargando los campos llenados anteriormente
      res.render('cars/new-car', {errors, countries, brands, nombreCarro, marcaCarro, 
                                  nameBrand:nameBrand, modeloCarro, colorCarro, 
                                  valorCarro, pais, nameCountry:nameCountry});
    //Si todo está bien, guardar el carro en BD
    }else{
      await newCar.save();
      req.flash('success_msg', '¡Carro agregado exitosamente!');
      res.redirect('/cars');
    }  
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
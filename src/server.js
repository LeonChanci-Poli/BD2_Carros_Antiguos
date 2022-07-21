//Es un framework que ayuda a la creación de aplicaciones web, tiene muchas funcionalidades
const express = require('express');
//Plantillas para las vistas, proporcionadas por el framework de express
const exphbs = require('express-handlebars');
//Es un módulo que contiene utilidades para trabajar con rutas de fichero
const path = require('path');
//Es un módulo para visualizar las peticiones que hacemos
const morgan = require('morgan');
//Es un módulo que sirve para usar en el enviado de formularios los PUT O DELETE
const methodOverride = require('method-override');
//Es un módulo que sirve para obtener y ver mensajes entre páginas
const flash = require('connect-flash');
//Es un módulo que sirve para guardar datos en session, proporcionadas por el framework de express
const session = require('express-session');
//Es un módulo que nos ayuda a gestionar la sessión del usuario en la página
const passport = require('passport');

/*const multer = require('multer');
const imgStorage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});*/

//************************************ Inicializaciones ************************************//
const app = express();
//Importar la configuración realizada en 'passport.js'
require('./config/passport');
app.use('/local-files', express.static('/'));

//************************************ Configuraciones ************************************//
//Puerto de express
app.set('port', process.env.PORT || 3000);
//Especificar carpeta dónde están las vistas
app.set('views', path.join(__dirname, 'views'));
//Enrutado de las vistas 
app.engine('.hbs', exphbs.engine({
    //Pantalla por defecto
    defaultLayout: 'main',
    //Plantilla con código común ejem: (Navegación y Footer)
    layoutsDir: path.join(app.get('views'), 'layouts'),
    //Tramos de códigos para importar a otros archivos HTML
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

//********************************* Funciones ejecutadas antes del servidor ****************************//
//Se utiliza para mostrar en la consola, las peticiones realizadas
app.use(morgan('dev'));
//Se usa para que sea capaz de entender los datos que llegan por el form HTML
app.use(express.urlencoded({extended:false}));
//Usar los métodos PUT y DELETE al enviar formularios (normalmente es dificil usarlos desde un form HTML)
app.use(methodOverride('_method'));
//Se usa para guardar variables de sessión
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
//Inicializaciones que utiliza passport para funcionar
app.use(passport.initialize());
app.use(passport.session());
//Usar Flash
app.use(flash());

//Usar multer para guardar las imagenes subidas
/*app.use(multer({
    storage: imgStorage,
    dest: path.join(__dirname, 'public/uploads')
}).single('image'));*/

//************************************ Variables Globales ************************************//
//Se usa para que toda la aplicación tenga acceso a estas variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    if(res.locals.user != null){
        res.locals.userId = req.user.id;
    }
    next();
});


//************************************ Rutas ************************************//
//Añadimos las rutas de las .routes que tenemos
app.use(require('./routes/index.routes'));
app.use(require('./routes/users.routes'));
app.use(require('./routes/cars.routes'));
app.use(require('./routes/purchases.routes'));
//app.get('/', (req, res)=> {
//    res.render('index');
//});

//************************************ Archivos Estáticos ************************************//
//Enrutado para la carpeta public - será siempre estático
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;

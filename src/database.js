const mongoose = require('mongoose');

const { MONGODB_HOST, MONGODB_DATABASE } = process.env;
const MONGODB_URI = `mongodb://${MONGODB_HOST}/${MONGODB_DATABASE}`;

mongoose.connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    //useCreateIndex: true
})
.then(db => console.log('Base de datos conectada correctamente: '+
        'Nombre BD conectada: '+MONGODB_DATABASE))
.catch(err => console.error(err));
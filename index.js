const mongoose = require('mongoose');
// const password = require('./config/config').MONGOPASS
const app = require('./app');
const password = 'alfabeta';

var PORT = 3200;
const URL = `mongodb+srv://rollingcode12i:${password}@first.4gzas.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

(async function con() {
    try {
        await mongoose.connect(URL, {});
        // .then(() => {
            console.log('\x1b[36m La conexión a la base de Datos se realizo correctamente \x1b[37m');
            // Servidor de express para recibir peticiones
            app.listen(PORT, () => {
                console.log('\x1b[33m Server started on port ' + PORT + '\x1b[37m');
            });
        // }).catch(err => {       
    }
    catch (err) {
        console.log('\x1b[31m Error al conectar a la base de datos \x1b[37m', err);
    }
})();
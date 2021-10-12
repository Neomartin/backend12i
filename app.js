var express = require('express');
var app = express();

app.get('/', function(request, response) {
    response.send('Hola desde el servidor express ACTUALIZADO');
})

var user_routes = require('./routes/user');
var transaction_routes = require('./routes/transaction');
var upload_routes = require('./routes/upload')

app.use(express.urlencoded({extended: true}));




app.use('/api', [
    user_routes, 
    transaction_routes,
    upload_routes
])

module.exports = app;
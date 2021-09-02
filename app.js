var express = require('express');
var app = express();

app.get('/', function(request, response) {
    response.send('Hola desde el servidor express ACTUALIZADO');
})

app.get('/users', (request, response) => {
    let usersFromDB = [
        { name: 'Juan', age: 20 },
        { name: 'Pedro', age: 30 },
        { name: 'Jose', age: 33 },
    ];
    response.send(usersFromDB);
});

app.get('/user', (request, response) => {
    let usersFromDB = { name: 'Juan', age: 20 };
    response.send(usersFromDB);
});

app.delete('/user', (request, response) => {
    response.send('llamada a borrar un usuario');
});



module.exports = app;
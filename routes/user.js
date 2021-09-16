var express = require('express');
var userController = require('../controllers/user');

var api = express.Router();

api.post('/user', userController.addUser);
api.get('/user/:id', userController.getUser);
api.delete('/user/:id', userController.delUser);
api.put('/user/:id', userController.updUser);

// User login
api.post('/login', userController.login);

api.get('/users', userController.getUsers);
// api.delete('/users/:prop/:value')

module.exports = api;



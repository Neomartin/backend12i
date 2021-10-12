var express = require('express');
var userController = require('../controllers/user');
var ensureAuth = require('../middlewares/authentication');

var api = express.Router();


api.post('/user', ensureAuth, userController.addUser);
api.get('/user/:id', ensureAuth, userController.getUser);
api.delete('/user/:id', ensureAuth, userController.delUser);
api.put('/user/:id', ensureAuth, userController.updUser);
// api.put('/user-role/:id', ensureAuth, userController.updUserRole);

// User login
api.post('/login', userController.login);


api.get('/users', ensureAuth, userController.getUsers);
// api.delete('/users/:prop/:value')

module.exports = api;

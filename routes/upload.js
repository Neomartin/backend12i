var express = require('express');
var fileUpload = require('express-fileupload');
var userController = require('../controllers/user');
var ensureAuth = require('../middlewares/authentication');

var api = express.Router();

api.use(fileUpload());

api.post('/upload-avatar', ensureAuth, userController.uploadImage);

module.exports = api;

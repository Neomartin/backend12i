var express = require('express');
var api = express.Router();
var transactionController = require('../controllers/transaction')


api.post('/transaction', transactionController.createTransaction);

api.get('/movements/:id?/:type?', transactionController.getMovements);  //req.params.name o req.params.surname o req.params { name, surname }
api.get('/movements-criteria/:criteria?', transactionController.getMovementsByValue);
api.put('/movements-update/:id', transactionController.updateMovement);
api.put('/fix', transactionController.updateInvalidDate);

// api.get('/movements/spent/:id?', transactionController.getUserSpent);
// api.get('/movements/in/:id?', transactionController.getUserIn);

module.exports = api;
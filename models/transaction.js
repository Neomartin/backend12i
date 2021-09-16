'use strict'
var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    value: { type: Number, required: true },
    client_id: { type: String, required: true },
    description: { type: String, required: true },
    created_at: { type: Number, required: true }
})

                                // transactions
module.exports = mongoose.model('Transaction', TransactionSchema);
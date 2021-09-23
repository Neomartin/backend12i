'use strict'
var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var rolesValidos = [
    'CLIENT_ROLE',
    'USER_ROLE',
    'ADMIN_ROLE'
]

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    password: { type: String, required: true },
    dir: String,
    dir_num: Number,
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos }
})

                                // transactions
module.exports = mongoose.model('User', UserSchema);
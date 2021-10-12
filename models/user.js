'use strict'
var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var rolesValidos = [
    'CLIENT_ROLE', //cliente
    'USER_ROLE', //empleado
    'ADMIN_ROLE' //admin o encargado
]

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    password: { type: String, required: true },
    dir: String,
    dir_num: Number,
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos },
    avatar: { type: String, default: 'default.png'},
    active: { type: Boolean, default: true }
})

                                // transactions
module.exports = mongoose.model('User', UserSchema);
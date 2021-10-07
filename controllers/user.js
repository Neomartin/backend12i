var User = require('../models/user');
var bcrypt = require('bcrypt');
// var SEED = require('../config/config').SEED;
var salt = 10;
var jwtHelper = require('../helpers/jwt');

async function addUser(req, res) {
    // Checkeamos si los datos que son requeridos obligatoriamente vienen en la request
    if(!req.body.password || !req.body.email || !req.body.name) {
        return res.status(400).send({
            ok: false,
            msg: 'Debe enviar todos los campos requeridos'
        })
    }

    req.body.email = req.body.email.toLowerCase();
    // let email = req.body.email.toLowerCase();
    let user = new User(req.body);
    
    bcrypt.hash(user.password, salt, (error, hash) => {
        if(error) return res.status(500).send({
            ok: false,
            msg: 'No se pudo guardar usuario',
            error
        });

        if(hash) {
            user.password = hash;
            user.save((error, user) => {
                if(error) return res.status(500).send({
                    ok: false,
                    msg: 'Error al crear usuario',
                    error
                });
        
                if(!user) return res.status(404).send({
                    ok: false,
                    msg: 'No se pudo crear el usuario',
                })
                user.password = undefined;
                return res.status(200).send({
                    ok: true,
                    msg: 'El usuario fue CREADO correctamente',
                    user
                })
            });
        }
    })
    // Se guarda el nuevo usuario en la DB
    // console.log(newUser);
    // res.send({
    //     ok: true, 
    //     msg: 'El usuario se guardo correctamente RESPUESTA DESDE RES', 
    //     user: newUser
    // });
}

async function getUsers(req, res) {
    // llamada a la DB
    if(req.user.role === 'CLIENT_ROLE') {
        return res.status(401).send({ ok: false, msg: 'No tiene permisos para la infomación de todos los usuarios'})
    }

    let users = await User.find({ });

    const total = users.length;
    const per_page = 2;
    const total_pages = Math.ceil(total / per_page);

    res.status(200).send({
        ok: true, 
        msg: 'Se obtuvieron los usuarios',
        users,
        total,
        per_page,
        total_pages
    })
}

/**
 * @users getUser funcion para obtener información de un usuario a través de un ID
 */
function getUser(req, res) {
    // Si no me envian ID de usuario a buscar, devuelvo error por que no voy a saber de quien es que hay que buscar datos
    if(!req.params.id) {
        return res.status(401).send({ ok: false, msg: 'Debe enviar un id'})
    }
    
    // Si el usuario es un cliente y el id que quiere consultar datos de la persona no son los de el, no puedo dejar pasar
    if(req.user.role === 'CLIENT_ROLE' && req.user._id !== req.params.id) {
        return res.status(401).send({ ok: false, msg: 'No tiene permisos para acceder a la información de este usuario'})
    }

    const id = req.params.id;
 
    // llamada a la DB users
    User.findById(id, (error, user) => {
        if(error) return res.status(500).send({
            ok: false, 
            msg: 'Error al obtener usuario', 
            error
        });
        if(!user) return res.status(404).send({
            ok: false,
            msg: 'Usuario NO encontrado',
            user
        })
        return res.status(200).send({
            ok: true, 
            msg: 'Usuario obtenido CORRECTAMENTE de la DB',
            user
        })
    })
}


// User.find({ country: 'Jhon' })
function delUser(req, res) {
    const id = req.params.id;
    User.findByIdAndDelete(id, (error, userDeleted) => {
        if(error) return res.status(500).send({
            ok: false,
            msg: 'No se pudo borrar el usuario',
            error
        });
        if(!userDeleted) return res.status(404).send({
            ok: false,
            msg: 'Usuario no encotrado',
        })

        return res.status(200).send({
            ok: true,
            msg: 'Usuario borrado correctamente',
            userDeleted
        })
    })
}

function updUser(req, res) {

    const id = req.params.id;
    const updateData = req.body;

    if(req.user.role === 'CLIENT_ROLE' && req.user._id !== id) {
        return res.status(401).send({
            ok: false,
            msg: 'No tiene permisos para modificar este usuario.'
        })
    }
    // updateData
    if(updateData.email) updateData.email = updateData.email.toLowerCase();

    User.findByIdAndUpdate(id, updateData, {new: true} ,(error, userUpdated) => {
        if(error) return res.status(500).send({
            ok: false,
            msg: 'No se pudo actualizar el usuario',
            error
        });

        if(!userUpdated) return res.status(404).send({
            ok: false,
            msg: 'Usuario a actualizar no encotrado',
        });

        return res.status(200).send({
            ok: true,
            msg: 'Usuario actualizado',
            userUpdated
        })
    })
}

/**
 * @event login: Loguin de usuario y obtención de token
 */
const login = async (req, res) => {
    // Login user: oreo@rc.com - pass: 1234
    const passwordText = req.body.password;
    const emailToFind = req.body.email;
    try {
        const user = await User.findOne({ email : emailToFind}).exec();
        console.log('find')
        if(!user) return res.status(404).send({
            ok: false,
            msg: 'El usuario no fue encontrado',
        });

        const passwordDBHashed = user.password;
                                            // claveplana    dasdsa0-das-9das90-8dsa7890d7890asd890sad0-dsa0-9
        const result = await bcrypt.compare(passwordText, passwordDBHashed);
        console.log('bcrypt')
        if(result) {
            // Elimino el password del usuario obtenido en la base de datos para no devolverlo como propiedad en mi respuesta
            user.password = undefined;
    
            // Generar el JWT
            const token = await jwtHelper.generateJWT(user);
            console.log('jwt')
            return res.status(200).send({
                ok: true,
                msg: 'Login correcto',
                user, 
                token
            })
        } else {
            return res.status(401).send({
                ok: false,
                msg: 'Datos ingresados no son correcto.'
            }) 
        }
    }
    catch(error) {
        return res.status(500).send({
            ok: false,
            msg: 'No se pudo realizar el login',
            error
        })
    }
}


module.exports = {
    addUser,
    getUsers,
    getUser,
    delUser,
    updUser,
    login
}
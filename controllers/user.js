var User = require('../models/user');

async function addUser(req, res) {
    let reqUser = req.body;
    if(!reqUser.password || !reqUser.email) {
        return res.status(400).send({
            ok: false,
            msg: 'Debe enviar todos los campos requeridos'
        })
    }

    console.log(reqUser);

    let user = new User(reqUser);
    // Se guarda el nuevo usuario en la DB
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

        return res.status(200).send({
            ok: true,
            msg: 'El usuario fue CREADO correctamente',
            user
        })


    });

    // console.log(newUser);
    // res.send({
    //     ok: true, 
    //     msg: 'El usuario se guardo correctamente RESPUESTA DESDE RES', 
    //     user: newUser
    // });
}

async function getUsers(req, res) {
    // llamada a la DB
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

function getUser(req, res) {
    console.log(req);
    console.log(req.params)
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


module.exports = {
    addUser,
    getUsers,
    getUser,
    delUser
}
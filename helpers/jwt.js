const jwt = require('jsonwebtoken');
const SEED = '4lF4-b3T@!'


function generateJWT(user) {
    // Generar token basado en objeto usuario logueado
    console.log('JSON stringify')
    console.log(JSON.stringify(user))
    console.log('toJSON')
    console.log(user.toJSON())
    return new Promise((resolve, reject) => {
        jwt.sign(
            user.toJSON(), //Payload
            SEED, //Semilla o privateKey
            {expiresIn: 360, algorithm: 'HS512'}, //Options
            (error, token) => {
                if(error) {
                    // Deniego la promesa y envío un error
                    console.log(error)
                    reject(error);
                } 
                console.log(token)
                // Resuelvo la promisa satisfactoriamente y devuelvo el token
                resolve(token)
            }
        )
    })
    
}


module.exports = {
    generateJWT
}
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

const ensureAuth = (req, res, next) => {
    if(!req.headers.authorization) {
        return res.status(401).send({ ok: false, msg: 'Autorización incorrecta'})
    }
    const token = req.headers.authorization.replace(/['"]+/g, '');
    jwt.verify(token, SEED, (error, jwtDecoded) => {
        if(error) return res.status(500).send({
            ok: false,
            msg: 'Autorización incorrecta -> no deberia ir(token)',
            error
        });
        req.user = jwtDecoded;
        console.log('Pasa')
        next();
    });
    // next();
}

module.exports = ensureAuth;
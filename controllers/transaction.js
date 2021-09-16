const Transaction = require('../models/transaction'); 


async function createTransaction(req, res) {
    try {
        let newTransaction = new Transaction(req.body);
        // checkear si viene una fecha de creación desde el front o sino asigno la fecha actual
        if(!newTransaction.created_at) {
            // getTime me devuelve la fecha en time unix en milisegundos
            newTransaction.created_at = new Date().getTime()
        }
    
        const transaction = await newTransaction.save();

        if(!transaction) return res.status(401).send({
            ok: false,
            msg: 'No se guardo la transacción'
        })

        return res.status(200).send({
            ok: true,
            msg: 'Se creo la transacción correctamente',
            transaction
        })
    }
    catch(error) {
        return res.status(500).send({
            ok: false,
            msg: 'No se pudo crear la transacción', 
            error
        })
    }
    // req.body: value, client_id, description, 
   
}



//  buscarTransacciones()
module.exports = {
    createTransaction
}
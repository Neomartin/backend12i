const Transaction = require('../models/transaction'); 
const User = require('../models/user');


async function createTransaction(req, res) {
    try {
        let newTransaction = new Transaction(req.body);
        // checkear si viene una fecha de creación desde el front o sino asigno la fecha actual
        console.log(newTransaction);
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
}

const getMovements = async (req, res) => {
    console.log(req)
    console.log('Busqueda by id')
    const id = req.params.id;
    const typeOfMovement = req.params.type;
    if(id) {
        try {
            let transactions = await Transaction.find({ client_id: id });
            let user = await User.findById(id).exec();
            console.log(transactions);
            console.log(user);
            if(!transactions || !user) {
                return res.status(404).send({
                    ok: false,
                    msg: 'No se pudo obtener las transaccioneso usuarios',
                })
            }

            return res.status(200).send({
                ok: true,
                msg: 'Transacciones y Usuario obtenidos correctamente',
                transactions,
                user
            })

            
        } catch(error) {
            return res.status(500).send({
                ok: false,
                msg: 'Error al obtener transacciones del usuario',
                error
            });
        }   
        // Buscar listado a través de un ID
        // Transaction.find({ client_id: id }, (error, transactions) => {
        //     if(error) return res.status(500).send({
        //         ok: false,
        //         msg: 'Error al obtener transacciones del usuario',
        //         error
        //     });
        //     if(!transactions) return res.status(404).send({
        //         ok: false,
        //         msg: 'No se pudo obtener las transacciones del usuario',
        //     })
        //     // Obtener los datos del usuario
        //     User.findById(id, (error, user) => {
        //         if(error) return res.status(500).send({
        //             ok: false,
        //             msg: 'Error al obtener usuario',
        //             error
        //         });
        //         if(!user) return res.status(404).send({
        //             ok: false,
        //             msg: 'No se pudo obtener usuario',
        //         })
        //         return res.status(200).send({
        //             ok: true,
        //             msg: 'Transacciones y Usuario obtenidos correctamente',
        //             transactions,
        //             user
        //         })
        //     })
        // });

        } else {


                                    // $lt: menor que
                                    // $lte: menor o igual que
                                    // $gt: mayor que
                                    // $gte: mayor o igual que
            Transaction.find()
                       .sort('-value description')
                       .populate('client_id', 'name surname email')
                       .exec((error, transactions) => {
                            if(error) return res.status(500).send({
                                ok: false,
                                msg: 'Error al obtener transacción',
                                error
                            });
                            if(!transactions) return res.status(404).send({
                                ok: false,
                                msg: 'No existen transacciones en la base de datos',
                            })
                            return res.status(200).send({
                                ok: true,
                                msg: 'Transacciones obtenidas correctamente',
                                count: transactions.length,
                                transactions,
                            })
                        });
        }

       
}

const getMovementsByValue = function(req, res) {
    console.log('Entra al criteria')
    const criteria = req.params.criteria;
    console.log(criteria)
    Transaction.find({
        $or: [
            {
                $and: [
                    { description: 'Gas'},
                    { created_at: { $gte: 1631833012667 } }
                ]
            }, 
            {
                value: { $gte: 20000 }
            }
        ]
    })

    
        .exec((error, transactions) => {
            if(error) return res.status(500).send({
                ok: false,
                msg: 'Error al obtener Transacciones',
                error
            });
            if(!transactions) return res.status(404).send({
                ok: false,
                msg: 'No se pudo obtener ninguna transacción con los criterios de busqueda enviados',
            })
            return res.status(200).send({
                ok: true,
                msg: `Transacciones encontradas referentes a ${criteria}`,
                count: transactions.length,
                transactions
            })
    })

}

function updateMovement(req, res) {
    const id = req.params.id;
    const update = req.body;
    console.log(req.params)
    Transaction.findByIdAndUpdate(id, update, {new: true} , (error, transactionUpdated) => {
        if(error) return res.status(500).send({
            ok: false,
            msg: 'Error al actualizar la transacción',
            error
        });
        if(!transactionUpdated) return res.status(404).send({
            ok: false,
            msg: 'No se encontró la transacción a actualizar ',
        })
        return res.status(200).send({
            ok: true,
            msg: '',
            transactionUpdated
        })
    } )
}

//  buscarTransacciones();

function updateInvalidDate(req, res) {
    let transactionArrayFromDB = [
        {created_at: 1632442060.957},
        {created_at: 1632442060000},
        {created_at: 1632442060000},
        {created_at: 1632442060.957},
    ];
    transactionArrayFromDB.forEach(t  => {
        let createdLength = t.created_at.toString().length;
        if(createdLength > 10) {
            if(createdLength === 14) {

                t.created_at = t.created_at.toString().replace('.', '');
                t.created_at = parseInt(t.created_at);
            }
            t.created_at = parseInt(t.created_at / 1000);
        }
    })

    console.log(transactionArrayFromDB);
}

module.exports = {
    createTransaction,
    getMovements,
    getMovementsByValue,
    updateMovement,
    updateInvalidDate
}
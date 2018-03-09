'use strict;' //strict compiler mode. see main.js

//import ORM Object
const Model = reqlib('/api/model/model')
const IOResult = Model.IOResult;

const allowedFields = ['id', 'createdAt', 'identifier', 'action', 'action', 'arguments', 'value']

async function getIOResult(req, res, next) {
    //find by id
    const result = await IOResult.findById(req.params.id, {
        attributes: allowedFields 
    });
    //if there is result with the given id
    if (result) {
        //return it
        res.jsonSuccess(result);
    } else {
        return next("no IOResult with the given id found.");
    }

}

module.exports = {
    get: getIOResult,
}

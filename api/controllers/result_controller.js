'use strict;' //strict compiler mode. see main.js

//import ORM Object
const Model = require('../model/sop_model');
const Result = Model.Result;

async function getResult(req, res, next) {
    //find by id
    const result = Result.findById(req.params.id);
    //if there is result with the given id
    if (result) {
        //return it
        res.jsonSuccess(result);
    } else {
        next("no result with the given id found.");
    }

}
async function updateResult(req, res, next) {
    //get the result to update
    let result = Result.findById(req.params.id);
    if (!result) {
        next("no result with the given id found.");
    }
    //we only allow image and description updates so that
    //a malicious attacker can't change the protocol structure
    //over this interface
    const allowedFields = ['imageId', 'description'];
    //perform the actual update
    await result.update(req.body, allowedFields);
    //return the updated result
    res.jsonSuccess(result);
}

module.exports= {
    get: getResult,
    update: updateResult,
}

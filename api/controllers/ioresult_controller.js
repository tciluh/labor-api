'use strict;' //strict compiler mode. see main.js

//import ORM Object
const Model = require('../model/sop_model');
const IOResult = Model.IOResult;

async function getIOResult(req, res, next) {
    //find by id
    const result = IOResult.findById(req.params.id);
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

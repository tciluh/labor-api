'use strict;' //strict compiler mode. see main.js

//import ORM Object
const Model = require('../model/sop_model');
const Result = Model.Result;

async function addResult(req, res, next) {
    const result = await Result.create(req.body);
    //return the created result
    res.json(result);
}
async function getResult(req, res, next) {
    //find by id
    const result = Result.findById(req.params.id);
    //if there is result with the given id
    if (result) {
        //return it
        res.json(result);
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
    //perform the actual update
    await result.update(req.body);
    //return the updated result
    res.json(result);
}

module.exports= {
    get: getResult,
    add: addResult,
    update: updateResult,
}

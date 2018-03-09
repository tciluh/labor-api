'use strict;' //strict compiler mode. see main.js

//import ORM Object
const Model = reqlib('/api/model/model')
const Result = Model.Result;

const allowedFields = ['id', 'description', 'sourceInstructionId', 'targetInstructionId', 'imageId'];
const findOptions = { attributes: allowedFields };
const updateableFields = ['description', 'imageId']

async function getResult(req, res, next) {
    //find by id
    const result = await Result.findById(req.params.id, findOptions);
    //if there is result with the given id
    if (result) {
        //return it
        res.jsonSuccess(result);
    } else {
        return next("no result with the given id found.");
    }

}
async function updateResult(req, res, next) {
    //get the result to update
    let result = await Result.findById(req.params.id, findOptions);
    if (!result) {
        return next("no result with the given id found.");
    }
    //perform the actual update
    await result.update(req.body, updateableFields);
    //return the updated result
    res.jsonSuccess(result);
}

module.exports= {
    get: getResult,
    update: updateResult,
}

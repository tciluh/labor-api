'use strict;' //strict compiler mode. see main.js

//import ORM Object
const Model = reqlib('/api/model/model')
const Instruction = Model.Instruction;

const allowedFields = ['id', 'description', 'equation', 'timerDuration', 'imageId', 'isFirst']
const findOptions = { attributes: allowedFields };
const updateableFields = ['description', 'equation', 'timerDuration', 'imageId']

async function getInstruction(req, res, next) {
    //find by id
    const instr = await Instruction.findById(req.params.id, findOptions);
    //check if we found something.
    if (instr) {
        //return 
        res.jsonSuccess(instr);
    } else {
        return next("no instruction with the given id found.");
    }

}
async function updateInstruction(req, res, next) {
    //get the instruction to update
    let instr = await Instruction.findById(req.params.id, findOptions);
    log.debug(`got instruction to update: ${instr}`);
    //check if there is an instruction to update
    if (!instr) {
        return next("no instruction with the given id found.")
    }
    //perform the actual update
    await instr.update(req.body, updateableFields);
    log.debug(`updated instruction: ${instr}`);
    //return the updated instruction
    res.jsonSuccess(instr);
}

module.exports = {
    get: getInstruction,
    update: updateInstruction,
}

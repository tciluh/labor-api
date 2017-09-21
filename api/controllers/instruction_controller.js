'use strict;' //strict compiler mode. see main.js

//import ORM Object
const Model = require('../model/sop_model')
const Instruction = Model.Instruction;

async function getInstruction(req, res, next) {
    //find by id
    const instr = Instruction.findById(req.params.id);
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
    let instr = Instruction.findById(req.params.id);
    //check if there is an instruction to update
    if (!instr) {
        return next("no instruction with the given id found.")
    }
    //we only allow image and description updates so that
    //a malicious attacker can't change the protocol structure
    //over this interface
    const allowedFields = ['imageId', 'description'];
    //perform the actual update
    await instr.update(req.body, allowedFields);
    //return the updated instruction
    res.jsonSuccess(instr);


}

module.exports = {
    get: getInstruction,
    update: updateInstruction,
}

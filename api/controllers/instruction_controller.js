'use strict;' //strict compiler mode. see main.js

//import ORM Object
const Model = require('../model/sop_model')
const Instruction = Model.Instruction;

async function addInstruction(req, res, next) {
    const instr = await Instruction.create(req.body);
    //return the created instruction.
    res.json(result);
}
async function getInstruction(req, res, next) {
    //find by id
    const instr = Instruction.findById(req.params.id);
    //check if we found something.
    if (instr) {
        //return 
        res.json(instr);
    } else {
        next("no instruction with the given id found.");
    }

}
async function updateInstruction(req, res, next) {
    //get the instruction to update
    let instr = Instruction.findById(req.params.id);
    //check if there is an instruction to update
    if (!instr) {
        next("no instruction with the given id found.")
    }
    //perform the actual updaet
    await instr.update(req.body);
    //return the updated instruction
    res.json(instr);


}

module.exports = {
    get: getInstruction,
    add: addInstruction,
    update: updateInstruction,
}

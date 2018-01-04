'use strict;' //strict compiler mode. see main.js

//import ORM Object
const Model = reqlib('/api/model/model')
const Protocol = Model.Protocol;
const Instruction = Model.Instruction;
const Result = Model.Result;
const Image = Model.Image;
const IOAction = Model.IOAction;

//global data fetch option to only fetch the required fields from the db
//this allows us to simply return the sequelize result as json to the user
//instead of prefiltering it ourselves
const findOptions = {
    attributes: ['id', 'name', 'description'],
    include: [{
        model: Instruction,
        as: 'instructions',
        attributes: ['id', 'description', 'imageId', 'equation', 'timerDuration', 'isFirst'],
        include: [
            {
                model: Result,
                as: 'results',
                attributes: ['id', 'description', 'targetInstructionId', 'imageId'],
            },
            {
                model: IOAction ,
                as: 'actions',
                attributes: ['identifier', 'action', 'arguments', 'equationIdentifier']
            }
        ]
    }]
};

//a route function which returns all Protocols(/SOPs) which are currently in the database
async function getAllProtocols(req, res, next) {
    const protocols = await Protocol.findAll(findOptions);
    res.jsonSuccess(protocols);
}

async function getProtocol(req, res, next) {
    const protocol = await Protocol.findById(req.params.id, findOptions);
    if (protocol) {
        res.jsonSuccess(protocol);
    } else {
        return next('no protocol found with the given id');
    }
}

async function addProtocol(req, res, next) {
    //XXX: transactions please!

    //only allow the name and description fields to be set at first.
    //the steps and instructions get parsed seperatly
    const allowedFields = ['name', 'description'];
    let protocol = await Protocol.create(req.body, { fields: allowedFields });
    log.debug(`created barebone protocol: ${stringify(protocol)}`);
    //parse the instructions.
    //check that we have at least one instruction. otherwise
    //the submitted protocol is not valid
    if(!req.body.instructions
        || !(req.body.instructions instanceof Array)
        || req.body.instructions.length < 1)
        throw new Error("instructions array malformed");
    //iterative approach
    let createdInstructions = [];//all instructions in their creation order
    let createdResults = [];//array of objects where
    //input => input result json,
    //instance => created result instance
    let instructions = req.body.instructions;//alias for less code
    //first loop insert all instructions + results
    //but do not set target instructions yet.
    for(let i = 0; i < instructions.length; ++i){
        const input = instructions[i];
        log.debug(`will create db instruction from: ${stringify(input)}`);
        //insert into the db
        let createdInstruction = await Instruction.create(input,{
            fields: ['description', 'imageId', 'equation', 'timerDuration']
        });
        log.debug(`created db instruction: ${stringify(createdInstruction)}`);
        //make sure to mark the first instruction
        if(i == 0){
            log.debug(`marking instruction as first..`);
            await createdInstruction.update({
                isFirst: true
            });
        }
        //set the protocol
        log.debug(`setting protocol to id: ${protocol.id}`);
        await createdInstruction.setProtocol(protocol);
        //save the id in the createdInstructions array
        createdInstructions[i] = createdInstruction;
        //make sure that this instruction has at least one result
        if(!input.results
            || !(input.results instanceof Array)
            || input.results.length <= 0
        ) return next(`instruction at index ${i} has no result`);
        //create each result
        for(let result of input.results){
            log.debug(`creating result from input: ${stringify(result)}`);
            let createdResult = await Result.create(result, {
                fields: ['description', 'imageId']
            });
            log.debug(`created result: ${stringify(createdResult)}`);
            //set the protocol
            log.debug(`setting protocol to id: ${stringify(protocol.id)}`);
            await createdResult.setProtocol(protocol);
            //set the correct source instruction
            log.debug(`setting source instruction to id: ${stringify(createdInstruction.id)}`);
            await createdResult.setSourceInstruction(createdInstruction);
            //save for the second run since we cant set the
            //target instruction here because it havent been created yet.
            createdResults.push({
                input: result,
                instance: createdResult
            });
        }
        //the user does not have to specify any actions;
        if(input.actions && input.actions instanceof Array && input.actions.length > 0){
            //create each action
            let createdActions = [];
            for(let action of input.actions){
                log.debug(`creating IOAction from input: ${action}`);
                let createdAction = await IOAction.create(action, {
                    fields: ['identifier', 'action', 'arguments', 'equationIdentifier']
                })
                log.debug(`created IOAction: ${createdAction}`);
                createdActions.push(createdAction);
            }
            //add to instruction
            await createdInstruction.setActions(createdActions);
        }
    }
    //second loop fix all the target instructions for each result
    //fancy destructuring syntax.
    //each object in createdResults is an object with the keys input and instance
    //this iterates over each object in createdResults and simultaneously unwraps
    //the object into its parts.
    log.debug(`fixing target instructions...`);
    for(let {input, instance}  of createdResults){
        log.debug(`got input: ${stringify(input)} and instance: ${stringify(instance)}`);
        //make sure that the input is valid
        if(!input) {
            return next({
                msg: "malformed result",
                malformedResult: input
            });
        }
        //the targetInstructionId can be null for the last result.
        if(!input.targetInstructionId) continue;
        const targetIdx = input.targetInstructionId;
        log.debug(`got target idx: ${targetIdx}`);
        //make sure the submitted targetInstruction is even there
        if(targetIdx < 0 || targetIdx >= createdInstructions.length){
            return next({
                msg: "malformed result, targetInstruction Out-of-Bounds" ,
                malformedResult: input
            });
        }
        //get the target Instruction
        let targetInstruction = createdInstructions[targetIdx];
        log.debug(`got target instruction: ${stringify(targetInstruction)}`);
        //update the result
        await instance.setTargetInstruction(targetInstruction);
    }
    //return the created protocol
    res.jsonSuccess(await Protocol.findById(protocol.id, findOptions));
}

async function updateProtocol(req, res, next) {
    let protocol = await Protocol.findById(req.params.id);
    log.debug(`got protocol to update: ${stringify(protocol)}`);
    if (!protocol) {
        //we cant update a protocol we dont have
        return next('no protocol found with the given id');
    }
    const updateableFields = ['description', 'name'];
    //perform the update
    await protocol.update(req.body, updateableFields);
    log.debug(`updated protocol: ${stringify(protocol)}`);
    //return the updated protocol
    res.jsonSuccess(protocol);
}

async function deleteProtocol(req, res, next) {
    let protocol = await Protocol.findById(req.params.id);
    log.debug(`got protocol to delete: ${stringify(protocol)}`);
    if (!protocol) {
        //we cant update a protocol we dont have
        return next('no protocol found with the given id');
    }
    //delete the protocol and all associated instructions & results
    //XXX: create a transaction for this!
    //delete the instructions first
    await Instruction.destroy({
        where: {
            protocolId: protocol.id
        }
    });
    //delete the results second
    await Result.destroy({
        where: {
            protocolId: protocol.id
        }
    });
    //finally delete the protocol itself
    await protocol.destroy();

    //send success response back
    res.jsonSuccess(`protocol with id: ${req.params.id} successfully deleted`);
}

module.exports = {
    getAll: getAllProtocols,
    get: getProtocol,
    update: updateProtocol,
    add: addProtocol,
    delete: deleteProtocol
}

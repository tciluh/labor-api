'use strict;' //strict compiler mode. see main.js

//import ORM Object
const Model = require('../model/sop_model');
const Protocol = Model.Protocol;
const Instruction = Model.Instruction;
const Result = Model.Result;
const Image = Model.Image;

//global data fetch option to only fetch the required fields from the db
//this allows us to simply return the sequelize result as json to the user
//instead of prefiltering it ourselves
const findOptions = {
    attributes: ['id', 'name', 'description'],
    include: [{
        model: Instruction,
        as: 'instructions',
        attributes: ['id', 'description'],
        include: [{
                model: Result,
                as: 'results',
                attributes: ['id', 'description', 'targetInstructionId'],
                include: [{
                    model: Image,
                    as: 'image',
                    attributes: ['id']
                }]
            },
            {
                model: Image,
                as: 'image',
                attributes: ['id']
            }
        ]
    }]
};

//a route function which returns all Protocols(/SOPs) which are currently in the database
async function getAllProtocols(req, res, next) {
    const protocols = await Protocol.findAll(findOptions);
    res.json(protocols);
}

async function getProtocol(req, res, next) {
    const protocol = await Protocol.findById(req.params.id, findOptions);
    if (protocol) {
        res.json(protocol);
    } else {
        next('no protocol found with the given id');
    }
}

async function addProtocol(req, res, next) {
    //only allow the name and description fields to be set.
    //we dont want the user setting anything else
    const allowedFields = ['name', 'description'];
    const protocol = await Protocol.create(req.body, { fields: allowedFields });
    //return the created instance to the user
    res.json(protocol);
}

async function updateProtocol(req, res, next) {
    let protocol = await Protocol.findById(req.params.id);
    if (!protocol) {
        //we cant update a protocol we dont have
        next('no protocol found with the given id');
    }
    const updateableFields = ['description', 'name'];
    //perform the update
    await protocol.update(req.body, updateableFields);
    //return the updated protocol
    res.json(protocol);
}

async function deleteProtocol(req, res, next) {
    let protocol = await Protocol.findById(req.params.id);
    if (!protocol) {
        //we cant update a protocol we dont have
        next('no protocol found with the given id');
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

    //send some kind of response back
    res.send("deletion sucessful");
}

module.exports = {
    getAll: getAllProtocols,
    get: getProtocol,
    update: updateProtocol,
    add: addProtocol,
    delete: deleteProtocol
}

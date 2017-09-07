'use strict;' //strict compiler mode. see main.js

//import ORM Object
const Model = require('../model/sop_model')
const Protocol = Model.Protocol;

//a route function which returns all Protocols(/SOPs) which are currently in the database
async function getAllProtocols(req, res, next) {
    const protocols = await Protocol.findAll();
    res.json(protocols);
}

async function getProtocol(req, res, next) {
    const protocol = await Protocol.findById(req.params.id);
    if(protocol){
        res.json(protocol);
    }
    else{
        next('no protocol found with the given id');
    }
}

async function addProtocol(req, res, next) {
    const protocol = await Protocol.create(req.body);
}

async function updateProtocol(req, res, next) {
    let protocol = await Protocol.findById(req.params.id);
    if(!protocol){
        //we cant update a protocol we dont have
        next('no protocol found with the given id');
    }
    //perform the update
    await user.update(req.body);
    //return the updated protocol
    res.json(protocol);
}

async function deleteProtocol(req, res, next){
    let protocol = await Protocol.findById(req.params.id);
    if(!protocol){
        //we cant update a protocol we dont have
        next('no protocol found with the given id');
    }
    //delete the protocol and all associated instructions & results

}

module.exports = {
    getAll: getAllProtocols,
    get: getProtocol,
    update: updateProtocol,
    add: addProtocol
}

'use strict;' //strict compiler mode. see main.js

//import ORM Object
const Model = require('../model/sop_model')
const Protocol = Model.Protocol;

//a route function which returns all SOPs which are currently in the database
function getAllProtocols(req, res) {
    Protocol.findAll()
        .then((proto) => res.json(proto))
        .catch((error) => res.send(error));
}


module.exports = {
    get_all: getAllProtocols//export the function get_all_sops under the name get_all
}

'use strict;' //strict compiler mode. see main.js

//import ORM Object
const User = require('../model/sop_model')

//a route function which returns all SOPs which are currently in the database
function get_all_sops() {
     return User.findAll();
}

module.exports = {
    get_all: get_all_sops //export the function get_all_sops under the name get_all
}

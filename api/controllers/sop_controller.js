'use strict;' //strict compiler mode. see main.js

//import mongoose
let Mongoose = require('mongoose');
//import SOP Schema
let SOPObject = require('../model/sop_model')

//a route function which returns all SOPs which are currently in the database
function get_all_sops(request, response) {
   SOPObject.find({} , (error, sops) => {
        if(error){
            response.send(error);//there was an error with mongoose.
        }
        response.json(sops);//return the queried SOPs in JSON format.
   });
}

module.exports = {
    get_all: get_all_sops //export the function get_all_sops under the name get_all
}

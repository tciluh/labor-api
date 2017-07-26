'use strict;'//use strict compiler mode. see main.js

let express = require('express'); //import express
let sop_router = express.Router(); //create a new router for the SOPs

let sop_controller = require('../controllers/sop_controller');//import sop controller

//define root route
sop_router.route('/')
    .get(sop_controller.get_all); //on a get return all SOPs


module.exports = sop_router; //export the SOP Router


      

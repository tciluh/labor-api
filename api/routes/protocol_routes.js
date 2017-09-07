'use strict;'//use strict compiler mode. see main.js

let express = require('express'); //import express
let router = express.Router(); //create a new router for the SOPs

let controller = require('../controllers/protocol_controller');//import sop controller

//define root route

//one GET return all protocols
router.route('/')
    .get(controller.get_all); //on a get return all SOPs


module.exports = sop_router; //export the SOP Router


      

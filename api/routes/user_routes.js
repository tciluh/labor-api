'use strict;'//use strict compiler mode. see main.js

let express = require('express'); //import express
let router = express.Router(); //create a new router for the Users

let controller = require('../controllers/user_controller');//import user controller

//define root route
router.route('/')
    .get(controller.getAll); //on a get return all Userss

router.route('/')
    .post(controller.add);

module.exports = router; //export the SOP Router

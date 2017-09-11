'use strict;'//use strict compiler mode. see main.js

let express = require('express'); //import express
let router = express.Router(); //create a new router for the SOPs

let controller = require('../controllers/instruction_controller');//import sop controller

//we need the async utility
let syncify = require('../middleware/async_util');

//we only support add, update, get for instructions
//delete is handled by deleting a linked protocol
//and there shouldnt be a way to get all instructions.

//on POST add an instruction with parameters in the http body
router.route('/')
    .post(syncify(controller.add));

//on GET return an instruction with the given id
router.route('/:id')
    .get(syncify(controller.get));

//on PUT update an instruction with the given id
router.route('/:id')
    .put(syncify(controller.update));

module.exports = router;

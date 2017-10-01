'use strict;' //use strict compiler mode. see main.js

let express = require('express'); //import express
let router = express.Router(); //create a new router for the SOPs

let controller = reqlib('/api/controllers/protocol_controller'); //import sop controller
//import async utility
let syncify = reqlib('/api/middleware/async_util.js');

//define root route

//on GET return all protocols
router.route('/')
    .get(syncify(controller.getAll)); //on a get return all SOPs
//on parameterised GET return a certain protocol
router.route('/:id')
    .get(syncify(controller.get));
//on POST add a protocol
router.route('/')
    .post(syncify(controller.add));
//on DELETE delete the protocol and associated instructions and results.
router.route('/:id')
    .delete(syncify(controller.delete));
//on PUT update the protocol with the given id.
router.route('/:id')
    .put(syncify(controller.update));


module.exports = router; //export the SOP Router

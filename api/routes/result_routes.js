'use strict;' //use strict compiler mode. see main.js

let express = require('express'); //import express
let router = express.Router(); //create a new router for the SOPs

let controller = reqlib('/api/controllers/result_controller'); //import sop controller
//we need the async utility
let syncify = reqlib('/api/middleware/async_util');

//we only support update, get for results
//add is handled by protocol creation
//delete is handled by deleting a linked protocol
//and there shouldnt be a way to get all results.

//on GET return a result with the given id
router.route('/:id')
    .get(syncify(controller.get));

//on PUT update a result with the given id
router.route('/:id')
    .put(syncify(controller.update));

module.exports = router;

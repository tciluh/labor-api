'use strict;' //use strict compiler mode. see main.js

let express = require('express'); //import express
let router = express.Router(); //create a new router for the SOPs

let controller = reqlib('/api/controllers/ioresult_controller'); //import sop controller
//we need the async utility
let syncify = reqlib('/api/middleware/async_util');

//we only support get for ioresults
//add is handled by socketio
//delete is nothing we support right now. 
//and there shouldnt be a way to get all results.

//on GET return a result with the given id
router.route('/:id')
    .get(syncify(controller.get));


module.exports = router;

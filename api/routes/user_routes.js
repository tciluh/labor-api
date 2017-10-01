'use strict;'//use strict compiler mode. see main.js

let express = require('express'); //import express
let router = express.Router(); //create a new router for the Users

let controller = reqlib('/api/controllers/user_controller');//import user controller

let syncify = reqlib('/api/middleware/async_util');

//define root route
//on a GET return all Users
router.route('/')
    .get(syncify(controller.getAll)); 

//on POST add a user
router.route('/')
    .post(syncify(controller.add));

//id specific routes

//on GET get a user with the given id
router.route('/:id')
    .get(syncify(controller.get));

//on PUT update a user with the given id
router.route('/:id')
    .put(syncify(controller.update));

//on DELETE delete a user with the given id
router.route('/:id')
    .delete(syncify(controller.delete));



module.exports = router; //export the user Router

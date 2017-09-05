'use strict;'//use strict compiler mode. see main.js

let express = require('express'); //import express
let router = express.Router(); //create a new router for the Users

let controller = require('../controllers/user_controller');//import user controller

//define root route
//on a GET return all Users
router.route('/')
    .get(controller.getAll); 

//on POST add a user
router.route('/')
    .post(controller.add);

//id specific routes

//on GET get a user with the given id
router.route('/:id')
    .get(controller.get);

//on POST update a user with the given id
router.route('/:id')
    .post(controller.update);

//on DELETE delete a user with the given id
router.route('/:id')
    .delete(controller.delete);



module.exports = router; //export the user Router

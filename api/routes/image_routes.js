'use strict;'//use strict compiler mode. see main.js

let express = require('express'); //import express
let router = express.Router(); //create a new router for Images

let controller = require('../controllers/image_controller');//import image controller


//root routes

//add an image
router.route('/')
    .post(controller.add);

//ID Specific routes

//get an image with the given id
router.route('/:id')
    .get(controller.get);

//update an image with the given id
router.route('/:id')
    .post(controller.update);

//delete an image with the given id
router.route('/:id')
    .delete(controller.delete);


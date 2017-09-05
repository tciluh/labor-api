'use strict;'//use strict compiler mode. see main.js

let express = require('express'); //import express
let router = express.Router(); //create a new router for the Users

let controller = require('../controllers/user_controller');//import user controller

//define root route
router.route('/')
    .get(controller.getAll); //on a get return all Userss

router.route('/')
    .post(controller.add);

router.route('/:id')
    .get(controller.get);

router.route('/:id')
    .post(controller.update);

router.route('/:id')
    .delete(controller.delete);



module.exports = router; //export the user Router

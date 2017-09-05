'use strict;'//use strict compiler mode. see main.js

let express = require('express'); //import express
let router = express.Router(); //create a new router for Images

let controller = require('../controllers/image_controller');//import image controller

//import multer
//used for uploading images vai multipart/form-data http request
let multer = require('multer');

//create a multer instance and set the upload directory to images
let upload = multer({ dest: 'images/'});

//root routes

//add an image
router.route('/')
    .post(upload.single('image'), controller.add);

//ID Specific routes

//get an image with the given id
router.route('/:id')
    .get(controller.get);

//update an image with the given id
router.route('/:id')
    .put(upload.single('image'), controller.update);

//delete an image with the given id
router.route('/:id')
    .delete(controller.delete);

module.exports = router;

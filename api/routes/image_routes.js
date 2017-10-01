'use strict;'//use strict compiler mode. see main.js

let express = require('express'); //import express
let router = express.Router(); //create a new router for Images

let controller = reqlib('/api/controllers/image_controller');//import image controller
let syncify = reqlib('/api/middleware/async_util');

//import multer
//used for uploading images vai multipart/form-data http request
let multer = require('multer');

//create a multer instance and set the upload directory to images
let upload = multer({ dest: 'images/'});

//root routes

//add an image
router.route('/')
    .post(upload.single('image'), syncify(controller.add));

//ID Specific routes

//get an image with the given id
router.route('/:id')
    .get(syncify(controller.get));

//update an image with the given id
router.route('/:id')
    .put(upload.single('image'), syncify(controller.update));

//delete an image with the given id
router.route('/:id')
    .delete(syncify(controller.delete));

module.exports = router;

'use strict;' //strict compiler mode. see main.js

//import ORM Object
const Model = require('../model/sop_model')
const Image = Model.Image;

//routing function for adding an image
function addImage(req, res) {
}

//routing function for updating an image
function updateImage(req, res, next){

}

//routing function for deleting an image
function deleteImage(req, res, next){

}

//routing function for getting an image
function getImage(req, res, next){

}


//Note that get all is missing here since its not
//desired that a user can query every image
module.exports = {
    get: getImage,
    update: updateImage,
    delete: deleteImage,
    add: addImage
}

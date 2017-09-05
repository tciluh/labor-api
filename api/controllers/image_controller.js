'use strict;' //strict compiler mode. see main.js

//import ORM Object
const Model = require('../model/sop_model')
const Image = Model.Image;
//import del library for easy file deletion
const del = require('del');
//import app root path to get the correct path for the images
const appRoot = require('app-root-path');

//routing function for adding an image
function addImage(req, res, next) {
    console.log("filename: " + req.file.filename);
    console.log("type: " + req.file.mimetype);
    Image.create({
        filename: req.file.filename,
        contentType: req.file.mimetype //needs to be saved to allow proper downloading
    })
        .then((createdImage) => res.json(createdImage))//return the image object
        .catch((error) => next(error));//pass the error to the error handler
}

//routing function for updating an image
function updateImage(req, res, next){
    let imagename;
    Image.findById(req.params.id)
        .then(image => {
            //see deleteImage
            imagename = image.filename
            return image;
        })
        .then(image => {
            //update the image metadata
            return image.update({
                filename: req.file.filename,
                contentType: req.file.mimetype
            })
        })
        .then(() => {
            //delete the old image.
            //XXX: fix the hardcoded images path
            try{
                del.sync(['images/' + imagename]);
            }
            catch(error){ next(error); }
            //return the updated image
            Image.findById(req.params.id)
                .then(image => res.json(image));
        })
        .catch(error => next(error));
}

//routing function for deleting an image
function deleteImage(req, res, next){
    let imagename;
    Image.findById(req.params.id)
        .then(image => {
            //this is ugly
            //but we need the filename after it
            //has been deleted in the database
            imagename = image.filename;
            return image;
        })
        .then(image => image.destroy())
        .then(() => {
            //delete the actual file
            //XXX: fix the hardcoded images path
            try{
                del.sync(['images/' + imagename]);
            }
            catch(error){ next(error); }

            res.send("Image succesfully deleted");
        })
        .catch((error) => next(error));
}

//routing function for getting an image
function getImage(req, res, next){
    //get corresponding db entry
    Image.findById(req.params.id)
        .then(image => {
            if(image) {
                //set content type since the pictures have no extension
                res.type(image.contentType);
                //send the file
                res.sendFile('images/' + image.filename, { root: appRoot.toString() });
            }
            else{
                //throw error
                next("no image with the given id found");
            }
        })
}


//Note that get all is missing here since its not
//desired that a user can query every image
module.exports = {
    get: getImage,
    update: updateImage,
    delete: deleteImage,
    add: addImage
}

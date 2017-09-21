'use strict;' //strict compiler mode. see main.js

//import ORM Object
const Model = require('../model/sop_model')
const Image = Model.Image;
//import del library for easy file deletion
const del = require('del');
//import app root path to get the correct path for the images
const appRoot = require('app-root-path');

//routing function for adding an image
async function addImage(req, res, next) {
    if(!req.file) return next("image upload failed, file is not defined after upload");
    else{
        const image = await Image.create({
            filename: req.file.filename,
            contentType: req.file.mimetype //needs to be saved to allow proper downloading
        });
        res.jsonSuccess(image);
    }
}

//routing function for updating an image
async function updateImage(req, res, next){
    if(!req.file) return next("image update failed, file is not defined after upload");
    //find the image in question
    let image = await Image.findById(req.params.id);
    if(!image){
        //throw error
        return next("no image with the given id found");
    }
    //save old filename
    const oldFilename = image.filename;
    //perform the update
    await image.update({
        filename: req.file.filename,
        contentType: req.file.mimetype //needs to be saved to allow proper downloading
    });
    //delete the old file
    await del([`images/${oldFilename}`]);
    //return the updated image db entry
    res.jsonSuccess(image);
}

//routing function for deleting an image
async function deleteImage(req, res, next){
    //find the image in question
    let image = await Image.findById(req.params.id);
    if(!image){
        //throw error
        return next("no image with the given id found");
    }
    //save the filename
    const filename = image.filename;
    //delete from db
    await image.destroy();
    //delete image file from disk
    await del([`images/${filename}`]);
    //return a successful response
    res.jsonSuccess(`Image with id: ${req.params.id} succesfully deleted`);
}

//routing function for getting an image
async function getImage(req, res, next){
    //get corresponding db entry
    let image = await Image.findById(req.params.id);
    if(!image){
        //throw error
        return next("no image with the given id found");
    }
    //set the content type since all the files in the image
    //directory have no extension and sendFile sets the content-type
    //based on the extension
    res.type(image.contentType);
    //send the file
    res.sendFile(`images/${image.filename}`, { root: appRoot.toString()});
}


//Note that get all is missing here since its not
//desired that a user can query every image
module.exports = {
    get: getImage,
    update: updateImage,
    delete: deleteImage,
    add: addImage
}

'use strict;' // strict compiler mode. see main.js

// import ORM Object
const Model = reqlib('/api/model/model').Models
const Image = Model.Image
// import del library for easy file deletion
const del = require('del')
// import app root path to get the correct path for the images
const appRoot = require('app-root-path')

const allowedFields = ['id', 'contentType']
const findOptions = { attributes: allowedFields }
// routing function for adding an image
async function addImage (req, res, next) {
    if (!req.file) return next('image upload failed, file is not defined after upload')
    else {
        log.debug(`got file: ${req.file}`)
        const image = await Image.create({
            filename: req.file.filename,
            contentType: req.file.mimetype // needs to be saved to allow proper downloading
        })
        res.jsonSuccess(await Image.findById(image.id, findOptions))
    }
}

// routing function for updating an image
async function updateImage (req, res, next) {
    if (!req.file) return next('image update failed, file is not defined after upload')
    // find the image in question
    let image = await Image.findById(req.params.id)
    log.debug(`got image: ${image}`)
    if (!image) {
        // throw error
        return next('no image with the given id found')
    }
    // save old filename
    const oldFilename = image.filename
    log.debug(`old filename: ${oldFilename}`)
    // perform the update
    await image.update({
        filename: req.file.filename,
        contentType: req.file.mimetype // needs to be saved to allow proper downloading
    })
    log.debug(`updated image: ${image}`)
    // delete the old file
    await del([`images/${oldFilename}`])
    // return the updated image db entry
    res.jsonSuccess(await Image.findById(image.id, findOptions))
}

// routing function for deleting an image
async function deleteImage (req, res, next) {
    // find the image in question
    let image = await Image.findById(req.params.id)
    log.debug(`delete image: ${image}`)
    if (!image) {
        // throw error
        return next('no image with the given id found')
    }
    // save the filename
    const filename = image.filename
    // delete from db
    log.debug(`deleting from db..`)
    await image.destroy()
    // delete image file from disk
    log.debug(`deleting from disk..`)
    await del([`images/${filename}`])
    // return a successful response
    res.jsonSuccess(`Image with id: ${req.params.id} succesfully deleted`)
}

// routing function for getting an image
async function getImage (req, res, next) {
    // get corresponding db entry
    let image = await Image.findById(req.params.id)
    log.debug(`queried image from db: ${image}`)
    if (!image) {
        // throw error
        return next('no image with the given id found')
    }
    // set the content type since all the files in the image
    // directory have no extension and sendFile sets the content-type
    // based on the extension
    res.type(image.contentType)
    // send the file
    res.sendFile(`images/${image.filename}`, { root: appRoot.toString() })
}

// Note that get all is missing here since its not
// desired that a user can query every image
module.exports = {
    get: getImage,
    update: updateImage,
    delete: deleteImage,
    add: addImage
}

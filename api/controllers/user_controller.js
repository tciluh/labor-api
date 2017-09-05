'use strict;' //strict compiler mode. see main.js

//import ORM Object
const Model = require('../model/sop_model')

const User = Model.User;

//a route function which returns all Users which are currently in the database
function getAllUsers(req, res, next) {
    User.findAll()
        .then((users) => res.json(users))
}

//a route function to add a User
function addUser(req, res, next) {
    User.create(req.body)
        .then((user) => res.json(user)) //return the user in json format
        .catch((error) => {
            //set the error
            req.error = error;
            //make sure the error handling middleware gets called
            next();
        });
}

//a route function to delete a user
function deleteUser(req, res, next){
    User.destroy({ where: { id: req.params.id } })
        .then((deletedRows) => {
            if(deletedRows > 0){
                res.send("User with ID: " + req.params.id + " sucessfully deleted");
            }
            else{
                //set the error
                req.error = "error deleting user";
                //call error handling middleware
                next();
            }
        });
}

//a route to update the info of a user
function updateUser(req, res, next){
    User.update(req.body, { where: { id: req.params.id }})
        .then((affectedCount, affectedRows) => {
            if(affectedCount > 0) {
                User.findById(req.params.id)
                    .then((user) => res.json(user));
            }
            else{
                req.error = "updated user but no affected rows";
                next();
            }
        })
        .catch((error) => {
            //set the error
            req.error = error;
            //make sure the error handling middleware gets called
            next();
        });
}

//a route function to get a certain user
function getUser(req, res, next) {
    User.findById(req.params.id)
        .then((user) => {
            if(user){
                //return the user in json
                res.json(user);
            }
            else{
                //set the error
                req.error = "can't find user";
                //call error handling middleware
                next();
            }
        });
}

module.exports = {
    getAll: getAllUsers,
    add: addUser,
    get: getUser,
    delete: deleteUser,
    update: updateUser,
}

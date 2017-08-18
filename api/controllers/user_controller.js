'use strict;' //strict compiler mode. see main.js

//import ORM Object
const Model = require('../model/sop_model')

const User = Model.User;

//a route function which returns all Users which are currently in the database
function getAllUsers(req, res) {
    User.findAll()
        .then((users) => res.json(users))
        .catch((error) => res.send(error));
}

//a route function to add a User
function addUser(req,res) {
    User.create(req.body)
        .then((user) => {
            user.save()
                .then(() => res.json(user))
                .catch((error) => res.send(error))
        }
    );
    
}

//a route funciton to delete a user
function deleteUser(req, res){

}

//a route function to a certain user
function getUser(req,res) {

}

module.exports = {
    getAll: getAllUsers,
    add: addUser
}

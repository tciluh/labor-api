'use strict;' //strict compiler mode. see main.js

//import ORM Object
const Model = require('../model/sop_model')

const User = Model.User;

//a route function which returns all Users which are currently in the database
async function getAllUsers(req, res, next) {
    const users = await User.findAll();
    res.json(users);
}

//a route function to add a User
async function addUser(req, res, next) {
    const user = await User.create(req.body);
    res.json(user);
}

//a route function to delete a user
async function deleteUser(req, res, next){
    const user = await User.findById(req.params.id);
    //check if there is a user with the given id
    if(!user){
        //throw error 
        next("no user found with the given id");
    }
    await user.destroy();
    res.send("User with ID: " + req.params.id + " sucessfully deleted");
}

//a route to update the info of a user
async function updateUser(req, res, next){
    const user = await User.findById(req.params.id);
    //check if there is a user with the given id
    console.log('got user ');
    //console.log(user);
    if(!user){
        //throw error 
        console.error('no user found');
        next("no user found with the given id");
    }
    //perform the update
    await user.update(req.body);
    //return the updated user
    res.json(user);
}

//a route function to get a certain user
async function getUser(req, res, next) {
    const user = await User.findById(req.params.id);
    if(user){
        res.json(user);
    }
    else{
        next("no user found with the given id");
    }
}

module.exports = {
    getAll: getAllUsers,
    add: addUser,
    get: getUser,
    delete: deleteUser,
    update: updateUser,
}

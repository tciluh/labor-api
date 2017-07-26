'use strict;' //use strict mode. see main.js

//mongoose import
let Mongoose = require('mongoose');

//define a schema for an SOP Object inside MongoDB
let SOPSchema = new Mongoose.Schema({

});

//compile the model into a usable class
let SOPObject = Mongoose.model('SOP', SOPSchema);

module.exports = SOPObject;

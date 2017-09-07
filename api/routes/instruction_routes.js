'use strict;'//use strict compiler mode. see main.js

let express = require('express'); //import express
let router = express.Router(); //create a new router for the SOPs

let controller = require('../controllers/instruction_controller');//import sop controller

'use strict;' //enable strict compiler mode
//this disables some legacy features such as assignment without declaration
//for more information see https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Strict_mode

//express init
let express = require('express'); //import express framework
let bodyParser = require('body-parser'); //import body parser middleware
let errorHandling = require('./api/middleware/error_handling');
let app = express();  //get the global express instance
let port = process.env.PORT || 3000; //use supplied port or default 3000;

//import sop routes
let sop_router = require('./api/routes/sop_routes');
let user_router = require('./api/routes/user_routes');

//use the bodyParser Middleware for JSON parsing of the request body.
app.use(bodyParser.json());

//use the SOP router for the /sop/ prefix
app.use('/sop/', sop_router);
app.use('/user/', user_router);

//use the ErrorHandling middleware afterwards to return any errors
//to the user
app.use(errorHandling.sendBack);
//and to log it to the console
app.use(errorHandling.logToConsole);

app.listen(port, () => console.log("express started")); //actually start the server and print a simple 
                                                        //message to notify the user something is happening



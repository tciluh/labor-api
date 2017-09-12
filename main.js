'use strict;' //enable strict compiler mode
//this disables some legacy features such as assignment without declaration
//for more information see https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Strict_mode

//express init
let express = require('express'); //import express framework
let bodyParser = require('body-parser'); //import body parser middleware
let errorHandling = require('./api/middleware/error_handling');
let app = express();  //get the global express instance
let port = process.env.PORT || 3000; //use supplied port or default 3000;

//import all routes
let protocolRouter = require('./api/routes/protocol_routes');
let instructionRouter = require('./api/routes/instruction_routes');
let resultRouter = require('./api/routes/result_routes');
let userRouter = require('./api/routes/user_routes');
let imageRouter = require('./api/routes/image_routes');

//use the bodyParser Middleware for JSON parsing of the request body.
app.use(bodyParser.json());

//use the SOP router for the /sop/ prefix
app.use('/protocol/', protocolRouter);
app.use('/instruction/', instructionRouter);
app.use('/result/', resultRouter);
app.use('/user/', userRouter);
app.use('/image/', imageRouter);

//use the ErrorHandling middleware afterwards to return any errors
//to the user
app.use(errorHandling.sendBack);
//and to log it to the console
app.use(errorHandling.logToConsole);

app.listen(port, () => console.log("express started")); //actually start the server and print a simple 
                                                        //message to notify the user something is happening

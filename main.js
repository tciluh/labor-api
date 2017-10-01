'use strict;' //enable strict compiler mode
//this disables some legacy features such as assignment without declaration
//for more information see https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Strict_mode

//we use the approot module so that we can use relative paths with require
//add reqlib to the global scope so that it can be used anywhere
global.reqlib = require('app-root-path').require;

//require the logging framework
const jslogging = require('js-logging');
//and add an instance to the global scope
global.log = jslogging.colorConsole();

//require the json pretty printer for a nicer console output
const prettyjson = require('json-stringify-pretty-compact');
global.stringify = prettyjson;

//express init
const express = require('express'); //import express framework
const bodyParser = require('body-parser'); //import body parser middleware
const errorHandling = reqlib('/api/middleware/error_handling');
const jsonResponse = reqlib('/api/middleware/json_response');
const app = express();  //get the global express instance
const http = require('http');
//register the express instance with our http sever
const server = http.Server(app);
//import socket.io and register it with our http server
const socketio = require('socket.io');
const io = socketio(server);


//use the bodyParser Middleware for JSON parsing of the request body.
app.use(bodyParser.json());
//use the json extension functions since they are used by the routers
app.use(jsonResponse);

//import all routes
const protocolRouter = reqlib('/api/routes/protocol_routes');
const instructionRouter = reqlib('/api/routes/instruction_routes');
const resultRouter = reqlib('/api/routes/result_routes');
const ioResultRouter = reqlib('/api/routes/ioresult_routes');
const userRouter = reqlib('/api/routes/user_routes');
const imageRouter = reqlib('/api/routes/image_routes');
app.use('/protocol/', protocolRouter);
app.use('/instruction/', instructionRouter);
app.use('/result/', resultRouter);
app.use('/ioresult/', ioResultRouter);
app.use('/user/', userRouter);
app.use('/image/', imageRouter);


//use the ErrorHandling middleware afterwards to return any errors
//to the user
app.use(errorHandling.sendBack);
//and to log it to the console
app.use(errorHandling.logToConsole);

//setup socketio
const IOPluginManager = reqlib('/api/io/plugin_handler');
const pluginManager = new IOPluginManager(io);

//use supplied port or default 3000;
const port = process.env.PORT || 3000; 
//actually start the server and print a simple
//message to notify the user something is happening
server.listen(port, () => console.log("http server started")); 

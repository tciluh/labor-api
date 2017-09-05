"use strict;"
//see main.js

//an error handling middle ware function which sets the correct
//http status code and returns the error message if set.
//note the slightly different signature with the error message
//as the first argument
function sendRequestError(err, req, res, next){
    //set the status code to 500
    //and return a json error object
    res.status(500).json({
        url: req.url,
        body: req.body,
        method: req.method,
        params: req.params,
        error: err
    });
    //pass the error to the next error handling function
    next(err);
}

function logRequestError(err, req, res, next){
    console.warn('an error ocurred while performing a request');
    console.error(JSON.stringify({
        url: req.url,
        body: req.body,
        method: req.method,
        params: req.params,
        error: err
    }));
    //pass the error to the next error handling function
    next(err);
}

module.exports = {
    sendBack: sendRequestError,
    logToConsole: logRequestError
}


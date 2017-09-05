"use strict;"
//see main.js

//an error handling middle ware function which sets the correct
//http status code and returns the error message if set.
function sendRequestError(req, res, next){
    //if the correct field is set by any of the previous routing functions
    if(req.error){
        res.status(500);
        res.json({
            url: req.url,
            body: req.body,
            method: req.method,
            params: req.params,
            error: req.error 
        });
    }
    next();
}

function logRequestError(req, res, next){
    if(req.error){
        console.warn('an error ocurred while performing a request');
        console.error(JSON.stringify({
            url: req.url,
            body: req.body,
            method: req.method,
            params: req.params,
            error: req.error 
        }));
    }
    next();

}

module.exports = {
    sendBack: sendRequestError,
    logToConsole: logRequestError
}


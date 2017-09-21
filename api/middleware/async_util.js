"use strict;"
//see main.js

//takes an asynchronous function
//and makes it synchronous while
//passing any error onto express
function syncify(fn){
    return (req, res, next) => {
        try{
            return Promise
                .resolve(fn(req, res, next)) // this will resolve if none of
                                             // the encapsulated await statements reject.
                .catch(error => next(error));//otherwise this will be called and we call the express error handler
        }
        catch(error){
            //another catch block to catch any error thrown via
            //throw error
            //these are not catch'ed by the promise statement
            next(error);
        }
    }
}

module.exports = syncify;

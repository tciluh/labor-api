'use strict;' //enable strict compiler mode
//this disables some legacy features such as assignment without declaration
//for more information see https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Strict_mode

//express init
let express = require('express'); //import express framework
let app = express();  //get the global express instance
let port = process.env.PORT || 3000; //use supplied port or default 3000;

app.listen(port, () => console.log("express started")); //actually start the server and print a simple 
                                                        //message to notify the user something is happening



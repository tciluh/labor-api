'use strict;' //use strict mode. see main.js

//sequelize import
const Sequelize = require('sequelize');
//init db connection
const db = new Sequelize('labor-api', 'labor', null, {
    host: 'localhost',
    dialect: 'postgres',
});

//use require all to load all files in the plugins subdirectory
//by using a resolve function we automagically call the exported
//plugin function which add its classes to the exportsOrms Map
let exportedORMs = {};
let plugins = require('require-all')({
    dirname: this.pluginDir ? this.pluginDir :__dirname + '/plugins/',
    filter: /^(.+)\.js$/,
    resolve: (plugin_model) => plugin_model(Sequelize,db,exportedORMs),
    recursive: false
});
//export all gathered model classes
module.exports = exportedORMs;

//sync the database (meaning creating the tables if not existent)
db.sync({
    force: true
})
    .then(() => console.log('db succesfully synced'))
    .catch((error) => console.error("db sync failed with error: " + error));


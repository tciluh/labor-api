'use strict;' //use strict mode. see main.js

//sequelize import
const Sequelize = require('sequelize');
//init db connection
const db = new Sequelize('labor-api', 'labor', null, {
    host: 'localhost',
    dialect: 'postgres',
});

//use require all to load all files in the plugins subdirectory
let plugins = require('require-all')({
    dirname: this.pluginDir ? this.pluginDir :__dirname + '/plugins/',
    filter: /^(.+)\.js$/, //make sure dont require the js.example file
    recursive: false
});

let models = {};
//create all plugin instances and generate the export map
for(let [filename, plugin] of Object.entries(plugins)){
    log.debug(`creating model from file: ${filename} module: ${stringify(plugin)} `);
    models[plugin.provides] = plugin.create(Sequelize, db);
}
//create all model relations
for(let [filename, plugin] of Object.entries(plugins)){
    log.debug(`adding relations for file: ${filename} , providing module: ${stringify(plugin)} `);
    plugin.relations(models);
}
//set module.exports
module.exports = models;

//sync the database (meaning creating the tables if not existent)
db.sync({
    force: true
})
    .then(() => log.info('db succesfully synced'))
    .catch((error) => log.error("db sync failed with error: " + stringify(error)));


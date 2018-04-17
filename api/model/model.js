'use strict;' // use strict mode. see main.js

// sequelize import
const Sequelize = require('sequelize')
// init db connection
const db = new Sequelize(
    config.dbname,
    config.dbuser,
    config.dbpw,
    {
        host: config.dbhost,
        dialect: 'postgres'
    })

// use require all to load all files in the plugins subdirectory
const path = require('path')
const pluginDir = path.join(__dirname, '/plugins/')
let plugins = require('require-all')({
    dirname: pluginDir,
    filter: /^(.+)\.js$/, // make sure dont require the js.example file
    recursive: false
})

let models = {}
// create all plugin instances and generate the export map
for (let [filename, plugin] of Object.entries(plugins)) {
    log.debug(`creating model from file: ${filename} module: ${stringify(plugin)} `)
    models[plugin.provides] = plugin.create(Sequelize, db)
}
// create all model relations
for (let [filename, plugin] of Object.entries(plugins)) {
    log.debug(`adding relations for file: ${filename} , providing module: ${stringify(plugin)} `)
    plugin.relations(models)
}
// set module.exports
module.exports = {
    Models: models,
    DBInstance: db,
    Sequelize: Sequelize
}

// sync the database (meaning creating the tables if not existent)
db.sync({
    force: config.development || config.forceDatabaseSync
})
    .then(() => log.info('db succesfully synced'))
    .catch((error) => log.error('db sync failed with error: ' + stringify(error)))

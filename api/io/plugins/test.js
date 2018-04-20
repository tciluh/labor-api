const PluginBase = require('../base')

class TestPlugin extends PluginBase {
    constructor () {
        // define an identifier
        // this is used by the client to address the correct plugin
        const identifier = 'test-plugin'
        // define an array of available action which this plugin implements
        const actions = ['double', 'null', 'error']
        // call super with the required parameters
        super(identifier, actions)
    }
    // define a handler function which will be called if the server recieves a
    // request from a client
    async handler (action, args) {
        if (action === 'double') {
            return 123.0
        } else if (action === 'null') {
            return null
        } else {
            throw new Error('expected error!')
        }
    }
}

module.exports = TestPlugin

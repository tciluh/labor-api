const PluginBase = require('../base')

class ExamplePlugin extends PluginBase {
    constructor () {
        // define an identifier
        // this is used by the client to address the correct plugin
        const identifier = 'photometer'
        // define an array of available action which this plugin implements
        const actions = ['measure', 'set_turret', 'blank']
        // call super with the required parameters
        super(identifier, actions)
    }
    // define a handler function which will be called if the server recieves a
    // request from a client
    async handler (action, args, uniqueid) {
        // for now just log the arguments & action.
        console.log(`example plugin called:\naction: ${action}\nargs: ${JSON.stringify(args, null, '  ')}`)
        return 12345
    }
}

module.exports = ExamplePlugin

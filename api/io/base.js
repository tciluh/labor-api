
// an abstract base class for all IO Plugins
// each plugin is identifiable via its identifier
// each plugin provides a number of actions which the user can execute
// each plugin must provide a handler function which recieves the action and all other recieved arguments as an object.
class PluginBase {
    constructor (identifier, actions) {
        // make sure this is an abstract class
        // new.target holds the derived class if the user instantiated the
        // derived class directly
        if (new.target === PluginBase) {
            throw new Error('cant instatiate PluginBase directly')
        }
        // make sure there is an identfier, a handler function and at least
        // one action
        if (this.handler === undefined) {
            throw new Error('plugin must defined a handler function')
        }
        if (identifier === undefined) {
            throw new Error('plugin must define an identifier')
        } else {
            this.identifier = identifier
        }
        if (actions === undefined ||
            (this.actions instanceof Array && this.actions.length < 1)) {
            throw new Error('plugin must define at least one action')
        } else {
            this.actions = actions
        }
    }
}

module.exports = PluginBase

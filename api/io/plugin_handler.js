'use strict;'

// import IOResult from model
const Model = reqlib('/api/model/model').Models
const path = require('path')
const IOResult = Model.IOResult
const IOAction = Model.IOAction

class IOActionError {
    constructor (msg, actionId, resultId = null) {
        this.msg = msg
        this.actionId = actionId
        this.resultId = resultId
    }
}

class IOPluginManager {
    constructor (io, pluginDir) {
        this.io = io
        this.pluginDir = pluginDir
        this.actionMap = {}

        // load all plugins and setup the io socket
        this.setup()
    }

    setup () {
        // load plugins
        this.loadPlugins()
        // setup global events
        // globally we only care about the connection event.
        // everything else is locally assigned for each socket
        this.io.on('connection', this.handleConnection.bind(this))
    }

    loadPlugins () {
        // use require all to load all files in the plugins subdirectory
        // by using a resolve function we automagically get instiated versions of
        // the plugin classes
        let plugins = require('require-all')({
            dirname: this.pluginDir ? this.pluginDir : path.join(__dirname, '/plugins/'),
            filter: /^(.+)\.js$/,
            resolve: (Plugin) => new Plugin(),
            recursive: false
        })
        // assign each plugin to its identifier in the actionMap for an easy lookup
        for (let [file, plugin] of Object.entries(plugins)) {
            log.debug(`got io plugin from file: ${file} => identifier: ${plugin.identifier} actions: ${plugin.actions}`)
            this.actionMap[plugin.identifier] = plugin
        }
    }

    handleConnection (socket) {
        log.info(`new client connection with id: ${socket.id}`)
        // a client connected
        // assign an error handler
        socket.on('error', this.handleError)
        // assign a disconnect handler
        socket.on('disconnect', this.handleDisconnect)
        // assign an action handler
        // we need lodash's partial here since socketio binds the this variable to the socket
        // on which the event occured when calling the handler function. we cant let this happen
        // because we need access to this class which normally bound to the this variable
        // therefore we save a reference to the correct this pointer
        // and use it inside the callback to call the class function
        const self = this
        socket.on('action', (actionId, ackFn) => {
            // socket is now bound to this
            self.handleAction(self, actionId, ackFn)
                .then(({ result, id }) => {
                    log.info(`action with id: ${actionId} succesfully handled`)
                    self.handleResult(socket, result, id)
                })
                .catch(error => {
                    self.handleError(socket, error)
                })
        })
    }

    handleDisconnect (reason) {
        log.info(`client disconnected for reason: ${reason}`)
    }

    handleResult (socket, result, resultId) {
        log.info(`returning result: ${result} with id: ${resultId}`)
        socket.emit('result', {
            result: result,
            id: resultId
        })
    }

    handleError (socket, error) {
        if (error instanceof IOActionError) {
            log.error(`handling action error: ${error.msg} for id: ${error.actionId}, rid: ${error.resultId}`)
            socket.emit('action error', {
                error: error.msg,
                actionId: error.actionId,
                resultId: error.resultId
            })
        } else {
            log.error(`unknown error while processing ioaction request.`)
            log.error(error)
        }
    }

    async handleAction (self, actionId, ackFn) {
        log.debug(`handle action with id: ${actionId}`)
        // make sure we got a valid actionId
        if (!actionId) {
            log.warning(`actionId: ${actionId} is not valid`)
        }
        // fetch the related IOAction
        const ioaction = await IOAction.findById(actionId)
        if (!ioaction) throw new IOActionError(`cant find action`, actionId)
        // define shorthands
        const identifier = ioaction.plugin
        const action = ioaction.action
        const args = ioaction.arguments
        // get the resposible plugin
        const plugin = self.actionMap[identifier]
        if (!plugin) throw new IOActionError(`no plugin found for identifier: ${identifier}`, actionId)

        // check if the action is supported by this plugin
        if (!plugin.actions.includes(action)) { throw new IOActionError(`plugin with identifier: ${identifier} does not support action: ${action} (allowed actions: ${stringify(plugin.actions)})`, actionId) }
        // perform the plugin action
        // create IOResult entry
        log.debug(`will create IOResult with id: ${plugin.identifier} and action: ${action} and args: ${args}`)
        let result = await IOResult.create({
            identifier: plugin.identifier,
            action: action,
            arguments: args
        })
        log.debug(`created io result with id: ${result.id}`)
        // return id to the client
        // anything below this should only throw IOActionErrors
        ackFn(result.id)

        try {
            log.debug(`calling plugin handler`)
            const val = await plugin.handler(action, args)
            log.debug(`got result: ${val}`)
            try {
                await result.update({
                    value: val
                })
            } catch (error) {
                throw new IOActionError(`error updating database: ${error}`, actionId, result.id)
            }
        } catch (error) {
            log.error('plugin error: ', error)
            log.error(error.stack)
            throw new IOActionError(`plugin returned an error: ${error}`, actionId, result.id)
        }

        log.debug(`updated ioresult (${result.id}) with value: ${result.value}`)
        return {
            id: result.id,
            result: result.value
        }
    }
}

// export the setup function
module.exports = IOPluginManager

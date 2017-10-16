"use strict;"

//import IOResult from model
const model = reqlib('/api/model/model');
const IOResult = model.IOResult;
const IOAction = model.IOAction;

class IOPluginManager{
    constructor(io, pluginDir){
        this.io = io;
        this.pluginDir = pluginDir;
        this.actionMap = {};

        //load all plugins and setup the io socket
        this.setup();
    }

    setup(){
        //load plugins
        this.loadPlugins();
        //setup global events
        //globally we only care about the connection event.
        //everything else is locally assigned for each socket
        this.io.on('connection', this.handleConnection.bind(this));
    }

    loadPlugins(){
        //use require all to load all files in the plugins subdirectory
        //by using a resolve function we automagically get instiated versions of
        //the plugin classes
        let plugins = require('require-all')({
            dirname: this.pluginDir ? this.pluginDir :__dirname + '/plugins/',
            filter: /^(.+)\.js$/,
            resolve: (Plugin) => new Plugin(),
            recursive: false
        });
        //assign each plugin to its identifier in the actionMap for an easy lookup
        for(let [file, plugin] of Object.entries(plugins)){
            log.debug(`got io plugin from file: ${file} => ${stringify(plugin)}`)
            this.actionMap[plugin.identifier] = plugin;
        }
    }

    handleConnection(socket){
        log.info(`new client connection with id: ${socket.id}`)
        //a client connected
        //assign an error handler
        socket.on('error', this.handleError);
        //assign a disconnect handler
        socket.on('disconnect', this.handleDisconnect);
        //assign an action handler
        //we need lodash's partial here since socketio binds the this variable to the socket
        //on which the event occured when calling the handler function. we cant let this happen
        //because we need access to this class which normally bound to the this variable
        //therefore we save a reference to the correct this pointer
        //and use it inside the callback to call the class function
        const self = this;
        socket.on('action', (action_id, ack_fn) => {
            //socket is now bound to this
            let socket = this;
            self.handleAction(self, socket, action_id, ack_fn)
                .then(() => {
                    log.info(`action with id: ${action_id} succesfully handled`);
                })
                .catch(error => {
                    self.handleError(error);
                })
        })
    }

    handleDisconnect(reason){
        log.info(`client disconnected for reason: ${reason}`);
    }

    handleError(error) {
        log.error(`handle error: ${error}`);
        log.error(stringify(error));
    }

    async handleAction(self, socket, action_id, ack_fn) {
        log.debug(`handle action with id: ${action_id}`);
        //make sure we got a valid action_id
        if(!action_id){
            log.warn(`malformed action request on socket: ${socket.id}`);
            log.warn(`action_id: ${action_id} is not valid`);
            socket.emit('action error', "malformed action request");
        }
        //fetch the related IOAction
        const ioaction = await IOAction.findById(action_id);
        if(!ioaction) throw new Error(`cant find action with id: ${action_id}`);
        //define shorthands
        const identifier = ioaction.identifier;
        const action = ioaction.action;
        const args = ioaction.arguments;
        //get the resposible plugin
        const plugin = self.actionMap[identifier];
        if(plugin){
            log.debug(`got plugin: ${stringify(plugin)} for identifier: ${identifier}`);
            //check if the action is supported by this plugin
            if(!plugin.actions.includes(action)){
                log.warn(`plugin with identifier: ${identifier} does not support action: ${action} (allowed actions: ${stringify(plugin.actions)})`);
                return socket.emit('action error', {
                    error: `identifier: ${identifier} does not support action: ${action}`
                })
            }
            //perform the plugin action
            //this creates an IOResult entry and runs the
            //plugin handler function
            try{
                let obj = await self.performPluginAction(plugin, action, args, ack_fn);
                log.debug(`emitting: ${stringify(obj)} on result channel`);
                socket.emit('result', obj);
            }
            catch(error){
                log.error(`plugin threw an error while getting result: ${stringify(error)}`);
                socket.emit('action error', {
                    error: error.message,
                    identifier: identifier,
                    action: action,
                    uniqueid: 0,
                    args: args
                });
            }
        }
        else{
            log.warn(`no plugin found for identifier: ${identifier}`);
            socket.emit('action error', {
                error: 'identifier not found'
            });
        }
    }

    async performPluginAction(plugin, action, args, ack_fn){
        //create IOResult entry
        log.debug(`will create IOResult with id: ${plugin.identifier} and action: ${action} and args: ${args}`);
        let result = await IOResult.create({
            identifier: plugin.identifier,
            action: action,
            arguments: args
        });
        log.debug(`created io result: ${stringify(result)}`);
        //return id to the client
        ack_fn(result.id);
        //call the plugin handler
        log.debug(`calling plugin handler`);
        let val = await plugin.handler(action, args);
        log.debug(`got result: ${val}`);
        //update the ioresult
        await result.update({
            value: val
        });
        log.debug(`updated ioresult: ${stringify(result)}`);
        //return the object to emit on the socket
        return {
            id: result.id,
            result: result.value
        };
    }
}

//export the setup function
module.exports = IOPluginManager;



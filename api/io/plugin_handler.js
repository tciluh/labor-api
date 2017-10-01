"use strict;"

//import IOResult from model
const IOResult = reqlib('/api/model/model').IOResult;

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
        for(let pluginFile in plugins){
            log.debug(`got io plugin from file: ${pluginFile} => ${stringify(plugins[pluginFile])}`)
            this.actionMap[plugins[pluginFile].identifier] = plugins[pluginFile];
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
        //therefore we force a this binding to this class with .bind()
        //and the apply lodash's partial to fill in the socket variable for us
        const partial = require('lodash.partial');
        socket.on('action', partial(this.handleAction.bind(this), socket));
    }

    handleDisconnect(reason){
        log.info(`client disconnected for reason: ${reason}`);
    }

    handleError(error) {
        log.error(`handle error: ${stringify(error)}`);
    }

    handleAction(socket, {identifier, action, ...args }, ack_fn) {
        console.log(`handle identifier: ${identifier} action: ${action} with args: ${stringify(args)}`);
        //make sure we got a valid identifier and action
        if(!identifier || !action){
            log.warn(`malformed action request on socket: ${socket.id}`);
            log.warn(`identifier: ${identifier}, action: ${action}, args: ${stringify(args)}`);
            socket.emit('action error', "malformed action request");
        }
        //get the resposible plugin
        const plugin = this.actionMap[identifier];
        log.debug(`got plugin: ${stringify(plugin)} for identifier: ${identifier}`);
        if(plugin){
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
            this.performPluginAction(plugin, action, args, ack_fn)
                .then(obj => {
                    log.debug(`emitting: ${stringify(obj)} on result channel`);
                    socket.emit('result', obj);
                })
                .catch(error => {
                    log.error(`plugin threw an error while getting result: ${stringify(error)}`);
                    socket.emit('action error', {
                        error: error.message,
                        identifier: identifier,
                        action: action,
                        uniqueid: 0,
                        args: args
                    });
                });
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
            action: action
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



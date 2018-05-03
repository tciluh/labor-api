const PluginBase = require('../base');
const SerialPort = require('serialport');
const util = require('util');

let port;

class Photometer extends PluginBase{
    constructor(){
        const identifier = 'photometer';
        const actions = [
            'measure',
            'setTurret',
            'zero',
            'setWavelength'
        ];
        const serialportPath = '/dev/ttyUSB0'
        const serial = new SerialPort(serialportPath, {
            autoOpen: true,
            baudRate: 19200,
            dataBits: 8,
            stopBits: 1,
            parity: 'none',
        })
        //call super with the required parameters
        super(identifier, actions);
        this.handlerMap = actions.reduce((acc, elem) => {
            acc[elem] = this[elem];
            return acc;
        }, {});
        port = serial;

    }
    handler(action, args){
        return new Promise((resolve, reject) => {
            port.write('\r\n\r\n');
            //beep once to signal ready
            port.write('\r\nBEEP\r\n');
            port.drain()
            this.handlerMap[action](args)
                .then(result => resolve(result))
                .catch(error => reject(error))
        })
    }

    setTurret(args) {
        let pos = args.position;
        if(pos instanceof String  && (pos.toUpperCase() == 'B' || pos.toUpperCase() == 'BLANK')) {
            //BLANK position == Position 0
            pos = 0; 
        }
        if(!(pos instanceof Number)){
            pos = Number.parseInt(pos);
        }
        if(Number.isNaN(pos) || !Number.isFinite(pos) || !Number.isInteger(pos)) {
            throw new Error(`cant set turret to invalid position ${pos} (raw: ${args.position})`);
        }
        if(pos < 0 || pos > 5) {
           throw new Error(`turret position ${pos} is out-of-bounds`);
        } 
        return new Promise((resolve, reject) => {
            port.write(`\r\nTURRET ${pos}\r\n`, 'ascii', (error) => {
                if(error) reject(error)
                resolve()
            });
        })
    }

    setWavelength(args) {
        let wl = args.wavelength;
        if(!(wl instanceof Number)){
            wl = Number.parseInt(wl);
        }
        if(Number.isNaN(wl) || !Number.isFinite(wl) || !Number.isInteger(wl)) {
            throw new Error(`cant set wavelength to invalid value: ${wl} (raw: ${args.wavelength})`);
        }
        if(wl < 190 || wl > 1100) {
            throw new Error(`wavelength ${wl} is out-of-bounds`);
        }
        return new Promise((resolve, reject) => {
            port.write(`\r\nGOTO ${wl}\r\n`, 'ascii', (error) => {
                if(error) reject(error)
                resolve()
            });
        })
    }

    zero(args) {
        return new Promise((resolve, reject) => {
            port.write(`\r\nZERO\r\n`, 'ascii', (error) => {
                if(error) reject(error)
                resolve()
            });
        })
    }

    measure(args) {
        return new Promise((resolve, reject) => {
            port.flush((error) => {
                if(error) reject(error)
                port.on('data', (data) => {
                    if(!data) return;
                    const string = data.toString()
                    log.error(`recieved: ${data}`);
                    if(data.toString('ascii').includes('A') && !data.toString('ascii').includes('SAMPLE')){
                        const string = data.toString('ascii')
                            .replace('A', '')
                            .trim()
                        resolve(string.substr(0, string.indexOf("\n")))
                    }
                })
                port.write('\r\nSAMPLE\r\n', 'ascii', (error) => {
                    if(error) reject(error)
                })	
            })
        })
    }
}

module.exports = Photometer;

const PluginBase = require('../base');
const SerialPort = require('serialport');

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
            autoOpen: false,
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
        this.port = serial;

    }
    async handler(action, args){
        if(!this.port.isOpen) {
            await util.promisify(this.port.open.bind(port))();
            //make sure that the port is ready to accept connections
            await this.port.write('\r\n\r\n');
            //beep once to signal ready
            await this.port.write('\r\nBEEP\r\n');
        }
        return await this.handlerMap[action](args);
    }

    async setTurret(args) {
        const pos = args.position;
        if(pos.toUpperCase() == 'B' || pos.toUpperCase() == 'BLANK') {
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
        await this.port.write(`TURRET ${pos}\r\n`);
    }

    async setWavelength(args) {
        const wl = args.wavelength;
        if(!(wl instanceof Number)){
            wl = Number.parseInt(wl);
        }
        if(Number.isNaN(wl) || !Number.isFinite(wl) || !Number.isInteger(wl)) {
            throw new Error(`cant set wavelength to invalid value: ${wl} (raw: ${args.wavelength})`);
        }
        if(wl < 190 || wl > 1100) {
            throw new Error(`wavelength ${wl} is out-of-bounds`);
        }
        await this.port.write(`GOTO ${wl}\r\n`);
    }

    async zero(args) {
        await this.port.write(`ZERO\r\n`);
    }

    async measure(args) {
        await util.promisify(this.port.flush.bind(port))();
        await this.port.write(`SAMPLE`);
        let buffer = new Buffer.alloc(20);
        let bytesRead = await this.port.read(buffer, 0, 20)
        return buffer.toString('ascii');
    }
}

module.exports = Photometer;

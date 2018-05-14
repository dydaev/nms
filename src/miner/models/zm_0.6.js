import InterfaceMinerModel from './InterfaceMinerModel';

var log = require('../../libs/log')(process.mainModule.filename);// eslint-disable-line

export class ewbf034b extends InterfaceMinerModel {
    constructor(params) {
        super(params);
        this.params = params;
        this.pathToMiner = '~/ewbf-0.3.4b/miner';
        this.minimalParams = [
            'server',
            'port',
            'user',
        ];
        this.api = {
            "id": 1,
            "result": [{
                "gpu_id": 0,         // GPU CUDA id
                "gpu_name": "string",  // GPU name
                "gpu_pci_bus_id": 0,         // PCI bus id
                "gpu_pci_device_id": 0,         // PCI device id
                "gpu_uuid": "string",   // GPU UUID
                "temperature": 0,         // current GPU temperature
                "sol_ps": 0.00,      // current Sol/s
                "avg_sol_ps": 0.00,      // average Sol/s
                "sol_pw": 0.00,      // current Sol/s / Watt
                "avg_sol_pw": 0.00,      // average Sol/s / Watt
                "power_usage": 0.00,      // current power usage
                "avg_power_usage": 0.00,      // average power usage
                "accepted_shares": 0,         // total amount of accepted shares
                "rejected_shares": 0,         // total amount of rejected shares
                "latency": 0          // network latency
            }],

            "uptime": 0,                      // uptime in seconds
            "contime": 0,                      // connection time in seconds (gets reset on reconnect) 
            "server": "string",               // server name
            "port": 0,                   // port
            "user": "string",               // username
            "version": "string",                // zm version
            "error": null
        };
    }

    getParams() {
        return {
            server: '--server ' + this.params.server,
            port: '--port ' + this.params.port,
            user: '--user ' + this.params.wallet + '.' + this.params.worker,
            pass: '--pass ' + (this.params.pass ? this.params.pass : 'x'),
            list: () => (Array.isArray(this.params.devices) && this.params.devices.length)
                ? '--list=' + this.params.devices.join(' ') : '',
            dev: (Array.isArray(this.params.solver) && this.params.solver.length)
                ? '--dev ' + this.params.devices.join(' ') : '',
            logfile: this.params.logFile ? '--logfile ' + this.params.logFile : '',
            noreconnect: this.params.rebootable ? '--noreconnect ' + this.params.rebootable : '',
            temp: this.params.temperatureUnit ? '--temp ' + this.params.temperatureUnit : '',
            telemetry: '--telemetry ' + this.params.api,
        };
    }
}
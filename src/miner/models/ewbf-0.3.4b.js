import InterfaceMinerModel from './InterfaceMinerModel';

var log = require('../../libs/log')(process.mainModule.filename);// eslint-disable-line

export class ewbf034b extends InterfaceMinerModel {
    constructor(params, cardsList) {
        super(params, cardsList);
        this.params = params;
        this.pathToMiner = '/home/dydaev/ewbf-0.3.4b/miner';
        this.minimalParams = [
            'server',
            'port',
            'user',
        ];
        this.api = {
            "gpuid": 0,
            "cudaid": 0,
            "busid": "0000:01:00.0",
            "gpu_status": 2,
            "solver": 0,
            "temperature": 64,
            "gpu_power_usage": 150,
            "speed_sps": 420,
            "accepted_shares": 1000,
            "rejected_shares": 1
        };
    }

    getProcessParser(processLine) {
        const arrayLine = processLine.split(':');
        switch (arrayLine[0]) {
            case 'Temp':
                
                break;
            case 'INFO':
                
                break;
            case 'Total speed':
                return ['Total speed', Number.parseInt(arrayLine[1])]
                break;
            case 'GPU1':
                
                break;
            case 'INFO 01':
                
                break;
        
            default:
                break;
        }
        return this.api;
    }

    getParams() {
        const getDevices = listUuidDevices => {

        }

        return {
            port: ' --port ' + this.params.port,
            server: ' --server ' + this.params.server,
            user: ' --user ' + this.params.wallet + '.' + this.params.worker,
            api: this.params.api ? ' --api ' + this.params.api : '',
            pass: this.params.pass ? ' --pass ' + this.params.pass : '',
            log: this.params.logFile ? ' --log ' + this.params.logFile : '',
            tempunits: this.params.temperatureUnit ? ' --tempunits ' + this.params.temperatureUnit : '',
            templimit: this.params.temperatureLimit ? ' --templimit ' + this.params.temperatureLimit : '',
            fee: this.params.fee ? ' --fee ' + this.params.fee : '',
            eexit: () => this.params.rebootable ? ' --eexit ' + this.params.rebootable : '',
            intensity: () => (Number.parseInt(this.params.intensity) > 0 && (this.params.intensity <= 64 * 1))
                ? ' --intensity ' + this.params.intensity : '',
            cuda_devices: () => (Array.isArray(this.params.devices) && this.params.devices.length)
                ? ' --cuda_devices ' + this.params.devices.join(' ') : '',
            solver: () => (Array.isArray(this.params.solver) && this.params.solver.length)
                ? ' --solver ' + this.params.solver.join(' ') : '',
        };
    }
    /*
    Temp: GPU1: 60C
    GPU1: 533 Sol/s
    Total speed: 533 Sol/s
    INFO 01:21:56: GPU1 Accepted share 50ms [A:11, R:0]
    INFO 01:21:58: GPU1 DevFee Accepted share
    INFO: Detected new work: 1525217418

    */
}   
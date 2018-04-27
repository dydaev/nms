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

    getParams() {
        return {
            port: ' --port ' + this.params.port,
            server: ' --server ' + this.params.server,
            user: ' --user ' + this.params.wallet + '.' + this.params.worker,
            api: ' --api ' + this.params.api,
            pass: ' --pass ' + (this.params.pass ? this.params.pass : 'x'),
            log: this.params.logFile ? ' --log ' + this.params.logFile : '',
            tempunits: this.params.temperatureUnit ? ' --tempunits ' + this.params.temperatureUnit : '',
            templimit: this.params.temperatureLimit ? ' ---templimit ' + this.params.temperatureLimit : '',
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
}
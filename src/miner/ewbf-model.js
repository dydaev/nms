import InterfaceMinerModel from './InterfaceMinerModel';

const minimalParams = {
    server: '',
    port: '',
    user: '',
}

const params = {
    server: '',
    port: '',
    user: '',
    pass: '',
    cuda_devices: '',
    solver: '',
    eexit: '',
    log: '',
    logfile: '',
    intensity: '',
    tempunits: '',
    templimit: '',
    api: '',
    fee: '',
};

const apiModel = {
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
}

export default class EwbfModel extends InterfaceMinerModel{
    
}
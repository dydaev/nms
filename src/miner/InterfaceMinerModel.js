import packModel from '../libs/utils';

export default class InterfaceMinerModel {
    constructor() {
        this.id = '';
        this.name = '';
        this.minerFolder = '';
        this.minParams = [
            'server',
            'port',
            'user',
        ];
        this.params = {
            server: '',
            port: '',
            user: '',
            pass: '',
            cuda_devices: '',
            solver: '',
            intensity: '',
            tempunits: '',
            templimit: '',
            api: '',
            fee: '',
        };

        this.model = {
            gpuid: '',
            cudaid: '',
            busid: '',
            gpu_status: '',
            solver: '',
            temperature: '',
            gpu_power_usage: '',
            speed_sps: '',
            accepted_shares: '',
            rejected_shares: '',
        }
        if (typeof apiModel !== 'undefimed') console.log(apiModel);
    }

    getApi() {
        return apiModel;
    }

    getDevice() {
        //update params
        return this.params;
    }

    getServer() {
        return this.server;
    }

    getPort() {
        return this.port;
    }

    getUser() {
        return this.user;
    }

}
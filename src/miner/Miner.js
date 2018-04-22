import cmd from 'node-cmd';
import { v4 as uuid } from 'uuid';

import driver from './driver';
var log = require('../libs/log')(process.mainModule.filename);// eslint-disable-line
import localStor from '../libs/localStore';

class Miner {
    constructor(config) {
        if (typeof config !== 'undefined') {
            const minimalParams = ['server', 'port', 'user'];
            const minimalParamsIsTrue = minimalParams.every(value =>
                Object.keys(config).includes(value)
            );
            if (minimalParamsIsTrue) {
                this.miner = {
                    enable: true,
                    id: uuid(),
                    pid: '',
                    startedAte: '',
                    devices: [],
                    apiPort: '',
                    state: '',
                    config: {},
                    cmdLine: '',
                }
                this.miner.config = config;
                log.info('Created new miner, id:' + this.miner.id);
            } else {
                
                log.error('For create new miner need params(' +
                minimalParams.join(', ') +
                '), but your params(' + config.join(', ') + ')');
            }
        } else {
            this.udateInfo();
        }
    }
    get = () => this.miner;// eslint-disable-line
    getIsEnable = () => this.enable;// eslint-disable-line
    getId = () => this.id;// eslint-disable-line
    getDevices = () => this.devices;// eslint-disable-line
    getApiHost = () => this.apiHost;// eslint-disable-line
    getState() {

    }

    getCmdLine() {
        const minimalParams = ['server', 'port', 'user'];
        let configLine;
        let usedDevices;

        if (Object.prototype.toString.call(params) === '[object Object]') {
            if (minimalParams.every(value => Object.keys(params).includes(value))) {

                let isExecDevicesFree = true;//if execute devices check they using, or check free devices
                const headwareDevices = localStor.get('nvidia-devices');
                if (this.miner.devices.length) {
                    //headwareDevices 
                    usedDevices = params.cuda_devices;
                    isExecDevicesFree = isExecDevicesFree;// TODO
                } else {
                    isExecDevicesFree = isExecDevicesFree;// TODO

                }

                if (isExecDevicesFree) {
                    configLine = Object.keys(params).reduce((line, key) => {
                        return line + ' --' + key + ' ' + params[key];
                    }, config.miner.homeFolder + config.miner.run);

                } else log.info('Not free devices for adding miner!');
            } else log.info('You need set (' + minimalParams.join(', ') + ') for adding mainer!');
        } else log.info('Did`nt add miner, need config!');
        return configLine;
    }

    getMinerById = id =>
        id
        ? (
            localStor.get('miners')
            ? localStor.get('miners').find(miner => miner.id === this.miner.id)
            : log.info('Not found list miners, for geting miner!)')
        )
        : log.info('For get miner by id need id!)');

    udateInfo() {
        if(this.miner.id) {
            const miner = localStor.get('miners').find(miner => miner.id === this.miner.id);
            if (miner) {
                this.miner = Object.assign({}, this.miner, miner);
            } else log.info('Miner with id ' + this.miner.id + ' is not found in list miners');
        } else log.info('Update miner information impossible, isn`t initialized!');
    }
    updateState = () => this.miner.state = driver.getState(apiPort);
    

    set = miner => this.miner = miner;
}
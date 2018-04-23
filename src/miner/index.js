import cmd from 'node-cmd';
import {v4 as uuid} from 'uuid';
import request from 'request';

import * as commands from './commands'

import config from '../libs/config';
import localStor from '../libs/localStore';
var log = require('../libs/log')(process.mainModule.filename);// eslint-disable-line

const runMiner = 'sh /home/dydaev/ewbf-0.3.4b/miner';
const ApiUrl = 'http://192.168.1.222:42000/getstat'


        /* 
        config.miner 

        (server
        port
        apiHost
        startApiPort
        wallet)

        if (Array.isArray(devices)) {
        //     dev = '--cuda_devices ' + devices.join(' ');
        // }
        //'lsof | grep 42000' check api port busy at the moment
        --server
        --port
        --fee 0
        --api 192.168.1.222:42000 --server eu1-zcash.flypool.org --port 3333 --intensity 64 --eexit --solver 0 --fee 0 --user t1TfENUARE95mktDMt7viQvaCtLER3tepGy.dydaev
        */
export default {
    minerUp: miner => {
        let miners = localStor.get('miners');
        miner.pid = cmd.get(miner.commandLine).pid
        
        miners = miners.map(storMiner => storMiner.id === miner.id ? miner : storMiner);
    
        localStor.set('miners', miners);
    },
    
    killPid: pid => pid ? cmd.run('kill ' + pid) : false,
    
    isWorkingPid: pid => {
        if (pid) {
            cmd.get(
                'ps aux | grep ' + pid + ' | grep miner',
                (err, data, stderr) => data ? true : false
            );
        }// else log.info('Fail check pid, no pid');
    },

    getMinerInfo: () => {
        let result = {};
        request(ApiUrl, function (error, response, body) {
            if (error) {
                log.error('Error with connecting to miner api:' + error);
            } else if (response.statusCode !== 200) {
                log.info('Status code from miner :' + response.statusCode);
            } else {
                result = JSON.parse(body);
                localStor.set('miner', JSON.parse(body));
            }

        });
            
        return result;
    },
    addMiner: params => {// eslint-disable-line
        const minimalParams = ['server','port','user'];
        let configLine;
        let usedDevices;

        if (Object.prototype.toString.call(params) === '[object Object]') {
            if (minimalParams.every(value => Object.keys(params).includes(value))) {

                let isExecDevicesFree = true;//if execute devices check they using, or check free devices
                const headwareDevices = localStor.get('nvidia-devices');
                if (typeof params.cuda_devices !== 'undefined') {
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

        if (configLine) {
            const miner = {
                id: uuid(),
                pid: '',
                apiHost: '',
                enabled: true,
                commandLine: configLine,
                devices: usedDevices,
            };
    
            localStor.set('miners', (localStor.get('miners') ? [...localStor.get('miners'), miner] : []));
        } else log.info('What went wrong with adding miner!');
    },
}
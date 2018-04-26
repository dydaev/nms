import cmd from 'node-cmd';
import { v4 as uuid } from 'uuid';

import driver from './driver';
var log = require('../libs/log')(process.mainModule.filename);// eslint-disable-line
import localStor from '../libs/localStore';
import config from '../libs/config';

import models from './models';
import InterfaceMinerModel from './InterfaceMinerModel';

export default class Miner {
    constructor(params) {
        this.miner = {
            id: params.id,
            pid: '',
            name: '',
            description: '';
            coin: params.coin,
            enable: params.enable || false,
            addedAte: params.addedAte;
            startedAte: '',
            devices: params ? params.cuda_devices : [],
            apiPort: '',
            state: '',
            params: params,
            cmdLine: '~/ewbf-0.3.4b/miner --api 192.168.1.222:42000 --server eu1-zcash.flypool.org --port 3333 --intensity 60 --eexit 3 --solver 0 --fee 0 --user t1TfENUARE95mktDMt7viQvaCtLER3tepGy.dydaev',
        }
        this.model = models[params.model];
        console.log(this.model);
        log.info('Added miner:' + this.miner.name);
    }

    getId = () => this.miner.id;

    getPid = () => this.miner.pid;

    getName = () => this.miner.name;

    getCoin = () => this.miner.coin;

    getParams = () => this.miner.params;

    getDescription = () => this.miner.description;

    getDevices = () => this.miner.devices;

    setDescription = newDescription => this.miner.description = newDescription;

    setEnable = is => this.miner.enable = is;

    isEnable = () => this.miner.enable;

    run() {
        if (true) {
            //var processId = (cmd.get(this.miner.cmdLine).pid) * 1 + 1;
            //log.info(new Date() + ' Run miner with pid: ' + processId);
            this.params.startedAte = new Date();
            log.info(new Date() + ' Miner run: ' + this.getCommandLine());
            
            this.miner.pid = processId;
            //console.log(this.getCommandLine());
        }
    }

    stop() {
        if (this.miner.pid) {
            this.params.startedAte = '';
            log.info(new Date() + ' Stoping miner with pid ' + this.miner.pid);
            //return cmd.get('kill -9 ' + this.miner.pid);
            this.miner.pid = '';
        }
    }

    restart() {
        this.stop()
        setTimeout(() => {
            this.run();
        }, 200);
    }
    
    getCommandLine = () => this.miner.cmdLine;
        
}

/*
    setParams (params) {
        const minimalParams = ['server', 'port', 'user'];
        if (!params || minimalParams.every(value =>
                Object.keys(params).includes(value))) throw new Error('No config for miner: ' + params);
        
    }

    run() {
        if (true) {
            //var process = cmd.get(localConfig.miner.homeFolder + 'miner' + getCmdLine());
            //console.log('/' + 'miner' + this.getCmdLine());
            //log.info('Miner runed with id: ' + process.pid);
            //this.miner.pid = process.pid;
            console.log(this.getCommandLine());
        }
    }

    stop() {
        try {
            var result = cmd.get('kill ' + this.miner.pid);
            console.log('Stoping with result: ' + Object.keys(result));
        } catch (err) {
            consolole.log('What want wrong with stoping miner')
        }
    }

    getCommandLine () {
        const params = minerModel.getParams();
        Object.keys(params).reduce((line, key)=> `${line} --${key} ${params[key]}`, '');
    }

    getMinerById(id){
        return id
        ? (
            localStor.get('miners')
            ? localStor.get('miners').find(miner => miner.id === this.miner.id)
            : log.info('Not found list miners, for geting miner!)')
        )
        : log.info('For get miner by id need id!)');
    }

    updateInfo() {
        if(this.miner.id) {
            const miner = localStor.get('miners').find(miner => miner.id === this.miner.id);
            if (miner) {
                this.miner = Object.assign({}, this.miner, miner);
            } else log.info('Miner with id ' + this.miner.id + ' is not found in list miners');
        } else log.info('Update miner information impossible, isn`t initialized!');
    }*/

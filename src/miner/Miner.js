import cmd from 'node-cmd';
import { v4 as uuid } from 'uuid';

import driver from './driver';
var log = require('../libs/log')(process.mainModule.filename);// eslint-disable-line
import localStor from '../libs/localStore';
import config from '../libs/config';

import InterfaceMinerModel from './InterfaceMinerModel';

export default class Miner {
    constructor(minerModel, params) {
        //if (!minerModel instanceof InterfaceMinerModel) {
            this.miner = {
                enable: true,
                id: uuid(),
                pid: '',
                startedAte: '',
                devices: params ? params.cuda_devices : [],
                apiPort: '',
                state: '',
                params: params,
                cmdLine: '~/ewbf-0.3.4b/miner --api 192.168.1.222:42000 --server eu1-zcash.flypool.org --port 3333 --intensity 60 --eexit 3 --solver 0 --fee 0 --user t1TfENUARE95mktDMt7viQvaCtLER3tepGy.dydaev',
            }
            log.info('Created new miner, id:' + this.miner.id);
        //} else log.error('Didn`t add MinerModel in constructor!');

        //this.getCommandLine = this.getCommandLine.bind(this);
    }

    run() {
        if (true) {
            var processId = (cmd.get(this.miner.cmdLine).pid) * 1 + 1;
            log.info(new Date() + ' Miner runed with pid: ' + processId);
            this.miner.pid = processId;
            //console.log(this.getCommandLine());
        }
    }

    stop() {
        log.info(new Date() + ' Stoping miner with pid ' + this.miner.pid);
        return cmd.get('kill -9 ' + this.miner.pid);
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

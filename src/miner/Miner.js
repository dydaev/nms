import cmd from 'node-cmd';
import { spawn } from 'child_process'
import { v4 as uuid } from 'uuid';

import driver from './driver';
var log = require('../libs/log')(process.mainModule.filename);// eslint-disable-line
import localStor from '../libs/localStore';
import config from '../libs/config';

import * as models from './models';//
import InterfaceMinerModel from './models/InterfaceMinerModel';

export default class Miner {
    constructor(params) {
        this.miner = {
            id: params.id,
            pid: '',
            name: params.name || 'noname',
            description: '',
            server: '',
            port: '',
            wallet: '',
            worker: '',
            coin: params.coin,
            enable: params.enable || false,
            addedAte: params.addedAte,
            startedAte: '',
            uuid_devices: Array.isArray(params.devices) ? params.devices : [],
            apiHost: '',
            state: '',
            params: params,
            reserve: params.reserve || false,
            reservePool: params.reservePool || '',
            keepCmdLine: params.keepCmdLine || false,
            cmdLine: params.cmdLine || '',
            rebootable: params.rebootable || true,
        }
        //if (!models[params.model] instanceof InterfaceMinerModel) {
        this.Model = new models[params.model](params);
        this.updateCmdLine(this.Model.getMinerPath() + this.Model.getParamsLine())
        log.info('Initial miner: ' + this.miner.name + ' for model ' + params.model);
        //} else log.warn('Didn`t initial miner ' + this.miner.name + ' for model ' + params.model)
    }

    getId = () => this.miner.id;

    getPid = () => this.miner.pid;

    getName = () => this.miner.name;

    getCoin = () => this.miner.coin;

    getParams = () => this.miner.params;

    getDescription = () => this.miner.description;

    getReservePool = () => this.miner.reservePool;

    getCmdLine = () => this.miner.cmdLine;

    getDevices = () => this.miner.devices;

    setDescription = newDescription => this.miner.description = newDescription;

    setEnable = is => this.miner.enable = is;

    isEnable = () => this.miner.enable;

    isReserve = () => this.miner.reserve;

    run() {
        if (this.miner.enable) {
            console.log('Starting miner ' + this.Model.getMinerPath());
            console.log('CMD', this.Model.getParamsArray());
            
            // this.minerProcess = spawn(this.Model.getMinerPath(), this.Model.getParamsArray());

            // log.info(new Date() + ' Run miner with pid: ' + this.minerProcess.pid);

            // this.minerProcess.stderr.on('error', error => log.error('Miner error:'+ error));
            // this.minerProcess.stdout.on('data', data => this.parseProcess(data));
            // this.minerProcess.on('close', (code) => {
            //     console.log(`child process exited with code ${code}`);
            // });

            // this.miner.pid = this.minerProcess.pid;
            
            // this.miner.startedAte = new Date();
        }
    }

    stop() {
        if (this.miner.pid) {
            // this.params.startedAte = '';
            // log.info(new Date() + ' Stoping miner with pid ' + this.miner.pid);
            // return cmd.get('kill -9 ' + this.miner.pid);
            this.minerProcess.kill(9);
            this.miner.pid = '';
        }
    }

    restart() {
        if (this.miner.rebootable) {
            //this.minerProcess.kill('SIGHUP');
            this.stop()
            setTimeout(() => {
                this.run();
            }, 200);
        }
    }

    parseProcess = data => {
        console.log(data.toString('utf-8'));
        log.info('Total speed:' + this.Model.processParser(data.toString('utf-8')))
        this.model.getProcessParser(data);
    }
    
    updateCmdLine = newLine => (!this.miner.keepCmdLine
        ? this.miner.cmdLine = newLine
        : log.warn('Can`t updating command line, please check "keepCmdLine" for miner ' + this.miner.name));

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

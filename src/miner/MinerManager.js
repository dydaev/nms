
import Miner from './Miner';
import models from './models';

import { v4 as uuid } from 'uuid';

import localStor from '../libs/localStore';
var log = require('../libs/log')(process.mainModule.filename);// eslint-disable-line


export default class MinerManager {
    constructor() {
        const list = localStor.get('Miners') || {};
        this.list = Object.keys(list).map(idMiner => new Miner(lisi[idMiner]));
    }

    getModelsList = () => Object.keys(models);

    getMiner = idMiner => this.list.find(miner => miner.getId() === idMiner);

    getMinerByPid = pidMiner => this.list.find(miner => miner.getPid() === pidMiner);

    addMiner = params => {
        this.list = Object.keys(list).map(idMiner => new Miner({ ...params, addedAte: new Date() }));
        this.saveMiners();
    }

    saveMiners = () => {
         const miners = this.list.reduce((objectMiners, miner) =>
            Object.assign({}, objectMiners, { [miner.getId()]: miner.getParams()}),{});
        localStor.set(miners);
    }

    getMinersList = () => {
        const list = localStor.get('Miners');
        if (this.list.length) {
            return this.list.map(miner => Object.assign({ [miner.getId()]: miner }));
        } else log.info('Miners list is empty!');
        return undefined;
    }

    deleteMiner = idMiner => {
        if (this.list.includes(idMiner)) {
            this.list.splice(this.list.indexOf(idMiner), 1)
            this.saveMiners();
            log.info('Deleted miner with id:' + idMiner);
            return true;
        } else log.warning('Miner with id: ' + idMiner + ' is not found!');
        return false;
    }

    getActiveMiners = () => this.list.filter(miner => miner.isEnable());

    getActiveCards = () => this.getActiveMiners().reduce((activeCards, miner) => [...activeCards, ...miner.getDevices()],[])

    restartMiner = pidMiner => this.getMinerByPid(idMiner).restart();
}
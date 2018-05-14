
import Miner from './Miner';
import models from './models';

import { v4 as uuid } from 'uuid';

import localStor from '../libs/localStore';
var log = require('../libs/log')(process.mainModule.filename);// eslint-disable-line


export default class MinerManager {
    constructor(cardsManager) {
        const list = localStor.get('Miners') || {};
        this.list = Object.keys(list).map(idMiner => new Miner(list[idMiner], cardsManager));
    }

    getModelsList = () => Object.keys(models);

    getMiner = idMiner => this.list.find(miner => miner.getId() === idMiner);

    getMinerByPid = pidMiner => this.list.find(miner => miner.getPid() === pidMiner);

    addMiner = params => {
        this.list = [...this.list, new Miner({
            ...params,
            id: uuid(),
            addedAte: new Date(),
        })];
        this.saveMiners();
    }

    saveMiners = () => {
         const miners = this.list.reduce((objectMiners, miner) =>
            Object.assign({}, objectMiners, { [miner.getId()]: miner.getParams()}),{});
            console.log(miners);
        localStor.set('Miners', miners);
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
        } else log.warn('Miner with id: ' + idMiner + ' is not found!');
        return false;
    }

    getEnabledMiners = () => this.list.filter(miner => (miner.isEnable() && !miner.isReserve()));
    
    getEnabledCards = () => this.getEnabledMiners().reduce((activeCards, miner) => [...activeCards, ...miner.getDevices()],[])

    getActiveMiners = () => this.list.filter(miner => (miner.isEnable() && !miner.isReserve()));

    getActiveMinersId = () => this.getActiveMiners().map(miner => miner.getId());

    getActiveCards = () => this.getActiveMiners().reduce((activeCards, miner) => [...activeCards, ...miner.getDevices()],[])
    
    restartMinerByPid = pidMiner => this.getMinerByPid(pidMiner).restart();

    switchReserve(idMiner) {
        const currentMiner = this.getMiner(idMiner);
        const reserveMiner = this.getMiner(currentMiner.getReservePool());
        currentMiner.stop();
        reserveMiner.run();

    }
}
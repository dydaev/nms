import cmd from 'node-cmd';

import convert from 'xml-js';
import localStor from '../libs/localStore';
import model from './nvidia-model';
import { isJsonString } from '../libs/utils';
import config from '../libs/config';

var colors = require('colors/safe');
var log = require('../libs/log')(process.mainModule.filename);// eslint-disable-line

import Promise from 'bluebird';


const getAsync = Promise.promisify(cmd.get, { multiArgs: true, context: cmd });

export default class Card {
    constructor(gpuId) {
        console.log('Found new card, id: ' + colors.cyan(gpuId));
        this.gpuId = gpuId;
        this.card = {};
        this.tiksForHistory = 30; // 30 = 1min(if tick = 2sec)
        this.oldierDrawPower = new Array(this.tiksForHistory);
        this.oldierGpuUtil = new Array(this.tiksForHistory);
        this.updaeteInfo();
    }

    getPid = () => this.
    getHistoryPowerByTiks = tiks => this.oldierDrawPower.slice(0, tiks);
    getHistoryGpuUtilByTiks = tiks => this.oldierGpuUtil.slice(0, tiks);

    averagePowerByTicks(tiks) {
        if (tiks < this.oldierDrawPower.length) {
            const averagePower = ~~(this.getHistoryPowerByTiks(tiks).reduce((sum, power) =>
                sum + power * 1, 0) / tiks);
            //console.log('averagePower' + averagePower);
            return averagePower;
        } else log.error('For getting average power of history, tiks must be less ' +
            this.oldierDrawPower.length - 1);
        return undefined;
    }

    averageGpuUtilByTicks(tiks) {
        if (tiks < this.oldierGpuUtil.length) {
            const averageGpuUtil =  ~~(this.getHistoryGpuUtilByTiks(tiks).reduce((sum, power) =>
                sum + power * 1, 0) / tiks);
            //console.log('averageGpuUtil ' + averageGpuUtil);
            return averageGpuUtil;
        } else log.error('For getting average gpu util of history, tiks must be less ' +
            this.oldierGpuUtil.length - 1);
        return undefined;
    }

    isWorkingCard() {
        const pointPower = (this.card.gpu.power_limit /
            (100 / config.devices.isCardWorkIfCpuPowerMoreOfLimit));
        const pointCpu = (this.card.gpu.gpu_util /
            (100 / config.devices.isCardWorkIfCpuUsedMoreOfLimit));
        const isPowerMorePoint = this.averagePowerByTicks(config.devices.limitLowLevelsInHistory) > pointPower;
        const isGpuUtilMorePoint = this.averageGpuUtilByTicks(config.devices.limitLowLevelsInHistory) > pointCpu;
        //console.log('power is ' + isPowerMorePoint, 'gpu is ' + isGpuUtilMorePoint);
        return isPowerMorePoint && isGpuUtilMorePoint;
    }

    setResetHistory() {
        this.oldierDrawPower = new Array(this.tiksForHistory);
        this.oldierGpuUtil = new Array(this.tiksForHistory);
    }

    get(key) {
        return key.split('.').reduce((opendObject, key) =>
        ((typeof opendObject !== 'undefined' && typeof opendObject[key] !== 'undefined')
            ? opendObject[key]
            : undefined)
        , this.card);
    }

    getInfo() {
        return this.card;
    }

    updaeteInfo() {
        getAsync('nvidia-smi -q -x -i ' + this.gpuId).then(data => {// eslint-disable-line
            if (data[0]) {
                const json = JSON.parse(convert.xml2json(data[0], { compact: true, spaces: 2 }));
                if (json) {
                    this.card = model(json);

                    // if (this.oldierDrawPower[0] !== this.card.gpu.power_draw) {
                        this.oldierDrawPower.unshift(this.card.gpu.power_draw);
                        this.oldierDrawPower.pop();
                    // }
                    // if (this.oldierGpuUtil[0] !== this.card.gpu.gpu_util) {
                        this.oldierGpuUtil.unshift(this.card.gpu.gpu_util);
                        this.oldierGpuUtil.pop();
                    // }
                    return this.card;

                } else log.error('Json from nvidia is wrong or empty: ' + json);
            } else log.error('No data from nvidia card:' + data)
        }).catch(err => {
            log.error('Can`t get data from nvidia-smi: ' + err);
        })
    }    
}

/*
averagePower130
averageGpuUtil 99
power is true gpu is true
averagePower202
averageGpuUtil 98
power is true gpu is true
----------------2
averagePower43
averageGpuUtil 50
power is true gpu is true
averagePower78
averageGpuUtil 50
power is true gpu is true
----------------4
averagePower43
averageGpuUtil 50
power is true gpu is true
averagePower78
averageGpuUtil 50
power is true gpu is true
----------------2
averagePower39
averageGpuUtil 50
power is false gpu is true
averagePower68
averageGpuUtil 50
power is false gpu is true
----------------4
averagePower39
averageGpuUtil 50
power is false gpu is true
averagePower68
averageGpuUtil 50
power is false gpu is true

error:Alarm cards is down! ,
    00000000:01:00.0,    36W 43W 44W 131W 130,    0% 100% 99% 0% 
    00000000:02:00.0,    59W 78W 79W 225W 180,    0% 100% 96% 99% 100
*/
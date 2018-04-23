import cmd from 'node-cmd';
import convert from 'xml-js';
import localStor from '../libs/localStore';
import model from './nvidia-model';
import { resolve } from 'dns';
import { isJsonString } from '../libs/utils';

// require("babel-core/register");

// require("babel-polyfill");

import Promise from 'bluebird'

var log = require('../libs/log')(process.mainModule.filename);// eslint-disable-line

const getAsync = Promise.promisify(cmd.get, { multiArgs: true, context: cmd })

export default class Card {
    constructor(gpuId) {
        this.gpuId = gpuId;
        this.card = {};
        this.updaeteInfo();
    }
    
    get(key) {
        this.updaeteInfo();
        return key.split('.').reduce((opendObject, key) =>
        ((typeof opendObject !== 'undefined' && typeof opendObject[key] !== 'undefined')
            ? opendObject[key]
            : undefined)
        , this.card);
    }

    getInfo() {
        this.updaeteInfo();
        return this.card;
    }

    updaeteInfo() {
        getAsync('nvidia-smi -q -x -i ' + this.gpuId).then(data => {
            if (data[0]) {
                const json = JSON.parse(convert.xml2json(data[0], { compact: true, spaces: 2 }));
                if (json) {
                    return this.card = model(json);// eslint-disable-line
                } else log.error('Json from nvidia is wrong or empty: ' + json);
            } else log.error('No data from nvidia card:' + data)
        }).catch(err => {
            log.error('Can`t get data from nvidia-smi: ' + err);
        })
    }    
}

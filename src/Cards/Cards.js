import cmd from 'node-cmd';

import convert from 'xml-js';
import localStor from '../libs/localStore';
import model from './nvidia-model';
import { isJsonString } from '../libs/utils';
import config from '../libs/config';

import Card from './Card';

var colors = require('colors/safe');
var log = require('../libs/log')(process.mainModule.filename);// eslint-disable-line

import Promise from 'bluebird';


const getAsync = Promise.promisify(cmd.get, { multiArgs: true, context: cmd });

export default class Cards {
    constructor() {
        getAsync('nvidia-smi --query-gpu=gpu_name,gpu_uuid --format=csv').then(data => {
            let list =data[0].split('\n')
            list = list.slice(1, list.length-1).map(value => value.split(',')[1].trim());

            if (list.length) {
                this.list = list.reduce((cardList, idCard, index) =>
                    Object.assign({}, cardList, { [idCard]: new Card(idCard, index) })
                , {});
                console.log(this.list);

            } else log.error('No cards for initial in list');

        }).catch(err => {
            log.error('Can`t get data from nvidia-smi: ' + err);
        })
        this.list = [];
        this.updateInfoCards();
    }

    getCardsList = () => Object.keys(this.list);

    updateInfoCards() {
        Object.keys(this.list).forEach(cardId => {
            this.list[cardId].updaeteInfo();
        });
    }

    getCard(id) {
        if (Object.keys(this.list).includes(id)) {
            console.log(this.list[id])
            return this.list[id];
        } else log.info('Can`t get card with id: ' + id + ' is not found!');
        return undefined;
    }

    getIdFreeCards() {
        return Object.keys(this.list).reduce((Cards, idCard) =>
            this.list[idCard].isWorkingCard() ? freeCards : [...freeCards, idCard]
        , []);
    }
}
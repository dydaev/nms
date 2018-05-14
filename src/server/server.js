"use strict";
import express from 'express'
import path from 'path';

import * as middlewares from './middlewares';
import routes from './routes';
import User from '../libs/access';

import { getFreePortFromTo } from '../libs/utils';

import Cards from '../Cards/Cards';
import Miners from '../miner/MinerManager';
require("babel-core/register");
require("babel-polyfill");

//import nvidia from '../nvidia';
//import miner from '../miner';
//import robot from '../robot'
import localStor from '../libs/localStore';
import config from '../libs/config';
var log = require('../libs/log')(process.mainModule.filename);// eslint-disable-line

import loginForm from './html/loginForm';

// =========================initial
const versionApi = '.1';

localStor.set('a1','Initial local store');
console.log(localStor.get('a1'))

const app = express()
const port = 57219;
let clientIp = '';
let serverTimer = 0;

const minerConfig = {
    enable: true,
    name: 'flypool_1070',
    coin: 'ZEC',
    model: 'ewbf034b',
    devices: ['00000000:01:00.0'],
    server: 'eu1-zcash.flypool.org',
    port: 3333,
    intensity: 64,
    wallet: 't1TfENUARE95mktDMt7viQvaCtLER3tepGy',
    worker: 'avoska',
    rebootable: 0,
    keepCmdLine: false,
    reservePool: '',
    cmdLine: '~/ewbf-0.3.4b/miner --server eu1-zcash.flypool.org --port 3333 --user t1TfENUARE95mktDMt7viQvaCtLER3tepGy.dydaev',
};
const reserveMinerConfig = {
    enable: true,
    name: 'nanopool_reserv_1070',
    coin: 'ZEC',
    model: 'ewbf034b',
    devices: ['00000000:01:00.0'],
    server: 'zec-eu2.nanopool.org',
    port: 6666,
    intensity: 64,
    wallet: 't1TfENUARE95mktDMt7viQvaCtLER3tepGy',
    worker: 'avoska',
    rebootable: 0,
    keepCmdLine: false,
    reserve: true,
    reservePool: '792bd6cb-742f-4500-8e58-a787aca6be6d',
    cmdLine: '~/ewbf-0.3.4b/miner --server zec-eu2.nanopool.org --port 6666 --cuda_devices 1 --intensity 64 --eexit 3 --user t1TfENUARE95mktDMt7viQvaCtLER3tepGy.slon',
};

const CardManager = new Cards();
const MinerManager = new Miners(CardManager);
//CardManager.updateInfoCards();
// MinerManager.addMiner(reserveMinerConfig);
// ============================end initial

app.use('/', (req, res, next) => {
    clientIp = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).split(':');
    clientIp = clientIp[clientIp.length - 1];
    console.log(`${new Date()} ${clientIp}:${req.method}(${req.originalUrl})`);
    next();
})

let tempBanList = {};
const banList = [
    '213.111.88.215',
    '212.47.244.68',
    '139.162.79.87',
    '94.244.138.98',
    '94.244.138.21',
    '94.244.138.44',
    '31.184.193.154',
    '190.8.40.10',
    '46.164.184.179',
    '123.249.24.212',
    '163.172.168.251',
    '107.170.232.173',
    '189.102.79.242',
];

// var jsonParser = bodyParser.json();
// var urlencodedParser = bodyParser.urlencoded({ extended: false });

// app.post('/api/users', jsonParser, function (req, res) {
//     if (!req.body) return res.sendStatus(400)
//     // create user in req.body
// })

/*---------------------------------robot talk--
import through2 from 'through2';

const tooProcents = (value, from) => ~~(100 / (from / value)) + '%';

const toUpperCase = through2((data, enc, cb) => {
    if (data.toString() == 'cards\n') {
        console.log('Cards information ' + new Date());
        const activeCards = CardManager.getCardsList()

        activeCards.forEach(idCard => {
            const card = CardManager.getCard(idCard);
            log.info('Card ' + card.getIndex() + ' ' + card.get('gpu.name') + ',' +
                ' temp:' + card.get('gpu.temperature') + 'C(' + tooProcents(card.get('gpu.temperature'), 70) + ')' +
                ' fan:' + card.get('gpu.fan_speed') + '%' +
                ' | power:' + card.get('gpu.power_draw') + 'W(' + card.get('gpu.max_power_limit') + 'W)' +
                ' cpu :' + card.get('gpu.gpu_util') + '%' +
                ' | clock:' + card.get('gpu.graphics_clock') + 'MHz(' + tooProcents(card.get('gpu.graphics_clock'), card.get('gpu.max_graphics_clock')) + ')' +
                ' memory:' + card.get('gpu.mem_clock') + 'MHz(' + tooProcents(card.get('gpu.mem_clock'), card.get('gpu.max_mem_clock')) + ')'
            );
        })

    }
    cb(null, new Buffer(data.toString().toUpperCase()));
});

process.stdin.pipe(toUpperCase); 
=========================*/

//(routes)(app, User);

// const getFreePort = async () => {
//     const port = await getFreePortFromTo(42000, 48000);
//     console.log(port);
// }
//getFreePort()
const activeMiners = [];
let enabledMiners = MinerManager.getEnabledMiners();
setTimeout(() => {
    enabledMiners.forEach(miner => {
        miner.run();
        // const card = CardManager.getCard(idCard);
        // if (card && !card.isWorkingCard()) {
        //     log.error(new Date() + ` Card ${card.get('gpu.name')} : ${card.get('gpu.id')} is crashed`);
        //     MinerManager.restartMinerByPid(card.get('gpu.processes_pid'))
        // }
    });
}, 300);

const limitSkipTickOfCardsDown = 5;
let skipedTicksOfCardsDown = 0;

setInterval(() => {// eslint-disable-line
    serverTimer++;

    if (!(serverTimer % 2)) {
        //activeMiners = MinerManager.getActiveMiners();
        // CardManager.updateInfoCards();
    }
    
    if (!(serverTimer % 4)) {
        //const activeMiners = MinerManager.getActiveMiners();
        
        if (activeMiners.length){
            if (skipedTicksOfCardsDown === 0) {
                skipedTicksOfCardsDown = limitSkipTickOfCardsDown + 1;
                
               //check working active miners, if stay then restart
                
                skipedTicksOfCardsDown--;
            }
        } else skipedTicksOfCardsDown = 0;        
        
        
        //nvidia.updateInfo();
        //miner.getMinerInfo();
        /*miner.addMiner({
            api: '192.168.1.222:42000',
            server: 'eu1-zcash.flypool.org',
            port: '3333',
            intensity: '60',
            eexit: '3',
            solver: '0',
            fee: '0',
            user: 't1TfENUARE95mktDMt7viQvaCtLER3tepGy.dydaev',
        });*/
        //robot();
        //log.info('info')
    }

    if (!(serverTimer % 1800)) {//30min
        activeMiners.getActiveMinersId().forEach(idMiner => activeMiners.switchReserve(idMiner));
    }
}, 1000) 

if (process.env.NODE_ENV === 'production') {// eslint-disable-line
    console.log('Listen port: ' + port);// eslint-disable-line
    app.listen(port);
}
export default app;

import express from 'express'
import path from 'path';

import * as middlewares from './middlewares';
import routes from './routes';

import Cards from '../Cards/Cards';
import Miners from '../miner/MinerManager';


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
const port = 8080;
let clientIp = '';
let serverTimer = 0;

const minerConfig = {
    enable: false,
    name: 'flypool_1080',
    coin: 'ZEC',
    model: 'ewbf034b',
    devices: ['00000000:01:00.0'],
    server: 'eu1-zcash.flypool.org',
    port: 3333,
    api: '192.168.1.222:42000',
    intensity: 64,
    wallet: 't1TfENUARE95mktDMt7viQvaCtLER3tepGy',
    worker: 'slon',
    rebootable: 0,
    keepCmdLine: false,
    cmdLine: '~/ewbf-0.3.4b/miner --api 192.168.1.222:42000 --server eu1-zcash.flypool.org --port 3333 --eexit 3 --fee 0 --user t1TfENUARE95mktDMt7viQvaCtLER3tepGy.dydaev',
};

const CardManager = new Cards();
const MinerManager = new Miners();
//MinerManager.addMiner(minerConfig);
// ============================end initial

app.use('/', (req, res, next) => {
    clientIp = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).split(':');
    clientIp = clientIp[clientIp.length - 1];
    console.log(`${new Date()} ${clientIp}:${req.method}(${req.originalUrl})`);
    next();
})

const banList = [
    '213.111.88.215',
    '212.47.244.68',
    '139.162.79.87',
    '94.244.138.21',
    '94.244.138.44',
    '31.184.193.154',
    '163.172.168.251',
];

app.use('/login', (req, res, next) => {
    if (!banList.includes(clientIp)) {//req.signedCookies.user  !== undefined &&
        next();
    } else {
        res.status(500).send('Something broke!');
    }
})

app.use('/login/form', (req, res) => res.send(loginForm));
app.use(middlewares.showCookies);
(routes)(app);


const limitSkipTickOfCardsDown = 5;
let skipedTicksOfCardsDown = 0;

setInterval(() => {// eslint-disable-line
    serverTimer++;

    if (!(serverTimer % 2)) {
        CardManager.updateInfoCards();
    }
    
    if (!(serverTimer % 4)) {
        const activeMiners = MinerManager.getActiveMiners();

        if (activeMiners.length){
            if (skipedTicksOfCardsDown === 0) {
                skipedTicksOfCardsDown = limitSkipTickOfCardsDown + 1;

                const activeCards = MinerManager.getActiveCards();

                activeCards.forEach(idCard => {
                    const card = CardManager.getCard(idCard);
                    if (!card.isWorkingCard()) {

                        log.error(new Date() + ` Card ${card.get('gpu.name')} : ${card.get('gpu.id')} is crashed`);
                        MinerManager.restartMinerByPid(card.get('gpu.processes_pid'))
                    }
                });
                
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
}, 1000) 

if (process.env.NODE_ENV === 'production') {// eslint-disable-line
    console.log('Listen port: ' + port);// eslint-disable-line
    app.listen(port);
}
export default app;

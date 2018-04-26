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
    eexit: 3,
    fee: 0,
    wallet: 't1TfENUARE95mktDMt7viQvaCtLER3tepGy',
    worker: 'slon'
};

const CardManager = new Cards();
const MinerManager = new Miners();
// ============================end initial

app.use('/', (req, res, next) => {
    clientIp = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).split(':');
    clientIp = clientIp[clientIp.length - 1];
    console.log(`${new Date()} ${clientIp}:${req.method}(${req.originalUrl})`);
    next();
})

app.use('/login', (req, res, next) => {
    if (clientIp !== 7798) {//req.signedCookies.user  !== undefined &&
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

//MinerManager.run();

setInterval(() => {// eslint-disable-line
    serverTimer++;

    if (!(serverTimer % 2)) {
        CardManager.updateInfoCards();
    }
    
    if (!(serverTimer % 4)) {
        //MinerManager.stop();
        if (CardManager.getIdFreeCards().length){
            if (skipedTicksOfCardsDown === 0) {
                skipedTicksOfCardsDown = limitSkipTickOfCardsDown + 1;
                //const listIdFreeCards = CardManager.getIdFreeCards();

                const usedCards = MinerManager.getActiveCards();

                usedCards.forEach(idCard => {
                    const card = CardManager.getCard(idCard);
                    if (!card.isWorkingCard()) {

                        log.error(new Date() + ` Card ${card.get('gpu.name')} : ${card.get('gpu.id')} is crashed`);
                        MinerManager.restartMiner(card.get('gpu.processes_pid'))
                    }
                });
                
                
                skipedTicksOfCardsDown--;
            }
        } else skipedTicksOfCardsDown = 0;


        //console.log(GTX1070.get('lastUpdates'), '->' , GTX1070.get('gpu.power_draw') + 'W', GTX1080.get('gpu.power_draw') + 'W');
        //if (serverTimer > 3) MinerManager.stop();
        
        
        
        
        
        
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

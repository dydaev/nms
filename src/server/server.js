import express from 'express'
import path from 'path';

import * as middlewares from './middlewares';
import routes from './routes';
import Card from '../Cards/Card';
import Cards from '../Cards/Cards';
import Miner from '../miner/Miner';
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
    api: '192.168.1.222:42000',
    server: 'eu1-zcash.flypool.org',
    port: 3333,
    intensity: 60,
    eexit: 3,
    solver: 0,
    fee: 0,
    user: 't1TfENUARE95mktDMt7viQvaCtLER3tepGy.slon',
};

const CardsList = new Cards();
const ewbf1 = new Miner(minerConfig);
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

//ewbf1.run();

setInterval(() => {// eslint-disable-line
    serverTimer++;

    if (!(serverTimer % 2)) {
        CardsList.updateInfoCards();
    }
    
    if (!(serverTimer % 4)) {
        //ewbf1.stop();
        if (CardsList.getIdFreeCards().length){
            if (skipedTicksOfCardsDown === 0) {
                skipedTicksOfCardsDown = limitSkipTickOfCardsDown + 1;
                const listIdFreeCards = CardsList.getIdFreeCards();
                const listFreeCards = listIdFreeCards.map(idCard => {
                    const card = CardsList.getCard(idCard);
                    return [
                        card.gpuId,
                        card.getHistoryPowerByTiks(5).join('W '),
                        card.getHistoryGpuUtilByTiks(5).join('% '),
                    ]
                });
                log.error(new Date() + ' Alarm cards is down! ,' + listFreeCards);
                
                ewbf1.restart()
                
                skipedTicksOfCardsDown--;
            }
        } else skipedTicksOfCardsDown = 0;


        //console.log(GTX1070.get('lastUpdates'), '->' , GTX1070.get('gpu.power_draw') + 'W', GTX1080.get('gpu.power_draw') + 'W');
        //if (serverTimer > 3) ewbf1.stop();
        
        
        
        
        
        
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

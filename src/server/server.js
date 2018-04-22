import express from 'express'
import path from 'path';

import routes from './routes';
import nvidia from '../nvidia';
import miner from '../miner';
import robot from '../robot'
import localStor from '../libs/localStore';
import config from '../libs/config';
var log = require('../libs/log')(process.mainModule.filename);// eslint-disable-line

import loginForm from './html/loginForm';

const versionApi = '.1';

localStor.set('a1','Initial local store');
console.log(localStor.get('a1'))

const app = express()
const port = 8080;
let clientIp = '';
let serverTimer = 0;

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
//res.setHeader('Cache-Control', 'public, max-age=0')

app.use('/login/form', (req, res) => res.send(loginForm));
//app.use(middlewares);
(routes)(app);

setInterval(() => {
    serverTimer++;
    if (!(serverTimer % 5)) {
        nvidia.updateInfo();
        miner.getMinerInfo();
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
        robot();
        //log.info('info')
    }
}, 1000)

if (process.env.NODE_ENV === 'production') {
    console.log('Listen port: ' + port);
    app.listen(port);
}
export default app;

import express from 'express'
import path from 'path';

import routes from './routes';

import localStor from '../libs/localStore';
//const localStor = new Stor();
import config from '../libs/config';

import loginForm from './html/loginForm';

const versionApi = '.1';

localStor.set('a1','mama');
console.log(localStor.get('a1'))
// if (typeof localStorage === "undefined" || localStorage === null) {
//     var LocalStorage = require('node-localstorage').LocalStorage;
//     localStorage = new LocalStorage('./scratch');
// }
//localStorage.setItem('myFirstKey', JSON.stringify('rew'));
//console.log(JSON.parse(localStorage.getItem('myFirstKey')));

const app = express()
let clientIp = '';
const port = 8080;

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
//require('./routes')(app);

if (process.env.NODE_ENV === 'production') {
    console.log('Listen port: ' + port);
    app.listen(port);
}
export default app;

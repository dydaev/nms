import express from 'express'
import path from 'path';

import config from '../libs/config';
import sessionStore from '../libs/sessionStore';
import { Session } from 'inspector';

const app = express()
let clientIp = '';
const port = 8080;

app.use('/', (req, res, next) => {
    clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('Client(' + clientIp + ') sent request: ' + req);
    next();
})

app.use('/login', (req, res, next) => {
    if (clientIp !== 7798) {
        next();
    } else {
        res.status(500).send('Something broke!');
    }   
})

app.use('/login/form', (r,q) => {
    console.log('logiiin')
    q.send('sa')
})//express.static(__dirname + 'html'));

app.use(session({
    secret: config.session.sole,
    key: config.session.key,
    cookie: config.session.cookie,
    store: sessionStore,
}));

app.get('/api_v.1', (req, res) => {
    res.send({
      message: 'version .11333'
    })
})
console.log('Mode ', process.env.NODE_ENV)
if (process.env.NODE_ENV === 'production') {
    console.log('Listen port: ' + port);
    app.listen(port);
}
export default app;

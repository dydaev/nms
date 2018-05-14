import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';

import config from '../../../libs/config';

var log = require('../../../libs/log')(process.mainModule.filename);// eslint-disable-line
import localStor from '../../../libs/localStore';



export const POST = (req, res) => {
    res.send('login');
};

/* app.use('/login/authoryzation', urlencodedParser, (req, res, next) => {
    console.log(req.body);
    if (!req.body.login || !req.body.codesms !== config.codesms || !req.body.password)
        return res.sendStatus(404);

    if (req.body.login !== config.user || req.body.password !== config.pass) {
        tempBanList = 
        return res.sendStatus(500);
    }

    user = {
        lateAuthorityDate: new Date(),
        user: req.body.login,
        pass: bcrypt.hashSync(req.body.password, 8),
    }

    if (Object.keys())

        res.send('welcome, ' + req.body.login)
}, (err, user) => {
    if (err) return res.status(500).send("There was a problem registering the user.");

    var token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 5
    });
    res.status(200).send({ auth: true, token: token });
}) */
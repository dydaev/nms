import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';

import config from '../../../libs/config';

var log = require('../../../libs/log')(process.mainModule.filename);// eslint-disable-line
import localStor from '../../../libs/localStore';



export const POST = (req, res) => {
    res.send('register');
};
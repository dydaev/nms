const log = require('../../../libs/log')(module);
import config from '../../../libs/config';

exports.post = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    console.log('user', username, 'pass', password);
    //check login pass
    //generate token

}
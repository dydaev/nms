import request from 'request';
import config from '../libs/config'
var log = require('../libs/log')(process.mainModule.filename);// eslint-disable-line

export default {
    getState: (host = config.miner.apiHost, port) => {
        if (host && port) {
            request(`${host}:${port}/getstat`, (error, response, body) => {
                if (error) {
                    log.error('Error with connecting to miner api: ' + error);
                } else if (response.statusCode !== 200) {
                    log.info('Status code from miner: ' + response.statusCode);
                } else {
                    return JSON.parse(body);
                }
            });
        } else log.error('Check host or port for geting miner state(' + host + ', ' + port + ')');
        return null;
    }
}

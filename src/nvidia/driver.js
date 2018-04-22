import cmd from 'node-cmd';
import convert from 'xml-js';
import localStor from '../libs/localStore';
import model from './models';

var log = require('../libs/log')(process.mainModule.filename);// eslint-disable-line

const isJsonString = str => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
export default {
    updateInfo: (device) => {
        cmd.get(
            'nvidia-smi -q -x',//commands.get(info, device),
            (err, json) => {
                if (!err) {
                    if (json && isJsonString(json)) {
                        const data = JSON.parse(convert.xml2json(json, { compact: true, spaces: 2 }));
                        return model(data);
                    } else log.error('Json from nvidia is wrong or empty: ' + json);
                } else {
                    log.error('Can`t open opening cards: ' + err)
                }
            }
        );
    },
}

import localStor from '../libs/localStore';
import cmd from 'node-cmd';
import beep from 'beepbeep';
import config from '../libs/config';

var log = require('../libs/log')(process.mainModule.filename); // eslint-disable-line

export default () => {
    const miner = localStor.get('miner');
    if (miner && Array.isArray(miner.result)) {
        const cardsIsStay = miner.result.find(value => value.speed_sps < 50);

        if (cardsIsStay) {
            log.error('Cards krashed ' + cardsIsStay + 'Sol/sec')
            cmd.run('aplay ' + config.main.sounds.sirena);
            beep([1000, 500, 2000]);
            //restart mainer;
        } else {
            const speeds = [...miner.result.map(value => value.speed_sps), ' '];
            log.info('Cards speed: ' + speeds.join('Sol/sec '));
        }
    }
};
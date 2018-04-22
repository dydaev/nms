import localStor from '../libs/localStore';
import cmd from 'node-cmd';
import beep from 'beepbeep';
import config from '../libs/config';

var log = require('../libs/log')(process.mainModule.filename); // eslint-disable-line

export default () => {// eslint-disable-line
    const miner = localStor.get('miner');
    const nvidia = localStor.get('nvidia-devices');

    if (miner && Array.isArray(miner.result)) {
        const cardsIsStay = miner.result.find(value => value.speed_sps < config.devices.isDeviceUsedGpuUtil);
        let isPowerLessHalf = false;
        let isGpuUtilLessHalf = false;

        let cardsParams = [];
        if (nvidia && Array.isArray(Object.keys(nvidia.gpu)) && Object.keys(nvidia.gpu).length > 0) {
            cardsParams = Object.keys(nvidia.gpu).reduceRight((params, value) => {
                isPowerLessHalf = nvidia.gpu[value].power_draw < config.devices.isDeviceUsedGpuPow ? nvidia.gpu[value].power_draw : isPowerLessHalf;
                isGpuUtilLessHalf = nvidia.gpu[value].gpu_util < config.devices.isDeviceUsedGpuUtil ? nvidia.gpu[value].gpu_util : isGpuUtilLessHalf;

                const lengthLine = 21;
                let line = ` ${nvidia.gpu[value].gpu_util}%(${nvidia.gpu[value].power_draw}W) ${nvidia.gpu[value].temperature}C(${nvidia.gpu[value].fan_speed}%)`;
                line = line.length > lengthLine ? line : line + new Array( lengthLine - line.length).fill(' ').join('');
                return [...params, line];
            }, []);
        }

        if (cardsIsStay || (!(isPowerLessHalf === false) || !(isGpuUtilLessHalf === false))) {
            cmd.run('aplay ' + config.main.sounds.sirena);
            beep([1000, 500, 2000]); // eslint-disable-line

            if (!(isPowerLessHalf === false) || !(isGpuUtilLessHalf === false)) {
                log.error('Devices is down');
            } else if (cardsIsStay) {
                const speeds = miner.result.map(value => value.speed_sps);
                log.error('Miner is wrong (' + speeds.join(' & ') + ')Sol/sec')
            }

            //restart mainer;
        } else {
            const speeds = miner.result.map(value => value.speed_sps);
            log.info(
                'Cards speed: ' + speeds.join('+') +
                ' ' + speeds.reduce((sum, value) => sum + value, 0) + 'Sol/sec |' +
                cardsParams.join(' | ') + '|'
            );
        }
    }
};
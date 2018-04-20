import cmd from 'node-cmd';
import http from 'http';
//var log = require('../libs/log')(module);
import * as commands from './commands'
import localStor from '../libs/localStore';
// import config from '../libs/config';

const runMiner = 'sh /home/dydaev/ewbf-0.3.4b/miner';
const ApiUrl = 'http://192.168.1.222:42000/getstat'

const miner = {
    pid: '',
    devices: [],
    apiPort: '',
    startedAte: '',
}
        /* 
        config.miner 

        (server
        port
        apiHost
        startApiPort
        wallet)

        if (Array.isArray(devices)) {
        //     dev = '--cuda_devices ' + devices.join(' ');
        // }
        //'lsof | grep 42000' check api port busy at the moment
        --server
        --port
        --fee 0
        --api 192.168.1.222:42000 --server eu1-zcash.flypool.org --port 3333 --intensity 64 --eexit --solver 0 --fee 0 --user t1TfENUARE95mktDMt7viQvaCtLER3tepGy.dydaev
        */
export default {
    startMiner: config => cmd.get(runMiner + config).pid,
    
    killPid: pid => pid ? cmd.run('kill ' + pid) : false,//log.info('Fail kill, no pid');
    
    isWorkingPid: pid => {
        if (pid) {
            cmd.get(
                'ps aux | grep ' + pid + ' | grep miner',
                (err, data, stderr) => data ? true : false
            );
        }// else log.info('Fail check pid, no pid');
    },

    getMinerInfo: () => {
        let result = {};
        http.get(ApiUrl, function (response) {
            var buffer = "",
                data;

            response.on("data", function (chunk) {
                buffer += chunk;
            });

            response.on("end", function (err) {
                localStor.set('miner', JSON.parse(buffer));
            });
        });
        //localStor.set('miner', result);
        return result;
    },
}
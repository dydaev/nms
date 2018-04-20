
const controllers = {
    'api_v.1': {
        'control': {
            'info': require('./control/info'),
            'set_power': require('./control/setPower'),
        },
        'miner': {
            'stop': require('./miner/stop'),
            'start': require('./miner/start'),
        },
        'cards': {
            'list': require('./cards/list'),
        }
    }
};

const checkAccess = (app) => true

export default app => 
    app.route('/api_v.1/*').all((req, res, next) => {
        if (true) {
            const method = req.method;
            const path = req.path.split('/').slice(1);
            const value = path.reduce((acc, val)=>{
                return Object.prototype.toString.call(acc) === '[object Object]'
                ? acc[val] : (acc[val] === undefined ? false : val);
            }, controllers);

            if (value && Object.prototype.toString.call(value[method]) === '[object Function]') {
                value[method](req, res);
            } else res.status(501).send('api not found');
        } else res.status(401);
    });

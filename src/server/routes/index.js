import { accessConsts } from '../../libs/access';
const { ALL, USER, MANAGER, ADMIN } = accessConsts;

const controllers = {
    'login': {
        'form': { access: [ALL] ,controller: require('./administration/loginForm') },
        'registration': { access: [ADMIN] ,controller: require('./administration/registration') },
        'authoryzation': { access: [ALL] ,controller: require('./administration/auth') },
    },
    'api_v.1': {
        'control': {
            'set_power': { access: [MANAGER] ,controller: require('./control/setPower') },
        },
        'miner': {
            'info': { access: [MANAGER, USER] ,controller: require('./miner/info') },
            'stop': { access: [MANAGER] ,controller: require('./miner/stop') },
            'start': { access: [MANAGER] ,controller: require('./miner/start') },
        },
        'cards': {
            'info': { access: [MANAGER, USER] ,controller: require('./cards/info') },
            'list': { access: [MANAGER] ,controller: require('./cards/list') },
        }
    }
};

export default (app, User) =>
    app.route('/*').all((req, res, next) => {
        if (true) {
            const method = req.method;
            const path = req.path.split('/').slice(1);
            const value = path.reduce((acc, val, ind) =>           
                (acc !== undefined && ind < path.length)
                ? (acc[val] !== undefined ? acc[val] : undefined)
                : (acc !== undefined ? val : undefined)
            , controllers);

            if (value) {                
                if (Array.isArray(value.access) &&
                    (
                        value.access.includes(ALL) ||
                        User.checkPrivilege(value.access) ||
                        User.isAdmin()
                    )
                ) {
                    if (value && Object.prototype.toString.call(value.controller[method]) === '[object Function]') {
                        value.controller[method](req, res);
                    } else res.status(404)//.send('route or method is not defined');
                } else res.status(404);
            } else res.status(404);
        } else res.status(401);
    });

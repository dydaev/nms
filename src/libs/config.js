import access from './accessConfig';

export default Object.assign({},{
    main: {
        sounds: {
            sirena: './src/public/sirena_2.mp3',
        }
    },
    miner: {
        run: 'miner',
        homeFolder: '/home/dydaev/ewbf-0.3.4b/',
        server: 'eu1-zcash.flypool.org',
        port: '3333',
        apiHost: 'http://localhost',
        startApiPort: 42000,
        wallet: 't1TfENUARE95mktDMt7viQvaCtLER3tepGy',
    },
    devices: {
        isDeviceUsedGpuUtil: 50,
        isDeviceUsedGpuPow: 50,
    },
    mongo: {
        connect: {
            host: '127.0.0.1',
            port: '27017',
            database: 'minerStore',
            url: 'mongodb://localhost'
        },
        options: {
            server: {
                socketOptions: {
                    keepAlive: 1,
                }
            }
        }
    },
}, access);
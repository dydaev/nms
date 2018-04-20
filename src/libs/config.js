import access from './accessConfig';

export default Object.assign({},{
    miner: {
        server: 'eu1-zcash.flypool.org',
        port: '3333',
        apiHost: '192.168.1.222',
        startApiPort: 42000,
        wallet: 't1TfENUARE95mktDMt7viQvaCtLER3tepGy',
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
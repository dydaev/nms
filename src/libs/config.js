import access from './accessConfig';

export default Object.assign({},{
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
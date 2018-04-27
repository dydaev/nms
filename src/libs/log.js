var winston = require('winston');

function getLogger(filePath) {
    var path = filePath ? filePath.split('/').slice(-2).join('/') : 'path undefined';
    return new winston.Logger({
        transports: [
            new winston.transports.Console({
                colorize: true,
                level: 'debug',
                label: path
            }),
            new (winston.transports.File)({
                filename: 'node.log',
                label: path
            })
        ]
    });
}

module.exports = getLogger;

/*
  log.silly('Message');
  log.debug('Message');
  log.verbose('Message');
  log.info('Message');
  log.warn('Message');
  log.error('Message');
*/
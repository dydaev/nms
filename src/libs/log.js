import winston from 'winston';

export default module => {
    const pathName = module.filename.split('/').split(-2).join('/');

    return new winston.Logger({
        transports: [
            new winston.transports.Console({
                colorize: true,
                level: 'debug',
                label: path,
            }),
            new (winston.transports.File)({
                filename: 'node.log',
                label: path,
            })
        ]
    });
}
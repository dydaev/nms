var log = require('../../libs/log')(process.mainModule.filename);// eslint-disable-line

export default class InterfaceMinerModel {
    constructor() {
        if (!this.getParams) log.error('Model is have`nt method getParams()');
    }

    getParamsLine() {
        if (this.params) {
            const params = this.getParams(this.params);
            return Object.keys(params).reduce((line, key) =>
                line + (typeof params[key] === 'function' ? params[key]() : params[key]), '')
        } else return undefined;
    }

    getMinerPath = () => this.pathToMiner;
}
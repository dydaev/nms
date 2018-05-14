var log = require('../../libs/log')(process.mainModule.filename);// eslint-disable-line

export default class InterfaceMinerModel {
    constructor(params, cardsManager) {
        this.cardsManager = cardsManager;
        if (!this.getParams) log.error('Model is have`nt method getParams()');
    }

    getParamsArray() {
        if (this.params) {
            const params = this.getParams(this.params);
            return Object.keys(params).reduce((arr, key) =>
                [...arr, (typeof params[key] === 'function' ? params[key]() : params[key])], [])
                .reduce((arr, param) => [...arr, ...param.split(' ')], [])
                .filter(param => param !== '')
                .map(param => param.trim())
        } else return [];
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
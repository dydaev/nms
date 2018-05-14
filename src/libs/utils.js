var log = require('./log')(process.mainModule.filename);// eslint-disable-line
import cmd from 'node-cmd';

//====================================packModel
const getVariableFromDataObject = (model, dataObject, typeAndPath) => {
    const type = typeAndPath[0];
    const pathToVariable = typeAndPath[1].split('.');
    const variable = pathToVariable.reduce((opendObject, key) =>
        ((typeof opendObject !== 'undefined' && typeof opendObject[key] !== 'undefined')
            ? opendObject[key]
            : undefined)
        , dataObject);
    if (typeof variable !== 'undefined') {
        //console.log(pathToVariable, variable);
        switch (type) {
            case 'int':
                return Number.parseInt(variable);
                break;
            case 'bool':
                return (variable == 'true');
                break;
            case 'string':
                return variable;
            default:
                return variable;
        }
    } else return '';//undefined;
};

export const packModel = (model, dataObject) => {
    if (typeof dataObject === 'object') {
        return Object.keys(model).reduce((pack, key) => {
            //console.log(key, '=', model[key], Array.isArray(model[key]));
            return Object.assign({}, pack, {
                [key]: Array.isArray(model[key])
                    ? getVariableFromDataObject(model, dataObject, model[key])
                    : packModel(model[key], dataObject)
            });
        }, {});
    } else log.error('Unexpected object for packing model nvidia: ' + model);
}
//====================================END packModel

export const getFreePortFromTo = (from, to) => {
    //get used ports
    
    return cmd.get(
        "netstat -tulpn | grep -E 'tcp|udp' | awk '{ print $4 }'",
        (err, data) => {
            const portsList = data.split('\n').map(portStr => {
                const arrStr = portStr.split(':')
                return arrStr[arrStr.length - 1];
            });
            let port;
            const usedPortsBeetweenFromTo = portsList.reduce(
                (list, port) =>
                    ((port > from && port < to) ? [...list, port] : list)
                , []
            );
            while (!port || usedPortsBeetweenFromTo.length < (to - from)) {
                const testPort = Math.floor(Math.random() * (to - from)) + from;
                port = portsList.includes(String.toString(testPort))
                    ? undefined : testPort;
            }
            return port;
        }
    );

}

export const isJsonString = str => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
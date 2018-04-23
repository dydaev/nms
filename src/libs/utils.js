var log = require('./log')(process.mainModule.filename);// eslint-disable-line


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

export const isJsonString = str => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
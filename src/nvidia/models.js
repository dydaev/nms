import convert from 'xml-js';
var log = require('../libs/log')(process.mainModule.filename);// eslint-disable-line

export const telemetry = {
    gpu_util: '%',
    memory_util: '%',
    fan_speed: '%',
    temperature: 'C',
    memory_temp: 'C',
    gpu_temp_max_threshold: 'C',
    power_draw: 'W',
    power_limit: 'W',
    max_power_limit: 'W',
    graphics_clock: 'MHz',
    mem_clock: 'MHz',
    video_clock: 'MHz',
    max_graphics_clock: 'MHz',
    max_mem_clock: 'MHz',
    max_video_clock: 'MHz'
};

const model = {
    lastUpdates: ['string', 'nvidia_smi_log.timestamp._text'],
    driverVersion: ['string', 'nvidia_smi_log.driver_version._text'],
    countGPU: ['string', 'nvidia_smi_log.attached_gpus._text'],
    gpu: {
        id: ['string', '_attributes.id'],
        uuid: ['string', 'uuid._text'],
        brand: ['string', 'product_brand._text'],
        name: ['string', 'product_name._text'],
        vbios_version: ['string', 'vbios_version._text'],
        processes: ['string', 'processes.process_info.process_name._text'],
        gpu_util: ['int', 'utilization.gpu_util._text'],
        memory_util: ['int', 'utilization.memory_util._text'],
        fan_speed: ['int', 'fan_speed._text'],
        temperature: ['int', 'temperature.gpu_temp._text'],
        memory_temp: ['int', 'temperature.memory_temp._text'],
        gpu_temp_max_threshold: ['int', 'temperature.gpu_temp_max_threshold._text'],
        power_draw: ['int', 'power_readings.power_draw._text'],
        power_limit: ['int', 'power_readings.power_limit._text'],
        max_power_limit: ['int', 'power_readings.max_power_limit._text'],
        dispaly: ['bool', 'display_mode._text '],
        clocks:{
           graphics_clock: ['int', 'clocks.graphics_clock._text'],
           mem_clock: ['int', 'clocks.mem_clock._text'],
           video_clock: ['int', 'clocks.video_clock._text'],
           max_graphics_clock: ['int', 'max_clocks.graphics_clock._text'],
           max_mem_clock: ['int', 'max_clocks.mem_clock._text'],
           max_video_clock: ['int', 'max_clocks.video_clock._text'],
        },
    },
};

const getVariableFromDataObject = (model, dataObject, modelArray) => {
    const type = modelArray[0];
    const pathToVariable = modelArray[1].split('.');
    const variable = pathToVariable.reduce((opendObject, key) =>
        ((typeof opendObject !== 'undefined' && typeof opendObject[key] !== 'undefined')
            ? opendObject[key]
            : undefined)
        , dataObject);
    if (typeof variable !== 'undefined') {
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

const packModel = (model, dataObject) => {
    if (typeof dataObject === 'object') {
        return Object.keys(model).reduce((pack, key) => {
            return {
                ...pack,
                [key]: Array.isArray(model[key])
                        ? getVariableFromDataObject(model, dataObject, model[key])
                        : packModel(model, dataObject[key])
            };            
        },{});
    } else log.error('Unexpected object for packing model nvidia: ' + model);
}

export default (data) => {
    if (data){
        return packModel(model, data);
    } else log.error('Data for model packing wrong or empty: ' + json);
}
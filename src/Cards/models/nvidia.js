import { packModel } from '../../libs/utils';

var log = require('../../libs/log')(process.mainModule.filename);// eslint-disable-line

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
        id: ['string', 'nvidia_smi_log.gpu._attributes.id'],
        uuid: ['string', 'nvidia_smi_log.gpu.uuid._text'],
        brand: ['string', 'nvidia_smi_log.gpu.product_brand._text'],
        name: ['string', 'nvidia_smi_log.gpu.product_name._text'],
        vbios_version: ['string', 'nvidia_smi_log.gpu.vbios_version._text'],
        processes: ['string', 'nvidia_smi_log.gpu.processes.process_info.process_name._text'],
        processes_pid: ['string', 'nvidia_smi_log.gpu.processes.process_info.pid._text'],
        gpu_util: ['int', 'nvidia_smi_log.gpu.utilization.gpu_util._text'],
        memory_util: ['int', 'nvidia_smi_log.gpu.utilization.memory_util._text'],
        fan_speed: ['int', 'nvidia_smi_log.gpu.fan_speed._text'],
        temperature: ['int', 'nvidia_smi_log.gpu.temperature.gpu_temp._text'],
        memory_temp: ['int', 'nvidia_smi_log.gpu.temperature.memory_temp._text'],
        gpu_temp_max_threshold: ['int', 'nvidia_smi_log.gpu.temperature.gpu_temp_max_threshold._text'],
        power_draw: ['int', 'nvidia_smi_log.gpu.power_readings.power_draw._text'],
        power_limit: ['int', 'nvidia_smi_log.gpu.power_readings.power_limit._text'],
        max_power_limit: ['int', 'nvidia_smi_log.gpu.power_readings.max_power_limit._text'],
        dispaly: ['bool', 'nvidia_smi_log.gpu.display_mode._text'],
        dispaly_active: ['bool', 'nvidia_smi_log.gpu.display_active._text'],
        //clocks:{
        graphics_clock: ['int', 'nvidia_smi_log.gpu.clocks.graphics_clock._text'],
        mem_clock: ['int', 'nvidia_smi_log.gpu.clocks.mem_clock._text'],
        video_clock: ['int', 'nvidia_smi_log.gpu.clocks.video_clock._text'],
        max_graphics_clock: ['int', 'nvidia_smi_log.gpu.max_clocks.graphics_clock._text'],
        max_mem_clock: ['int', 'nvidia_smi_log.gpu.max_clocks.mem_clock._text'],
        max_video_clock: ['int', 'nvidia_smi_log.gpu.max_clocks.video_clock._text'],
        //},
    },
};

export default (data) => {
    if (data) {
        return packModel(model, data);
    } else log.error('Data for model packing wrong or empty: ' + json);
}
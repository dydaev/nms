import cmd from 'node-cmd';
import convert from 'xml-js';
import localStor from '../libs/localStore';

var log = require('../libs/log')(process.mainModule.filename);// eslint-disable-line

export default {
	updateInfo: (device) => {
		cmd.get(
			'nvidia-smi -q -x',//commands.get(info, device),
			(err, data) => {
				if (!err) {
					const json = JSON.parse(convert.xml2json(data, { compact: true, spaces: 2 }));
					let devices = {
						lastUpdates: json.nvidia_smi_log.timestamp._text,
						driverVersion: json.nvidia_smi_log.driver_version._text,
						countGPU: Number.parseInt(json.nvidia_smi_log.attached_gpus._text),
						gpu: {},
						telemetry: {
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
						},
					};
					json.nvidia_smi_log.gpu.forEach(value => {
						devices.gpu[value.uuid._text] = {
							id: value._attributes.id,
							uuid: value.uuid._text,
							brand: value.product_brand._text,
							name: value.product_name._text,
							vbios_version: value.vbios_version._text,
							processes: typeof value.processes.process_info !== 'undefined'
								? value.processes.process_info.process_name._text : '',
							gpu_util: Number.parseInt(value.utilization.gpu_util._text),
							memory_util: Number.parseInt(value.utilization.memory_util._text),
							fan_speed: Number.parseInt(value.fan_speed._text),
							temperature: Number.parseInt(value.temperature.gpu_temp._text),
							memory_temp: Number.parseInt(value.temperature.memory_temp._text),
							gpu_temp_max_threshold: Number.parseInt(value.temperature.gpu_temp_max_threshold._text),
							power_draw: Number.parseInt(value.power_readings.power_draw._text),
							power_limit: Number.parseInt(value.power_readings.power_limit._text),
							max_power_limit: Number.parseInt(value.power_readings.max_power_limit._text),
							dispaly: value.display_mode._text === 'Enabled' ? true : false,
							clocks: {
								graphics_clock: Number.parseInt(value.clocks.graphics_clock._text),
								mem_clock: Number.parseInt(value.clocks.mem_clock._text),
								video_clock: Number.parseInt(value.clocks.video_clock._text),

								max_graphics_clock: Number.parseInt(value.max_clocks.graphics_clock._text),
								max_mem_clock: Number.parseInt(value.max_clocks.mem_clock._text),
								max_video_clock: Number.parseInt(value.max_clocks.video_clock._text),
							},
						}
					});
					localStor.set('nvidia-devices', devices);
				} else {
					log.error('Can`t open opening cards: ' + err)
				}
		    }
		);
	},
}

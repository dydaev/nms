
(() => console.log("Hello NMS started"))()

import cmd from 'node-cmd';
import convert from 'xml-js';
import http from 'http';
import express from 'express';

var app = express();

var serverTimer = 0;
const ewbfApiUrl = 'http://192.168.1.222:42000/getstat';
const runMiner = 'sh /home/dydaev/worker-ewbf.sh';

var cardsInfo = {};
var mainerInfo = {};
var errors = '';

app.get('/', function (req, res) {
 	res.send('Server started at ' + ~~(serverTimer/60) + ':' + (serverTimer % 60));
});

app.get('/main/rest', (req, res) => {
	cmd.get(
        'pidof miner',
        function(err, data, stderr){
            //console.log('kill proc ',data)
            cmd.run('kill ' + data);
            setTimeout(() => {
            	cmd.run(runMiner);
            },2000)
        }
    );
})

app.get('/cards', function (req, res) {
	let result = '';
	let totalPower = 0;
	let totalHashrate = 0;

	if (cardsInfo.telemetry !== undefined) {
		
		Object.keys(cardsInfo.gpu).forEach(key => {
			result += 'Card: ' + cardsInfo.gpu[key].name + '<br>\r\n';
			//const dataStartMainProc = mainerInfo.result.find(minCardObj => cardsInfo.gpu[key].id.substr(-12) === minCardObj.busid.substr(-12)).start_time
			//result += '-Started: ' + new Date(dataStartMainProc) + '<br>\r\n';
			//const cardSpeed = mainerInfo.result.find(minCardObj => cardsInfo.gpu[key].id.substr(-12) === minCardObj.busid.substr(-12)).speed_sps;
			//totalHashrate += cardSpeed;
			//result += '-Speed: ' + cardSpeed + 'Sol/sec<br>\r\n';
			//result += '-Shares: ' + mainerInfo.result.find(minCardObj => cardsInfo.gpu[key].id.substr(-12) === minCardObj.busid.substr(-12)).accepted_shares + '<br>\r\n';

			result += '-Temperature: ' + cardsInfo.gpu[key].temperature + 'C<br>\r\n';
			result += '-Fan: ' + cardsInfo.gpu[key].fan_speed + '%<br>\r\n';
			result += '-Current power: <span style="color:' + ((cardsInfo.gpu[key].power_draw > cardsInfo.gpu[key].power_limit / 2) ? "balck;" : "red; font-weight: bold;") + ' font-size: 1.5em;">' + cardsInfo.gpu[key].power_draw + 'W</span>(' + cardsInfo.gpu[key].power_limit + 'W)<br>\r\n';
			result += '------------------------<br>\r\n';
			totalPower += cardsInfo.gpu[key].power_draw;
		})
	}
	const monthPower = totalPower * 24 * 31.5;

	result += 'Total speed: ' + (totalHashrate > 1000 ? ((~~totalHashrate / 1000) + 'kSol/sec') : (totalHashrate + 'Sol/sec')) + ')<br>\r\n';
	result += 'Total power: ' + totalPower + 'W(month: ' + (monthPower > 1000 ? ((~~monthPower / 1000) + 'kW') : (monthPower + 'W')) + ')<br>\r\n';
	result += '<span style=" color: red;">' + errors + '</span>';
	res.send(result);
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});

setInterval((str) => {
	serverTimer++;

	if ((serverTimer % 10) === 0) {// every 10sec
		/*try {
			http.get(ewbfApiUrl, function (response) {
				var buffer = "", 
				    data;

				response.on("data", function (chunk) {
				    buffer += chunk;
				}); 

				response.on("end", function (err) {
				    data = JSON.parse(buffer);
				    mainerInfo = data;
				}); 
			});
		} catch(e) {
			errors += 'e'
		}*/

		cmd.get(
		    'nvidia-smi -q -x',
		    (err, data, stderr) => {
				const json = JSON.parse(convert.xml2json(data, {compact: true, spaces: 2}));

				let devices = {
					lastUpdates : json.nvidia_smi_log.timestamp._text,
					driverVersion : json.nvidia_smi_log.driver_version._text,
					countGPU : Number.parseInt(json.nvidia_smi_log.attached_gpus._text),
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
						processes: value.processes.process_info.process_name ? value.processes.process_info.process_name._text : '',
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
				cardsInfo = devices;
				//console.log(devices)
		        //console.log(json.nvidia_smi_log.gpu)//.nvidia_smi_log)
		    }
		);
	}
}, 1000)

//TODO check configuration grafical system
//TODO check driver instaled, version, updates


 
//cmd.run('touch example.created.file');
 

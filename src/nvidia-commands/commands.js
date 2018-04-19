export const command = {
	get: {
		power: 'nvidia-smi -q -d power',
		info: 'nvidia-smi -q -x',
		list: 'nvidia-smi -L',
	},
	set: {
		power: 'nvidia-smi -pl'
	},
};

export const get = (command, params = '', device = undefined) =>
	device ? `${command.get[command]} ${params} -i ${device}` : `${command.get[command]} ${params}`;
	
export const set = (command, params, device = undefined) =>
    device ? `${command.set[command]} ${params} -i ${device}` : `${command.set[command]} ${params}`;
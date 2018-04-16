export const command = {
	get: {
		power: 'nvidia-smi -q -d power',
		info: 'nvidia-smi -q -x',
		list: 'nvidia-smi -L',
	},
};

export const get = (command, device = undefined) =>
    device ? `${command.get[command]} -i ${device}` : command.get[command];
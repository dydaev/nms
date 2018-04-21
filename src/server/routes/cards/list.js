import localStor from '../../../libs/localStore';

export const GET = (req, res) => {
    const cardsInfo = localStor.get('nvidia-devices');
    if (cardsInfo && Number.isInteger(cardsInfo.countGPU)) {
        if (cardsInfo.countGPU > 0 && cardsInfo.gpu) {
            const list = Object.keys(cardsInfo.gpu).map(key => {
                return {
                    uuid: cardsInfo.gpu[key].uuid,
                    cudaId: cardsInfo.gpu[key].id,
                    name: cardsInfo.gpu[key].name,
            }});
            res.send(list);
        } else res.status(500).send('no initial cards')
    } else res.status(500).send('no initial cards')
};
/*
{
    "lastUpdates": "Sat Apr 21 10:25:27 2018",
    "driverVersion": "390.48",
    "countGPU": 2, 
    "gpu": { 
        "GPU-72fe5f90-49b6-7c3a-af77-08964ef4c7e6": { 
            "id": "00000000:01:00.0", 
            "uuid": "GPU-72fe5f90-49b6-7c3a-af77-08964ef4c7e6", 
            "brand": "GeForce", 
            "name": "GeForce GTX 1070 Ti", 
            "vbios_version": "86.04.85.00.63", 
            "processes": "/home/dydaev/ewbf-0.3.4b/miner", 
            "gpu_util": 99, 
            "memory_util": 89, 
            "fan_speed": 39, 
            "temperature": 64, 
            "memory_temp": null, 
            "gpu_temp_max_threshold": 99, 
            "power_draw": 129, 
            "power_limit": 130, 
            "max_power_limit": 217, 
            "dispaly": false, 
            "clocks": { "graphics_clock": 1784, "mem_clock": 4404, "video_clock": 1594, "max_graphics_clock": 1923, "max_mem_clock": 4004, "max_video_clock": 1708 }
        }, 
        "GPU-2d1cbe78-7e78-65a5-672a-65fff5f4060c":  { 
            "id": "00000000:02:00.0", 
            "uuid": "GPU-2d1cbe78-7e78-65a5-672a-65fff5f4060c", 
            "brand": "GeForce", 
            "name": "GeForce GTX 1080 Ti", 
            "vbios_version": "86.02.39.00.9E", 
            "processes": "/home/dydaev/ewbf-0.3.4b/miner", 
            "gpu_util": 100, 
            "memory_util": 71, "fan_speed": 49, "temperature": 66, "memory_temp": null, "gpu_temp_max_threshold": 96, "power_draw": 238, "power_limit": 240, "max_power_limit": 375, "dispaly": false, "clocks": { "graphics_clock": 1835, "mem_clock": 5616, "video_clock": 1556, "max_graphics_clock": 2037, "max_mem_clock": 5616, "max_video_clock": 1620 } } }, "telemetry": { "gpu_util": "%", "memory_util": "%", "fan_speed": "%", "temperature": "C", "memory_temp": "C", "gpu_temp_max_threshold": "C", "power_draw": "W", "power_limit": "W", "max_power_limit": "W", "graphics_clock": "MHz", "mem_clock": "MHz", "video_clock": "MHz", "max_graphics_clock": "MHz", "max_mem_clock": "MHz", "max_video_clock": "MHz" } }*/
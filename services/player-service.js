import { API } from "./music-api-service.js";

export const SERVICE_NAMES_MAP = {
    "SoundCloud": "SoundCloudService"
}

export class PlayerService{
    constructor(serviceName) {
        if (!serviceName || !SERVICE_NAMES_MAP[serviceName]) {
            return console.warn("Unknown Sound Service");
        }
        this.getTracks      = API[SERVICE_NAMES_MAP[serviceName]].getTracks;
        this.getTrack       = API[SERVICE_NAMES_MAP[serviceName]].getTrack;
    }
}

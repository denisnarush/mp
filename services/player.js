import { SoundCloudService } from "./soundcloud.js";

export class PlayerService{
    constructor(serviceName) {
        // TODO: import service by name
        this.getTracks      = SoundCloudService.getTracks;
        this.getTrack       = SoundCloudService.getTrack;
    }
}

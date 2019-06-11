import { SoundCloudService } from "./soundcloud.js";

export class PlayerService{
    constructor() {
        this.getTracks      = SoundCloudService.getTracks;
        this.getTrack       = SoundCloudService.getTrack;
    }
}

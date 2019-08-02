import { MusicServices } from "./music-api.service.js";

export enum PlayerServiceEmum {
    SoundCloud = "SoundCloudService"
}

export class PlayerService extends MusicServices{
    constructor(serviceName: PlayerServiceEmum = PlayerServiceEmum.SoundCloud) {
        super(serviceName);
    }
}


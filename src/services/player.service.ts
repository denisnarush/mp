import { MusicServices } from "./music-api.service.js";

export enum PlayerServiceEmum {
    SoundCloud = "SoundCloudService"
}

export class PlayerService extends MusicServices {
    constructor(serviceName: PlayerServiceEmum = PlayerServiceEmum.SoundCloud) {
        super(serviceName);
    }

    preloadTracks(options: {limit: number, offset: number, duration: {from: number, to: number}}) {
        const { limit, offset, duration } = options;
        return this.getTracks( { limit, offset, duration } );
    }
}


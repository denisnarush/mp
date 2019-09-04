import { PlayerServiceEmum } from "./player.service.js";
import { SoundCloudService } from "./soundcloud.service.js";

// FIXME: MusicServiceInterface
interface MusicServiceInterface {
    getTracks: any;
    getTrack: any
}

export class MusicServices {
    public getTracks: Function;

    constructor(service: PlayerServiceEmum) {
        let _service: MusicServiceInterface;

        switch (service) {
            case PlayerServiceEmum.SoundCloud:
                _service = SoundCloudService
        }

        Object.assign(this, _service);
    }
}
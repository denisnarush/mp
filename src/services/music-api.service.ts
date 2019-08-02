import { PlayerServiceEmum } from "./player.service";
import { SoundCloudService } from "./soundcloud.service";

// FIXME: MusicServiceInterface
interface MusicServiceInterface {
    getTracks: any;
    getTrack: any
}

export class MusicServices {
    constructor(service: PlayerServiceEmum) {
        let _service: MusicServiceInterface;

        switch (service) {
            case PlayerServiceEmum.SoundCloud:
                _service = SoundCloudService
        }

        Object.assign(this, _service);
    }
}
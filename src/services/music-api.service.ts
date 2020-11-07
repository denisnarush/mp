import { PlayerServiceEmum } from "./player.service.js";
import { SoundCloudService } from "./soundcloud.service.js";
import { TrackInterface } from "../modules/player.js";

export interface MusicServicesGetTracksOptionsInterface {
  limit?: number;
  offset?: number;
  duration?: {
    from: number;
    to: number;
  };
}
export interface MusicServiceInterface {
  getTracks(
    options?: MusicServicesGetTracksOptionsInterface
  ): Promise<TrackInterface[]>;
}

export class MusicServices {
  private service: MusicServiceInterface;

  constructor(service: PlayerServiceEmum) {
    let _service: MusicServiceInterface;

    switch (service) {
      case PlayerServiceEmum.SoundCloud:
        _service = SoundCloudService;
    }

    this.service = _service;
  }

  protected getTracks(
    options?: MusicServicesGetTracksOptionsInterface
  ): Promise<TrackInterface[]> {
    return this.service.getTracks.call(this, options);
  }
}

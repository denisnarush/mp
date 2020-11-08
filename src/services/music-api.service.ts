import { TrackInterface } from "../modules/player/player.js";

import { PlayerServiceEmum } from "./player.service.js";
import { SoundCloudService } from "./soundcloud.service.js";

export interface MusicServicesGetTracksOptionsInterface {
  duration?: {
    from: number;
    to: number;
  };
  limit?: number;
  offset?: number;
}
export interface MusicServiceInterface {
  getTracks(
    options?: MusicServicesGetTracksOptionsInterface
  ): Promise<TrackInterface[]>;
}

export class MusicServices {
  public constructor(service: PlayerServiceEmum) {
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
  private service: MusicServiceInterface;
}

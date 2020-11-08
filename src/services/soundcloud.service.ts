import { SoundCloudEnv } from "../environments/environment.js";
import { TrackInterface as ITrack } from "../modules/player/player.js";
import { toURLencoded } from "../modules/utils/utils.js";

import {
  MusicServiceInterface,
  MusicServicesGetTracksOptionsInterface,
} from "./music-api.service.js";

interface IApiUser {
  avatar_url: string;
  username: string;
}

interface IApiTracks {
  artwork_url: string;
  duration: number;
  genre: string;
  id: number;
  stream_url: string;
  title: string;
  user: IApiUser;
}

interface IApiTracksSettings {
  client_id: string;
  durations?: {
    from: number;
    to: number;
  };
  limit?: number;
  offset?: number;
}

function getTracks(options: MusicServicesGetTracksOptionsInterface) {
  const settings: IApiTracksSettings = {
    client_id: SoundCloudEnv.client_id,
  };

  const {
    offset = settings.offset,
    limit = settings.limit,
    duration = settings.durations,
  } = options;
  settings.offset = offset;
  settings.limit = limit;
  settings.durations = duration;

  const params = `?${toURLencoded(settings)}`;

  return (
    fetch(`${SoundCloudEnv.url}/tracks${params}`, {
      method: `GET`,
    })
      .then((response) => response.json())
      // Mapping
      .then(
        (data) =>
          data.map((response: IApiTracks) => {
            const track: ITrack = {
              id: response.id,
              genre: response.genre,
              author: response.user.username,
              title: response.title,
              duration: response.duration,
              cover: response.artwork_url
                ? response.artwork_url.replace("large", "t500x500")
                : response.user.avatar_url,
              src: `${response.stream_url}?client_id=${SoundCloudEnv.client_id}`,
            };

            return track;
          }) as ITrack[]
      )
  );
}

export const SoundCloudService: MusicServiceInterface = {
  getTracks,
};

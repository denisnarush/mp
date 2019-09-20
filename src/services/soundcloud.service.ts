import { SoundCloudEnv } from "../envs/common.js";
import { toURLencoded } from "../modules/utils.js";
import { MusicServiceInterface, MusicServicesGetTracksOptionsInterface } from "./music-api.service.js";
import { TrackInterface } from "../modules/player.js";

interface API_USER_INTERFACE {
    avatar_url: string;
    username: string;
}

interface API_TRACKS_INTERFACE {
    id: number;
    genre: string;
    title: string;
    artwork_url: string;
    stream_url: string;
    duration: number;
    user: API_USER_INTERFACE;
}

interface API_TRACKS_SETTINGS_INTERFACE {
    client_id: string;
    limit?: number;
    offset?: number;
    durations?: {
        from: number;
        to: number;
    }
}

function getTracks(options: MusicServicesGetTracksOptionsInterface) {
    const settings: API_TRACKS_SETTINGS_INTERFACE = {
        'client_id': SoundCloudEnv.client_id,
    }

    options.offset      ? settings.offset       = options.offset    : settings;
    options.limit       ? settings.limit        = options.limit     : settings;
    options.duration    ? settings.durations    = options.duration  : settings;

    const params = `?${toURLencoded(settings)}`;

    return fetch(`${SoundCloudEnv.url}/tracks${params}`, {
            method: `GET`
        })
        .then(response => response.json())
        // mapping
        .then(data => <TrackInterface[]>data.map(
            (track: API_TRACKS_INTERFACE) => {
                const data: TrackInterface = {
                    id: track.id,
                    genre: track.genre,
                    author: track.user.username,
                    title: track.title,
                    duration: track.duration,
                    cover: track.artwork_url ? track.artwork_url.replace("large","t500x500") : track.user.avatar_url,
                    src: `${track.stream_url}?client_id=${SoundCloudEnv.client_id}`
                }
                return data;
            })
        );
}

export const SoundCloudService: MusicServiceInterface = {
    getTracks
}

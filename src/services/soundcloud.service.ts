import { SoundCloudEnv } from "../envs/common.js";
import { toURLencoded } from "../modules/utils.js";

interface USER_INTERFACE {
    avatar_url: string;
}

interface TRACK_INTERFACE {
    genre: string;
    title: string;
    artwork_url: string;
    stream_url: string;
    duration: number;
    user: USER_INTERFACE;
}

// TODO: interace for getTracks params
function getTracks(options: any) {
    const params = `?${toURLencoded({
        'client_id': SoundCloudEnv.client_id,
        ...options
    })}`;

    return fetch(`${SoundCloudEnv.url}/tracks${params}`, {
            method: `GET`
        })
        .then(response => response.json())

        .then(data => data.map(
            (track: TRACK_INTERFACE) => ({
                genre: track.genre,
                title: track.title,
                duration: track.duration,
                cover: track.artwork_url ? track.artwork_url.replace("large","t500x500") : track.user.avatar_url,
                src: `${track.stream_url}?client_id=${SoundCloudEnv.client_id}`
            }))
        );
}
// TODO: SoundCloudService getTrack
function getTrack() {
    return fetch(`/`).then(response => response.json());
}

export const SoundCloudService = {
    getTracks, getTrack
}
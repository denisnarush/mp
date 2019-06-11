/**
  * SoundCloud Service
  *
  * @author Denis Narush <child.denis@gmail.com>
 */
import { Request } from "./../modules/utils.js";
import { SoundCloudEnv } from "./../envs/soundcloud.js"
/**
 * 
 * @param {string} username Username
 * @param {string} password Password
 */
export function token(username, password) {
    return Request(
        {
            method: "POST",
            url: `${SoundCloudEnv.url}/oauth2/token`,
            options: {
                'client_id': SoundCloudEnv.client_id,
                'client_secret': '<secret>',
                'grant_type': 'password',
                'username': username,
                'password': password
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
    );
}
/**
 * 
 * @param {string} token Access token
 */
export function me(token) {
    return Request(
        {
            method: "GET",
            url: `${SoundCloudEnv.url}/me`,
            options: {
                'oauth_token': token
            }
        }
    );
}
/**
 * 
 * @param {} params
 */
export function getTracks(params) {
    return Request(
        {
            method: "GET",
            url: `${SoundCloudEnv.url}/tracks`,
            options: {
                'client_id': SoundCloudEnv.client_id,
                ...params
            }
        }
    ).then(
        data => data.map(
            track => {
                    track.cover     = track.artwork_url ? track.artwork_url.replace("large","t500x500") : track.user.avatar_url;
                    track.src       = `${track.stream_url}?client_id=${SoundCloudEnv.client_id}`;
                    return track;
                }
            )
    );
}
/**
 *
 * @param {number} id Track ID
 */
export function getTrack(id) {
    return Request(
        {
            method: "GET",
            url: `${SoundCloudEnv.url}/tracks/${id}`,
            options: {
                'client_id': SoundCloudEnv.client_id
            }
        }
    ).then(
        data => data.map(track => track.src = `${track.stream_url}?client_id=${SoundCloudEnv.client_id}`)
    );
}
/**
 * 
 */
export const SoundCloudService = {
    token: token,
    me: me,
    getTracks: getTracks,
    getTrack: getTrack
}

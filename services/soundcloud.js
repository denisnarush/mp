import { request } from "./../modules/utils.js";
import { SoundCloudEnv } from "./../envs/soundcloud.js"
/**
 * 
 * @param {string} username Username
 * @param {string} password Password
 */
export function token (username, password) {
    return request(
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
            headers: [
                ["Content-Type", "application/x-www-form-urlencoded"]
            ]
        }
    );
}
/**
 * 
 * @param {string} token Access token
 */
export function me (token) {
    return request(
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
 */
export function tracks (params) {
    return request(
        {
            method: "GET",
            url: `${SoundCloudEnv.url}/tracks`,
            options: {
                'client_id': SoundCloudEnv.client_id
            }
        }
    );
}
/**
 * 
 */
export const SoundCloudService = {
    token: token,
    me: me,
    tracks: tracks
}

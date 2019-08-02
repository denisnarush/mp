// TODO: SoundCloudService getTracks
function getTracks() {
    return fetch(`/`).then(response => response.json());
}
// TODO: SoundCloudService getTrack
function getTrack() {
    return fetch(`/`).then(response => response.json());
}

export const SoundCloudService = {
    getTracks, getTrack
}
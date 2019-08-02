// TODO: SoundCloudService getTracks
function getTracks() {
    console.log(`SoundCloudService getTracks`);
    return fetch(`/`).then(response => response.json());
}
// TODO: SoundCloudService getTrack
function getTrack() {
    console.log(`SoundCloudService getTrack`);
    return fetch(`/`).then(response => response.json());
}

export const SoundCloudService = {
    getTracks, getTrack
}
export const PLAYER_SETTINGS_STORAGE_KEY = "player-settings";

export const DEFAULT_PLAYER_SETTINGS = {
    genres: [`Electro Swing`, `Chillout`, `Chill`, `Deep House`, `Minimal`],
    volume: 1.0,
    limit: 200,
    recent: [],
    duration: {
        from: 90000,
        to: 600000
    },
    offset: 0
}
export const SoundCloudEnv = {
    "url"           : "https://api.soundcloud.com",
    "client_id"     : "7172aa9d8184ed052cf6148b4d6b8ae6"
}

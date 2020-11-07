export const PLAYER_SETTINGS_STORAGE_KEY = "mp-settings";
export const PLAYER_SETTINGS_RECENT_LIMIT = 25;

export const DEFAULT_PLAYER_SETTINGS = {
  genres: [
    `electro swing`,
    `chillout`,
    `chill`,
    `deep house`,
    `house`,
    `minimal`,
  ],
  volume: 1.0,
  limit: 200,
  recent: [],
  duration: {
    from: 90000,
    to: 600000,
  },
  offset: 0,
};
export const SoundCloudEnv = {
  url: "https://api.soundcloud.com",
  client_id: "7172aa9d8184ed052cf6148b4d6b8ae6",
};

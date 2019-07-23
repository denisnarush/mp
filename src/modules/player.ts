export interface PlayerSettingsInterface {
    genres?: string[];
    volume?: number;
    limit?: number;
    duration: {
        from: number;
        to: number
    },
    offset: number;
}

const PLAYER_SETTINGS_KEY = "player-settings";
export class Player {
    constructor(
        options: {
            service: string
        }) {
    }

    public get settings(): PlayerSettingsInterface {
        try {
            return JSON.parse(localStorage.getItem(PLAYER_SETTINGS_KEY));
        } catch (error) {
            console.warn(error);
        }
    }

    public set settings(params: PlayerSettingsInterface) {
        let settings = {
            ...this.settings,
            ...params
        }
        try {
            localStorage.setItem(PLAYER_SETTINGS_KEY, JSON.stringify(settings));
        } catch (error) {
            console.warn(error);
        }
    }
}
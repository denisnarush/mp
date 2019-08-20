import { ElementsInterface } from "./state.js";
import { PlayerServiceEmum, PlayerService } from "../services/player.service.js";

export interface PlayerSettingsInterface {
    genres?: string[];
    volume?: number;
    limit?: number;
    offset?: number;
    duration?: {
        from: number;
        to: number
    };
}

export interface PlayerOptionsInterface {
    service: PlayerServiceEmum;
}

const PLAYER_SETTINGS_KEY = "player-settings";
export class Player {
    private elements: ElementsInterface = {};

    private service: PlayerService;

    constructor(options: PlayerOptionsInterface = {service: PlayerServiceEmum.SoundCloud}) {

        // selected service
        this.service = new PlayerService(PlayerServiceEmum.SoundCloud);
        // player main container element
        const container = document.createElement("audio");
        // setting container element params
        container.setAttribute("preload", "auto");
        // volume change
        container.addEventListener("volumechange", () => {
            this.settings = {
                volume: this.volume
            }
        })
        // appending to body
        document.body.appendChild(container);
        // appending to elements
        this.elements["container"] = container;
    }

    // TODO: Player finish preloadRandomTracks()
    public preloadRandomTracks() {
        const { limit, offset, duration } = this.settings;
        return this.service.getTracks( { limit, offset, duration } );
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

    public get volume(): number {
        return (this.elements["container"] as HTMLAudioElement).volume;
    }

    public set volume(value) {
        if (value >= 1) {
            value = 1;
        } else if (value <= 0) {
            value = 0;
        }

        (this.elements["container"] as HTMLAudioElement).volume = Number(value.toFixed(2));
    }
}
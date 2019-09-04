import { ElementsInterface } from "./state.js";
import { PlayerServiceEmum, PlayerService } from "../services/player.service.js";
import { PLAYER_SETTINGS_STORAGE_KEY } from "../envs/common.js";

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

export interface TrackInterface {
    id: number;
    cover: string;
    genre: string;
    duration: number;
    title: string;
    src: string;
}

export interface PlayerOptionsInterface {
    service: PlayerServiceEmum;
}


export class Player {
    private elements: ElementsInterface = {};
    // selected service
    private service: PlayerService;
    // current track
    public track: TrackInterface;
    // preloaded tracks
    public tracks: TrackInterface[] = [];

    constructor(options: PlayerOptionsInterface = {service: PlayerServiceEmum.SoundCloud}) {

        const { service } = options;

        // selected service
        this.service = new PlayerService(service);
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

    public preloadRandomTracks() {
        return this.service.preloadTracks({
            limit: this.settings.limit,
            offset: this.settings.offset,
            duration: this.settings.duration
        });
    }

    public get settings(): PlayerSettingsInterface {
        try {
            return JSON.parse(localStorage.getItem(PLAYER_SETTINGS_STORAGE_KEY));
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
            localStorage.setItem(PLAYER_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
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
    /**
     * Stop
     */
    public stop() {
        setTimeout(() => {(this.elements["container"] as HTMLAudioElement).pause();}, 0);
    }
    /**
     * Start
     */
    public start(idx = 0) {
        if (this.tracks.length === 0) {
            console.warn("Tracks list is epmty");
            // skip
            return this;
        }
        //set current by index
        this.track = Object.assign({}, this.tracks[idx]);
        // detecting if current track the same as new
        if ((this.elements["container"] as HTMLAudioElement).src === this.tracks[idx].src) {
            console.warn("You are trying to start an already playing track");
            // skip
            return this;
        }
        // important pause!
        this.stop();
        // setting source
        (this.elements["container"] as HTMLAudioElement).src = this.tracks[idx].src;
    }
    /**
     * OnMetadataLoaded
     */
    public onMetadataLoaded(fn) {
        this.elements["container"].addEventListener("loadedmetadata", fn);
    }
    /**
     * Play
     */
    public play() {
        // is tracks not prealoded
        if (this.tracks.length === 0) {
            // skip
            return this;
        }
        // is track playing ?
        if (!this.isPaused()) {
            // skip
            return this;
        }
        // is no current track
        if (this.track === void 0) {
            // skip
            return this;
        }
        // resume or start playing
        const promise = (this.elements["container"] as HTMLAudioElement).play();
        // iOS 11 play() is a promise.
        if (promise !== undefined) {
            promise.catch(() => {});
        }
    }
    /**
     * Is current Track playing paused
     */
    private isPaused(): boolean {
        return (this.elements["container"] as HTMLAudioElement).paused;
    }
}
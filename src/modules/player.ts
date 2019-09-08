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
    recent?: TrackInterface[];
}

export interface TrackInterface {
    id: number;
    cover: string;
    genre: string;
    duration: number;
    author: string;
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
        const container = document.createElement(`audio`);
        // setting container element params
        container.setAttribute(`preload`, `auto`);
        // volume change
        container.addEventListener(`volumechange`, () => {
            this.settings = {
                volume: this.volume
            }
        })
        container.addEventListener(`loadstart`, () => {
            this.settings = {
                recent: this.settings.recent.concat([this.track])
            }
        })
        // appending to body
        document.body.appendChild(container);
        // appending to elements
        this.elements[`container`] = container;
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
        return (this.elements[`container`] as HTMLAudioElement).volume;
    }

    public set volume(value) {
        if (value >= 1) {
            value = 1;
        } else if (value <= 0) {
            value = 0;
        }

        (this.elements[`container`] as HTMLAudioElement).volume = Number(value.toFixed(2));
    }
    /**
     * 
     */
    public get currentTime() {
        return (this.elements[`container`] as HTMLAudioElement).currentTime;
    }
    /**
     * 
     */
    public set currentTime(value) {
        (this.elements[`container`] as HTMLAudioElement).currentTime = value;
    }
    /**
     * Returns true if audio element is HAVE_ENOUGH_DATA
     */
    public get isReady() {
        // 4 HAVE_ENOUGH_DATA Enough data is available—and the download rate
        // is high enough—that the media can be played through to the end without interruption.
        return (this.elements[`container`] as HTMLAudioElement).readyState === 4;
    }
    /**
     * Get Track Id
     */
    public getTrackId() {
        return this.track ? this.track.id : void 0;
    }
    /**
     * Get Track cover
     */
    public getCover() {
        return this.track.cover;
    }
    /**
     * Get Track title
     */
    public getTrackTitle() {
        return this.track.title;
    }
    /**
     * Get Track genre
     */
    public getTrackGenre() {
        return this.track.genre;
    }
    /**
     * Get Track duration
     */
    public getTrackDuration() {
        return this.track.duration;
    }
    /**
     * Get Track duration string representation
     */
    public getTrackDurationString() {
        const time = new Date(this.getTrackDuration());
        return `${(time.getUTCHours() ? time.toUTCString().slice(17, 25) : time.toUTCString().slice(20, 25))}`;
    }
    /**
     * Get Track time string representation
     */
    public getCurrentTimeString() {
        const time = new Date(this.currentTime * 1000);
        return `${(time.getUTCHours() ? time.toUTCString().slice(17, 25) : time.toUTCString().slice(20, 25))}`;
    }
    /**
     * Get Track time percent representation
     */
    public getCurrentTimePercent() {
        return `${this.getTrackDuration() ? this.currentTime * 100000 / this.getTrackDuration() : 0}%`;
    }
    /**
     *
     */
    public getDuration() {
        return (this.elements[`container`] as HTMLAudioElement).duration;
    }
    /**
     * 
     */
    public togglePlaying() {
        this.isPaused() ? this.play() : this.stop();
    }
    /**
     * Stop
     */
    public stop() {
        setTimeout(() => {(this.elements[`container`] as HTMLAudioElement).pause();}, 0);
    }
    /**
     * Start
     */
    public start(idx = 0) {
        if (this.tracks.length === 0) {
            console.warn(`Tracks list is epmty`);
            // skip
            return this;
        }
        //set current by index
        this.track = Object.assign({}, this.tracks[idx]);
        // detecting if current track the same as new
        if ((this.elements[`container`] as HTMLAudioElement).src === this.tracks[idx].src) {
            console.warn(`You are trying to start an already playing track`);
            // skip
            return this;
        }
        // important pause!
        this.stop();
        // setting source
        (this.elements[`container`] as HTMLAudioElement).src = this.tracks[idx].src;
    }
    /**
     * OnLoadStart
     */
    public onLoadStart(fn : () => void) {
        this.elements[`container`]  .addEventListener(`loadstart`, fn);
    }
    /**
     * OnMetadataLoaded
     */
    public onMetadataLoaded(fn : () => void) {
        this.elements[`container`]  .addEventListener(`loadedmetadata`, fn);
    }
    /**
     * OnPlay
     */
    public onPlay(fn : () => void) {
        this.elements[`container`]  .addEventListener(`play`, fn);
    }
    /**
     * OnPause
     */
    public onPause(fn : () => void) {
        this.elements[`container`]  .addEventListener(`pause`, fn);
    }
    /**
     * OnEnded
     */
    public onEnded(fn : () => void) {
        this.elements[`container`]  .addEventListener(`ended`, fn);
    }
    /**
     * OnTimeUpdate
     */
    public onTimeUpdate(fn : () => void) {
        this.elements[`container`]  .addEventListener(`timeupdate`, fn);
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
        const promise = (this.elements[`container`] as HTMLAudioElement).play();
        // iOS 11 play() is a promise.
        if (promise !== undefined) {
            promise.catch(() => {});
        }
    }
    /**
     * Is current Track playing paused
     */
    private isPaused(): boolean {
        return (this.elements[`container`] as HTMLAudioElement).paused;
    }
}
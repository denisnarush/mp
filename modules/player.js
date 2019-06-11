import { Settings } from "./settings.js";
import { PlayerService } from "../services/player.js";


export class Player {
    constructor() {
        this.elements = {};
        // preloaded tracks
        this.tracks = [];
        // selected service
        this.service = new PlayerService();
        // player main container element
        const container = document.createElement("audio");
        // setting container element params
        container.setAttribute("preload", "auto");
        container.volume = Settings.volume;
        // volume change
        container.addEventListener("volumechange", () => {
            this.onVolumeChange();
        });
        // appending to body
        document.body.appendChild(container);
        // appending to elements
        this.elements["container"] = container;
    }
    /**
     * Start
     */
    start(idx = 0) {
        // important pause!
        this.stop();
        if (this.tracks.length === 0) {
            // skip
            return this;
        }
        // current is empty
        if (!this.track) {
            //set current by index
            this.track = this.tracks[idx];
        }
        // detecting if current track the same as new
        if (this.elements["container"].src === this.track.src) {
            // skip
            return this;
        }
        // setting source
        this.elements["container"].src = this.track.src;
    }
    /**
     * Stop
     */
    stop() {
        setTimeout(() => {this.elements["container"].pause();}, 0);
    }
    /**
     * Play
     */
    play() {
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
        const promise = this.elements["container"].play();
        // iOS 11 play() is a promise.
        if (promise !== undefined) {
            promise.catch(() => {});
        }
    }
    /**
     * 
     */
    preloadRandomTracks() {
        return this.service.getTracks().then((tracks) => {
            this.tracks = tracks;
            return tracks;
        });
    }
    /**
     * Is current Track playing paused
     */
    isPaused() {
        return this.elements["container"].paused;
    }
    /**
     * Get Track Id
     */
    getTrackId() {
        return this.track ? this.track.id : void 0;
    }
    /**
     * Get Track cover
     */
    getCover() {
        return this.track.cover;
    }
    /**
     * Get Track title
     */
    getTrackTitle() {
        return this.track.title;
    }
    /**
     * Get Track genre
     */
    getTrackGenre() {
        return this.track.genre;
    }
    /**
     * Get Track duration
     * @returns {number} Track duration in ms
     */
    getTrackDuration() {
        return this.track.duration;
    }
    /**
     * Get Track duration string representation
     */
    getTrackDurationString() {
        const time = new Date(this.getTrackDuration());
        return `${(time.getUTCHours() ? time.toUTCString().slice(17, 25) : time.toUTCString().slice(20, 25))}`;
    }
    /**
     * Get Track time string representation
     */
    getCurrentTimeString() {
        const time = new Date(this.elements["container"].currentTime * 1000);
        return `${(time.getUTCHours() ? time.toUTCString().slice(17, 25) : time.toUTCString().slice(20, 25))}`;
    }
    /**
     * Get Track time percent representation
     */
    getCurrentTimePercent() {
        return `${this.getTrackDuration() ? this.elements["container"].currentTime * 100000 / this.getTrackDuration() : 0}%`;
    }
    /**
     * Volume changed
     */
    onVolumeChange() {
        Settings.volume = this.elements["container"].volume;
    }
    /**
     * OnProgress
     * @param {Function} fn 
     */
    onProgress(fn) {
        this.elements["container"].addEventListener("progress", fn);
    }
    /**
     * OnLoadStart
     * @param {Function} fn 
     */
    onLoadStart(fn) {
        this.elements["container"].addEventListener("loadstart", fn);
    }
    /**
     * OnMetadataLoaded
     * @param {Function} fn 
     */
    onMetadataLoaded(fn) {
        this.elements["container"].addEventListener("loadedmetadata", fn);
    }
    /**
     * OnPlay
     * @param {Function} fn 
     */
    onPlay(fn) {
        this.elements["container"].addEventListener("play", fn);
    }
    /**
     * OnPause
     * @param {Function} fn 
     */
    onPause(fn) {
        this.elements["container"].addEventListener("pause", fn);
    }
    /**
     * OnEnded
     * @param {Function} fn 
     */
    onEnded(fn) {
        this.elements["container"].addEventListener("ended", fn);
    }
    /**
     * OnTimeUpdate
     * @param {Function} fn 
     */
    onTimeUpdate(fn) {
        this.elements["container"].addEventListener("timeupdate", fn);
    }
}

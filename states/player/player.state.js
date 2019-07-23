import { State } from "/modules/state.js";
import { Settings } from "./../../modules/settings.js";
/**
  * Class representing a Player State
  * 
  * @author Denis Narush <child.denis@gmail.com>
  * @extends State
 */
export class PlayerState extends State {
    /**
     * Player state constructor
     */
    constructor(options) {
        super("player", options);
    }
    /**
     * Init
     */
    init() {
        /**
         * Player state elements handlers
         */
        this.elements["genre"]      .doOn("tap", PlayerState.onGenreTap.bind(this));
        this.elements["genre"]      .doOn("blur", PlayerState.onGenreBlur.bind(this));
        this.elements["genre"]      .doOn("keydown", PlayerState.onGenreKey.bind(this));
        this.elements["trackbar"]   .doOn("tap", PlayerState.onTrackbar.bind(this));
        this.elements["play"]       .doOn("tap", PlayerState.onPlayBtn.bind(this));
        this.elements["pause"]      .doOn("tap", PlayerState.onPauseBtn.bind(this));
        this.elements["next"]       .doOn("tap", PlayerState.onNextBtn.bind(this));
        this.elements["prev"]       .doOn("tap", PlayerState.onPrevBtn.bind(this));
        /**
         * Player state elements onetime handlers
         */
        this._onPlayBtnOnce_         = PlayerState.onPlayBtnOnce.bind(this);
        this.elements["play"]       .doOn("tap", this._onPlayBtnOnce_);
        /**
         * Player events handlers
         */
        this.player                 .onPlay(PlayerState.onPlay.bind(this));
        this.player                 .onPause(PlayerState.onPause.bind(this));
        this.player                 .onLoadStart(PlayerState.onLoadStart.bind(this));
        this.player                 .onTimeUpdate(PlayerState.onTimeUpdate.bind(this));
        this.player                 .onMetadataLoaded(PlayerState.onMetadataLoaded.bind(this));
        this.player                 .onEnded(PlayerState.onPlayEnded.bind(this));

        return this;
    }
    /**
     * Genre tap handler
     */
    static onGenreTap() {
        this.elements["genre"]      .setAttribute("contenteditable", true);
    }
    /**
     * Apply typed genre
     */
    static onGenreBlur() {
        this.elements["genre"]      .removeAttribute("contenteditable");
        if (this.player.settings.genres !== this.elements["genre"].innerHTML) {
            // TODO: Apply genres
        }
    }
    /**
     * Key handler
     * @param {KeyboardEvent} event
     */
    static onGenreKey(event) {
        // prevents track time navigation
        event.stopPropagation();
        // apply changes
        if (event.code === "Enter") {
            event.preventDefault();
            event.target.blur();
        }
    }
    /**
     * Trackbar handler
     * @param {TapEvent} event
     */
    static onTrackbar(event) {
        if (this.elements["trackbar"] !== event.target || !this.player.isReady) {
            return;
        }

        const w = event.target.offsetWidth;
        const x = event.x;
        const d = x / w;

        this.player.currentTime = this.player.getDuration() * d;
    }
    /**
     * Play button handler
     */
    static onPlayBtn() {
        this.player.play();
    }
    /**
     * Pause button handler
     */
    static onPauseBtn() {
        this.player.stop();
    }
    /**
     * Next button handler
     */
    static onNextBtn() {
        this.preloadRandomTracks();
    }
    /**
     * Prev button handler
     */
    static onPrevBtn() {
        this.preloadRandomTracks();
    }
    /**
     * Recent bar handler
     */
    static onRecentBar() {
        this.elements["bbar"]       .setAttribute("hide", "");
        this.recent.show();
        this.recent.on();
    }
    /**
     * Recent onClose handler
     */
    static onRecentClose() {
        this.elements["bbar"]   .removeAttribute("hide");
        this.recent.hide();
    }
    /** 
     * Stream resumed
    */
    static onPlay() {
        PlayerState.showPauseBtn.call(this);
    }
    /** 
     * Stream paused
    */
    static onPause() {
        PlayerState.showPlayBtn.call(this);
    }
    /**
     * Once on play button handler
     */
    static async onPlayBtnOnce() {
        await this.preloadRandomTracks();
        // show prev button
        this.elements["prev"]       .removeAttribute("hide");
        // show next button
        this.elements["next"]       .removeAttribute("hide");
        // show top bar
        this.elements["tbar"]       .removeAttribute("hide");
        // remove handler from play button
        this.elements["play"]       .doOff("tap", this._onPlayBtnOnce_);
        // delete backup handler
        delete this._onPlayBtnOnce_;
        // checks and init recent state
        if (!this.recent) {
            console.warn("Recent State Not Found");
        } else {
            // apply handler for bottom bar of player state
            this.elements["bbar"]   .doOn("tap", PlayerState.onRecentBar.bind(this));
            // show player state bottom bar
            this.elements["bbar"]   .removeAttribute("hide");
            // apply handler for bottom bar of recent state
            this.recent             .onClosed(PlayerState.onRecentClose.bind(this));
            this.recent.init();
        }
    }
    /** 
     * Fires when data starts fetching, we can start populate UI
    */
    static onLoadStart() {
        PlayerState.showPlayBtn.call(this);
        // update main background
        this.background.style.backgroundImage =`url("${this.player.getCover()}")`;
        // update track info
        this.elements["artwork"]    .src = this.player.getCover();
        this.elements["title"]      .innerHTML = this.player.getTrackTitle();
        this.elements["genre"]      .innerHTML = this.player.getTrackGenre();
        this.elements["dtime"]      .innerHTML = this.player.getTrackDurationString();
        // update curent time
        PlayerState.updateCurentTime.call(this);
    }
    /**
     * Stream time updates handler
     */
    static onTimeUpdate() {
        // trackbar moving
        this.elements["pindicator"] .style.width = this.player.getCurrentTimePercent();
        PlayerState.updateCurentTime.call(this);
    }
    /**
     * Player metadata is loaded
     */
    static onMetadataLoaded() {
        this.player.play();
    }
    /**
     * Track playing ended
     */
    static onPlayEnded() {
        return PlayerState.onNextBtn.call(this);
    }
    /**
     * Update current track time if not equals last value
     */
    static updateCurentTime() {
        if (this.elements["ctime"]  .last !== this.player.getCurrentTimeString()) {
            this.elements["ctime"]  .innerHTML = this.player.getCurrentTimeString();
            this.elements["ctime"]  .last = this.player.getCurrentTimeString();
        }
    }
    /**
     * Show Play button
     */
    static showPlayBtn() {
        this.elements["play"]       .removeAttribute("hidden");
        this.elements["pause"]      .setAttribute("hidden", "");
    }
    /**
     * Show Pause button
     */
    static showPauseBtn() {
        this.elements["play"]       .setAttribute("hidden", "");
        this.elements["pause"]      .removeAttribute("hidden");
    }
    /**
     * Preload Random tracks
     */
    async preloadRandomTracks() {
        // TODO: can be used for blocking content
        let found = false;
        let tracks = await this.player.preloadRandomTracks();

        // TODO: should be moved out and logic increased
        for (let i = 0; i < tracks.length; i++) {
            if (this.player.track) {
                if (this.player.track.id === tracks[i].id) {
                    continue;
                }
            }
            // increase offset
            if (tracks[i].genre && tracks[i].duration > this.player.settings.duration.from && this.player.settings.genres.indexOf(tracks[i].genre) !== -1) {
                found = true;
                console.info(`${tracks[i].genre}\n${tracks[i].title}`);
                this.player.settings = { offset: this.player.settings.offset + i };
                this.player.tracks = Object.assign([], tracks);
                return this.player.start(i);
            }
        };
        if (!found) {
            this.player.settings = { offset: this.player.settings.offset + tracks.length };
            return await this.preloadRandomTracks.call(this);
        }
    }
}

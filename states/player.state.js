import { State } from "../modules/state.js";
import { Settings } from "../modules/settings.js";
/**
  * Class representing a Player State
  * 
  * @author Denis Narush <child.denis@gmail.com>
  * @extends State
 */
export class PlayerState extends State {
    /**
     * Player State constructor
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
        this.elements["bbar"]       .doOn("tap", PlayerState.onRecentBar.bind(this));
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
        if (Settings.genre !== this.elements["genre"].innerHTML) {
            Settings.genre = this.elements["genre"].innerHTML;
            this.player.getTracks();
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
        this.player.getTracks();
    }
    /**
     * Prev button handler
     */
    static onPrevBtn() {
        this.player.getTracks();
    }
    /**
     * Recent bar handler
     */
    static onRecentBar() {
        console.log(this);
        // TODO: subscribe attribute changing on recent state container by using DOM MutationObserver
        this.elements["bbar"]       .setAttribute("hide", "");
        this.recent.on();
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
    static onPlayBtnOnce() {
        // show prev button
        this.elements["prev"]       .removeAttribute("hide");
        // show next button
        this.elements["next"]       .removeAttribute("hide");
        // show top bar
        this.elements["tbar"]       .removeAttribute("hide");
        // show bottom bar
        this.elements["bbar"]       .removeAttribute("hide");
        // remove handler from play button
        this.elements["play"]       .doOff("tap", this._onPlayBtnOnce_);
        // delete backup handler
        delete this._onPlayBtnOnce_;

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
        this.player.getTracks();
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
}

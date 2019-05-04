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

        this.elements["trackbar"]   .doOn("tap", PlayerState.onTrackbar.bind(this));
        this.elements["play"]       .doOn("tap", PlayerState.onPlayBtn.bind(this));
        this.elements["pause"]      .doOn("tap", PlayerState.onPauseBtn.bind(this));
        this.elements["next"]       .doOn("tap", PlayerState.onNextBtn.bind(this));
        this.elements["prev"]       .doOn("tap", PlayerState.onPrevBtn.bind(this));

        this.player                 .onPlay(PlayerState.onPlay.bind(this));
        this.player                 .onPause(PlayerState.onPause.bind(this));
        this.player                 .onLoadStart(PlayerState.onLoadStart.bind(this));
        this.player                 .onTimeUpdate(PlayerState.onTimeUpdate.bind(this));
        this.player                 .onMetadataLoaded(PlayerState.onMetadataLoaded.bind(this));
    }
    /**
     * Init
     */
    init() {
        return this;
    }
    /**
     * Trackbar handler
     * @param {} event
     */
    static onTrackbar(event) {
        if (this.elements["trackbar"] !== event.target && !this.player.isReady) {
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
        this.elements["play"].removeAttribute("hidden");
        this.elements["pause"].setAttribute("hidden", "");
    }
    /**
     * Show Pause button
     */
    static showPauseBtn() {
        this.elements["play"].setAttribute("hidden", "");
        this.elements["pause"].removeAttribute("hidden");
    }
}

import { State } from "../modules/state.js";
import { Settings } from "../modules/settings.js";
import { default as Player } from "../modules/player.js";

export class PlayerState extends State {
    constructor() {
        super("player");

        this.elements["genre"]  .innerHTML = Settings.genre;
        this.elements["play"]   .doOn("tap", PlayerState.onPlayBtn.bind(this));
        this.elements["pause"]  .doOn("tap", PlayerState.onPauseBtn.bind(this));
        this.elements["next"]   .doOn("tap", PlayerState.onNextBtn.bind(this));
        this.elements["prev"]   .doOn("tap", PlayerState.onPrevBtn.bind(this));

        Player.onPlay(PlayerState.onPlay.bind(this));
        Player.onPause(PlayerState.onPause.bind(this));
        Player.onLoadStart(PlayerState.onLoadStart.bind(this));
        Player.onTimeUpdate(PlayerState.onTimeUpdate.bind(this));
    }
    /**
     * Init
     */
    init() {
        Player.getTracks();
        return this;
    }
    /**
     * Play button handler
     */
    static onPlayBtn() {
        Player.play();
    }
    /**
     * Pause button handler
     */
    static onPauseBtn() {
        Player.stop();
    }
    /**
     * Next button handler
     */
    static onNextBtn() {
        Player.getTracks();
    }
    /**
     * Prev button handler
     */
    static onPrevBtn() {
        Player.getTracks();
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

        document.querySelector("#streamBgArtwork").style.backgroundImage =`url("${Player.getCover()}")`;

        this.elements["artwork"]    .src = Player.getCover();
        this.elements["title"]      .innerHTML = Player.getTrackTitle();
        this.elements["genre"]      .innerHTML = Player.getTrackGenre();
        this.elements["dtime"]      .innerHTML = Player.getTrackDurationString();

        PlayerState.updateCurentTime.call(this);
    }
    /**
     * Stream time updates handler
     */
    static onTimeUpdate() {
        // trackbar moving
        this.elements["pindicator"] .style.width = `${Player.getTrackDuration() ? Player.getCurrentTime() * 100000 / Player.getTrackDuration() : 0}%`;
        PlayerState.updateCurentTime.call(this);
    }
    /**
     * Update current track time if not equals last value
     */
    static updateCurentTime() {
        if (this.elements["ctime"].last !== Player.getCurrentTimeString()) {
            this.elements["ctime"]      .innerHTML = Player.getCurrentTimeString();
            this.elements["ctime"]      .last = Player.getCurrentTimeString();
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

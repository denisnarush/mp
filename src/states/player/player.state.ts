import { State, StateOptionsInterface, ElementsInterface } from "../../modules/state.js";
import { Player } from "../../modules/player.js";
import { RecentState } from "../recent/recent.state.js";


export class PlayerState extends State {
    /**
     * Player types
     */
    private background: HTMLElement;
    // Player instance
    private player: Player
    private recentState: RecentState

    // TEMP
    private _onPlayBtnOnce_: any;
    /**
     * Player state constructor
     */
    constructor(options: StateOptionsInterface) {
        super(`player`, options);
    }
    /**
     * Init
     */
    init() {
        /**
         * Player state elements handlers
         */
        this.elements["play"]       .doOn("tap", this.playTap.bind(this))
        this.elements["pause"]      .doOn("tap", this.pauseTap.bind(this));
        /**
         * Player state elements onetime handlers
         */
        this._onPlayBtnOnce_         = this.onPlayBtnOnce.bind(this);
        this.elements["play"]       .doOn("tap", this._onPlayBtnOnce_);
        /**
         * Player events handlers
         */
        this.player                 .onPlay(this.playerPlay.bind(this));
        this.player                 .onPause(this.playerPause.bind(this));
        this.player                 .onLoadStart(this.playerLoadStart.bind(this));
        this.player                 .onTimeUpdate(this.playerTimeUpdate.bind(this));
        this.player                 .onMetadataLoaded(this.playerMetadataLoaded.bind(this));
    }
    /**
     * Play button handler
     */
    private playTap() {
        this.player.play();
    }
    /**
     * Pause button handler
     */
    private pauseTap() {
        this.player.stop();
    }
    /** 
     * Fires when data starts fetching, we can start populate UI
    */
    private playerLoadStart() {
        this.showPlayBtn();
        // update main background
        this.background.style.backgroundImage =`url("${this.player.getCover()}")`;
        // update track info
        (this.elements["artwork"] as HTMLImageElement).src = this.player.getCover();
        this.elements["title"]      .innerHTML = this.player.getTrackTitle();
        this.elements["genre"]      .innerHTML = this.player.getTrackGenre();
        this.elements["dtime"]      .innerHTML = this.player.getTrackDurationString();
        // update curent time
        this.updateCurentTime();
    }
    /**
     * Player time updates handler
     */
    private playerTimeUpdate() {
        // trackbar moving
        (this.elements["pindicator"] as HTMLElement).style.width = this.player.getCurrentTimePercent();
        this.updateCurentTime();
    }
    /**
     * Player metadata loaded handler
     */
    private playerMetadataLoaded() {
        this.player.play();
    }
    /** 
     * Player metadata resumed handler
    */
    private playerPlay() {
        this.showPauseBtn();
    }
    /** 
     * Player metadata paused handler
    */
    private playerPause() {
        this.showPlayBtn.call(this);
    }
    /**
     * Show Play button
     */
    private showPlayBtn() {
        this.elements["play"]       .removeAttribute("hidden");
        this.elements["pause"]      .setAttribute("hidden", "");
    }
    /**
     * Show Pause button
     */
    private showPauseBtn() {
        this.elements["play"]       .setAttribute("hidden", "");
        this.elements["pause"]      .removeAttribute("hidden");
    }
    /**
     * Update current track time if not equals last value
     */
    private updateCurentTime() {
        this.elements["ctime"]  .innerHTML = this.player.getCurrentTimeString();
    }
    /**
     * Once on play button handler
     */
    private async onPlayBtnOnce() {
        await this.preloadRandomTracks();
        // show prev button
        // TODO: uncomment
        // this.elements["prev"]       .removeAttribute("hide");
        // show next button
        // TODO: uncomment
        // this.elements["next"]       .removeAttribute("hide");
        // show top bar
        this.elements["tbar"]       .removeAttribute("hide");
        // remove handler from play button
        // TODO: uncomment
        // this.elements["play"]       .doOff("tap", this._onPlayBtnOnce_);
        // delete backup handler
        delete this._onPlayBtnOnce_;
        // checks and init recent state
        if (!this.recentState) {
            console.warn("Recent State Not Found");
        } else {
            // apply handler for bottom bar of player state
            // TODO: uncomment
            // this.elements["bbar"]   .doOn("tap", PlayerState.onRecentBar.bind(this));
            // show player state bottom bar
            // TODO: uncomment
            // this.elements["bbar"]   .removeAttribute("hide");
            // apply handler for bottom bar of recent state
            // TODO: uncomment
            // this.recent             .onClosed(PlayerState.onRecentClose.bind(this));
            // this.recent.init();
        }
    }
    /**
     * Preload Random tracks
     */
    private async preloadRandomTracks() {
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
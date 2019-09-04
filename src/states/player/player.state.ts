import { State, StateOptionsInterface, ElementsInterface } from "../../modules/state.js";
import { Player } from "../../modules/player.js";
import { RecentState } from "../recent/recent.state.js";


export class PlayerState extends State {
    /**
     * Player types
     */
    // Player instance
    private player: Player
    private static player: Player
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
        this.elements["play"]       .doOn("tap", PlayerState.playTap.bind(this))

        /**
         * Player state elements onetime handlers
         */
        this._onPlayBtnOnce_         = this.onPlayBtnOnce.bind(this);
        this.elements["play"]       .doOn("tap", this._onPlayBtnOnce_);
        /**
         * Player events handlers
         */
        this.player                 .onMetadataLoaded(PlayerState.onMetadataLoaded.bind(this));
    }
    /**
     * Play button handler
     */
    private static playTap() {
        this.player.play();
    }
    /**
     * Player metadata is loaded
     */
    static onMetadataLoaded() {
        this.player.play();
    }
    /**
     * Once on play button handler
     */
    private async onPlayBtnOnce() {
        await this.preloadRandomTracks();
        // show prev button
        this.elements["prev"]       .removeAttribute("hide");
        // show next button
        this.elements["next"]       .removeAttribute("hide");
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
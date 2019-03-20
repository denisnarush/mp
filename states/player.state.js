import { State } from "../modules/state.js";
import { Settings } from "../modules/settings.js";
import { default as Player } from "../modules/player.js";

export class PlayerState extends State {
    constructor() {
        super("player");

        this.elements["genre"]  .innerHTML = Settings.genre;
        this.elements["play"]   .doOn("tap", PlayerState.onPlayBtn.bind(this));
        this.elements["pause"]  .doOn("tap", PlayerState.onPauseBtn.bind(this));

        Player.onPlay(PlayerState.onPlay.bind(this));
        Player.onPause(PlayerState.onPause.bind(this));
        Player.onLoadStart(PlayerState.onLoadStart.bind(this));
    }

    init() {
        Player.getTracks();
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
     * Stream resumed
    */
    static onPlay() {
        this.elements["play"].setAttribute("hidden", "");
        this.elements["pause"].removeAttribute("hidden");
    }
    /** 
     * Stream paused
    */
    static onPause() {
        this.elements["play"].removeAttribute("hidden");
        this.elements["pause"].setAttribute("hidden", "");
    }
    /** 
     * Fires when data starts fetching, we can start populate UI
    */
    static onLoadStart() {
        this.elements["play"].removeAttribute("hidden");
        this.elements["pause"].setAttribute("hidden", "");

        let endtime = new Date(Player.getTrackDuration());

        document.querySelector("#streamBgArtwork").style.backgroundImage =`url("${Player.getCover()}")`;

        this.elements["artwork"]    .src = Player.getCover();
        this.elements["title"]      .innerHTML = Player.getTItle();
        this.elements["genre"]      .innerHTML = Player.getGenre();
        this.elements["ctime"]      .innerHTML = "00:00";
        this.elements["dtime"]      .innerHTML = `${(endtime.getUTCHours() ? endtime.toUTCString().slice(17, 25) : endtime.toUTCString().slice(20, 25))}`;
    }
}

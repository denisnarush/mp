import { State } from "../modules/state.js";
import { Settings } from "../modules/settings.js";
import { default as Player } from "../modules/player.js";
import { default as Recent } from "./recent.state.js";
/**
 * Class representing a player state view
 */
export class PlayerState extends State {
    constructor() {
        super("player");



        this.actionNext = document.getElementById("actionNext");
        this.actionPrev = document.getElementById("actionPrev");
        this.actionLoop = document.getElementById("actionLoop");
        this.actionShuffle = document.getElementById("actionShuffle");

        this.streamCurrentTime = document.getElementById("streamCurrentTime");
        this.streamDurationTime = document.getElementById("streamDurationTime");
        this.streamBgArtwork = document.getElementById("streamBgArtwork");
        this.streamTrackbar = document.getElementById("streamTrackbar");
        this.streamProgressIndicator = document.getElementById("streamProgressIndicator");
        this.streamTrackbarIndicator = document.getElementById("streamTrackbarIndicator");
        // this.stream = Player.stream;
        this.streamArtwork = document.getElementById("streamArtwork");
        this.streamGenre = document.getElementById("streamGenre");
        this.streamTitle = document.getElementById("streamTitle");

        this.elements["play"].doOn("tap", PlayerState.onPlayBtn.bind(this));
        this.elements["pause"].doOn("tap", PlayerState.onPauseBtn.bind(this));
        // keydown
        window.addEventListener("keydown", PlayerState.onKeydown.bind(this));
        // progress
        Player.onProgress(PlayerState.onProgress.bind(this));
        // load start
        Player.onLoadStart(PlayerState.onLoadStart.bind(this));
        // metadata
        Player.onMetadataLoaded(PlayerState.onMetadataLoaded.bind(this));
        // played
        Player.onPlay(PlayerState.onPlay.bind(this));
        // time update
        Player.onTimeUpdate(PlayerState.onTimeUpdate.bind(this));
        // pause
        Player.onPause(PlayerState.onPause.bind(this));
        // stream ended
        Player.onEnded(PlayerState.onEnded.bind(this));

        this.streamGenre.innerHTML = Settings.genre;

        this.state.topBar = [{
            icon: {
                type: "icon-arrow-down-right"
            }
        }, {
            title: "Now Playing"
        }, {
            push: "right"
        }];
    }
    /**
     * Play button handler
     */
    static onPlayBtn() {
        Player.play();
    }
    /** 
     * Stream resumed
    */
    static onPlay() {
        this.elements["play"].setAttribute("hidden", "");
        this.elements["pause"].removeAttribute("hidden");
    }
    /**
     * Pause button handler
     */
    static onPauseBtn() {
        Player.stop();
    }
    /** 
     * Stream paused
    */
    static onPause() {
        this.elements["play"].removeAttribute("hidden");
        this.elements["pause"].setAttribute("hidden", "");
    }
    /**
     * Next button handler
     */
    static onNext() {
        Player.getTracks();
    }
    /**
     * Prev button handler
     */
    static onPrev() {
        Player.next();
    }
    /**
     * Stream ends handler
     */
    static onEnded() {
        if (this.stream.looped) {
            this.stream.currentTime = 0;
        } else {
            Player.getTracks();
        }
    }
    /**
     * Shuffle button handler
     */
    static onShuffle() {
        // turn off loop
        this.stream.looped = false;
        this.actionLoop.style.opacity = 0.5;

        this.stream.shuffled = !this.stream.shuffled;
        this.actionShuffle.style.opacity = (this.stream.shuffled ? 1 : 0.5);
    }
    /**
     * Loop button handler
     */
    static onLoop() {
        // turn off shuffle
        this.stream.shuffled = false;
        this.actionShuffle.style.opacity = 0.5;

        this.stream.looped = !this.stream.looped;
        this.actionLoop.style.opacity = (this.stream.looped ? 1 : 0.5);
    }
    /**
     * Stream time updates handler
     */
    static onTimeUpdate() {
        let w, time, duration;

        time = new Date(Player.getCurrentTime() * 1000);
        duration = Player.getDuration() || 1;

        // trackbar width
        w = (Player.getCurrentTime() * 100 / duration).toFixed(1) + "%";
        // trackbar moving
        this.streamProgressIndicator.style.width = w;
        // current track time
        this.streamCurrentTime.innerHTML = `${(time.getUTCHours() ? time.toUTCString().slice(17, 25) : time.toUTCString().slice(20, 25))}`;
    }

    /**
     * Keyboard configuration
     * @param {KeyboardEvent} event 
     */
    static onKeydown(event) {
        switch (event.code) {
        case "Space":
            if(this.stream.paused) {
                this.onPlay();
            } else {
                this.onPause();
            }
            break;
        case "ArrowRight":
            this.stream.currentTime += 5;
            break;
        case "ArrowLeft":
            this.stream.currentTime -= 5;
            break;
        case "ArrowUp":
            (100 * this.stream.volume >= 95 ? this.stream.volume = 1 : this.stream.volume = (100 * this.stream.volume + 5) / 100);
            break;
        case "ArrowDown":
            (100 * this.stream.volume <= 5 ? this.stream.volume = 0 : this.stream.volume = (100 * this.stream.volume - 5) / 100);
            break;
        }
    }
    /**
     * Track swing
     * @param {MouseEvent} event 
     */
    static onTrackBar(event) {
        if (this.streamTrackbar !== event.target) {
            return;
        }

        let w = event.target.offsetWidth;
        let x = event.x;

        if (this.stream.readyState === 4) {
            const d = x / w;
            this.stream.currentTime = Player.getDuration() * d;
        }
    }
    /**
     * Enter to genre editing
     */
    static onGenreClick() {
        this.streamGenre.setAttribute("contenteditable", true);
        this.streamGenre.focus();
    }
    /**
     * Detecting Enter (submit) method
     * @param {KeyboardEvent} event 
     */
    static onGenreKeypress(event) {
        if (event.code === "Enter") {
            event.preventDefault();
            event.target.blur();
        }
    }
    /**
     * Stop event bubbling
     * @param {KeyboardEvent} event 
     */
    static onGenreKeydown(event) {
        event.stopPropagation();
    }
    /**
     * Submiting changes on loosing focus event
     */
    static onGenreBlur() {
        if (!this.streamGenre.hasAttribute("contenteditable")) {
            return;
        }

        this.streamGenre.removeAttribute("contenteditable");
        Player.getTracks(this.streamGenre.innerHTML);
    }
    /** 
     * Fires when data starts fetching, we can start populate UI
    */
    static onLoadStart() {
        this.elements["play"].removeAttribute("hidden");
        this.elements["pause"].setAttribute("hidden", "");

        let endtime = new Date(Player.getTrackDuration());

        this.streamBgArtwork.style.backgroundImage =`url("${Player.getCover()}")`;
        this.streamArtwork.src = Player.getCover();
        this.streamTitle.innerHTML = Player.getTrackTitle();
        this.streamGenre.innerHTML = Player.getTrackGenre();

        this.streamCurrentTime.innerHTML = "00:00";
        this.streamDurationTime.innerHTML = `${(endtime.getUTCHours() ? endtime.toUTCString().slice(17, 25) : endtime.toUTCString().slice(20, 25))}`;
    }
    /**
     * Fires when metadata loaded
     */
    static onMetadataLoaded() {
        this.streamProgressIndicator.style.width = "0%";
    }
    /**
     * Fires during song playing
     */
    static onProgress() {
        if (Player.stream.duration < 1) {
            return;
        }

        for (var i = 0; i < Player.stream.buffered.length; i++) {
            if (Player.stream.buffered.start(Player.stream.buffered.length - 1 - i) < Player.getCurrentTime()) {
                this.streamTrackbarIndicator.style.width = (Player.stream.buffered.end(Player.stream.buffered.length - 1 - i) / Player.getDuration()) * 100 + "%";
            }
        }
    }
    /**
     * Initialization
     */
    init() {
        // // play tap
        // this.actionPlay.doOn("tap", () => {this.onPlay();});
        // // pause tap
        // this.actionPause.doOn("tap", () => {this.onPause();});
        // // next tap
        // this.actionNext.doOn("tap", () => {this.onNext();});
        // prev tap
        this.actionPrev.doOn("tap", () => {this.onPrev();});
        // shuffle tap
        this.actionShuffle.doOn("tap", () => {this.onShuffle();});
        // repeat tap
        this.actionLoop.doOn("tap", () => {this.onLoop();});

        // // progress
        // this.stream.addEventListener("progress", () => {this.onProgress();});
        // // load start
        // this.stream.addEventListener("loadstart", () => {this.onLoadStart();});
        // // metadata
        // this.stream.addEventListener("loadedmetadata", () => {this.onMetadataLoaded();});
        // // stream ended
        // this.stream.addEventListener("ended", () => {this.onEnded();});
        // // time update
        // this.stream.addEventListener("timeupdate", () => {this.onTimeUpdate();});
        // // paused
        // this.stream.addEventListener("pause", () => {this.onPaused();});
        // // played
        // this.stream.addEventListener("play", () => {this.onPlayed();});

        // stream trackbar tap
        this.streamTrackbar.doOn("tap", (event) => {this.onTrackBar(event);});
        // genre tap
        this.streamGenre.addEventListener("click", () => {this.onGenreClick();});
        // genre keypress
        this.streamGenre.addEventListener("keypress", (event) => {this.onGenreKeypress(event);});
        // genre keydown
        this.streamGenre.addEventListener("keydown", (event) => {this.onGenreKeydown(event);});
        // genre blur
        this.streamGenre.addEventListener("blur", () => {this.onGenreBlur();});

        // // keydown
        // window.addEventListener("keydown", (event) => {this.onKeydown(event);});

        Player.getTracks();
        Recent.init();

        super.init();
    }
}

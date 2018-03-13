import { getSearchParameters } from "./utils.js";
import { Settings } from "./settings.js";
import { State } from "./state.js";
import { Player } from "./player.js";

const params = getSearchParameters();
/**
 * Class representing a player
 */
class PlayerState extends State {
    /**
     * Create a player
     */

    constructor() {
        super("player");

        this.CLIENT_ID = Settings.scKey;
        this.REDIRECT_URI = Settings.scURL;
        this.actionPlay = document.getElementById("actionPlay");
        this.actionPause = document.getElementById("actionPause");
        this.actionNext = document.getElementById("actionNext");
        this.actionPrev = document.getElementById("actionPrev");
        this.actionLoop = document.getElementById("actionLoop");
        this.actionShuffle = document.getElementById("actionShuffle");
        
        this.streamCurrentTime = document.getElementById("streamCurrentTime");
        this.streamDurationTime = document.getElementById("streamDurationTime");
        this.streamBgArtwork = document.getElementById("streamBgArtwork");
        this.streamTrackbar = document.getElementById("streamTrackbar");
        this.streamTrackbarIndicator = document.getElementById("streamTrackbarIndicator");
        this.stream = document.getElementById("stream");
        this.streamArtwork = document.getElementById("streamArtwork");
        this.streamGenre = document.getElementById("streamGenre");
        this.streamTitle = document.getElementById("streamTitle");

        this.state.topBar = [{
            icon: {
                type: "icon-arrow-down-right"
            }
        }, {
            title: "Now Playing"
        }, {
            push: "right"
        }/*, {
            icon: {
                type: "icon icon-equalizer",
                handler: () => {this.switchTo("equalizer");}
            }
        }*/];

        this.init();
    }
    onCanPlayThrough() {
        if (!this.stream.paused) {
            this.actionPlay.setAttribute("hidden", "");
            this.actionPause.removeAttribute("hidden");
        }
    }
    /**
     * Play button handler
     */
    onPlay() {
        Player.start();
    }
    /** 
     * Stream resumed
    */
    onPlayed() {
        this.actionPlay.setAttribute("hidden", "");
        this.actionPause.removeAttribute("hidden");
    }
    /**
     * Pause button handler
     */
    onPause() {
        Player.stop();
    }
    /** 
     * Stream paused
    */
    onPaused() {
        this.actionPlay.removeAttribute("hidden");
        this.actionPause.setAttribute("hidden", "");
    }
    /**
     * Next button handler
     */
    onNext() {
        Player.next();
    }
    /**
     * Prev button handler
     */
    onPrev() {
        Player.prev();
    }
    /**
     * Stream ends handler
     */
    onEnded() {
        if (this.stream.looped) {
            this.stream.currentTime = 0;
        } else {
            this.onNext();
        }
    }
    /**
     * Shuffle button handler
     */
    onShuffle() {
        // turn off loop
        this.stream.looped = false;
        this.actionLoop.style.opacity = 0.5;

        this.stream.shuffled = !this.stream.shuffled;
        this.actionShuffle.style.opacity = (this.stream.shuffled ? 1 : 0.5);
    }
    /**
     * Loop button handler
     */
    onLoop() {
        // turn off shuffle
        this.stream.shuffled = false;
        this.actionShuffle.style.opacity = 0.5;

        this.stream.looped = !this.stream.looped;
        this.actionLoop.style.opacity = (this.stream.looped ? 1 : 0.5);
    }
    /**
     * Stream time updates handler
     */
    onTimeUpdate() {
        let w, time;
        time = new Date(this.stream.currentTime * 1000);
        // trackbar width
        w = (this.stream.currentTime * 100 / this.stream.duration).toFixed(1) + "%";
        // trackbar moving
        this.streamTrackbarIndicator.style.width = w;
        // current track time
        this.streamCurrentTime.innerHTML = `${(time.getUTCHours() ? time.toUTCString().slice(17, 25) : time.toUTCString().slice(20, 25))}`;
    }
    /**
     * Volume handler
    */
    onVolumeChange() {
        Settings.volume = this.stream.volume;
    }
    /**
     * Keyboard configuration
     * @param {KeyboardEvent} event 
     */
    onKeydown(event) {
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
        case "KeyR":
            if (event.metaKey || event.ctrlKey) {
                Player.getTracks();
            }
            break;
        }
    }
    /**
     * Track swing
     * @param {MouseEvent} event 
     */
    onTrackBar(event) {
        if (this.streamTrackbar !== event.target) {
            return;
        }

        let w = event.target.offsetWidth;
        let x = event.offsetX || event.layerX;

        if (this.stream.readyState === 4) {
            const d = x / w;
            this.stream.currentTime = this.stream.duration * d;
        }
    }
    /**
     * Enter to genre editing
     */
    onGenreClick() {
        this.streamGenre.setAttribute("contenteditable", true);
        this.streamGenre.focus();
    }
    /**
     * Detecting Enter (submit) method
     * @param {KeyboardEvent} event 
     */
    onGenreKeypress(event) {
        if (event.code === "Enter") {
            event.preventDefault();
            this.streamGenre.removeAttribute("contenteditable");
            Player.getTracks(this.streamGenre.innerHTML);
        }
    }
    /**
     * Stop event bubbling
     * @param {KeyboardEvent} event 
     */
    onGenreKeydown(event) {
        event.stopPropagation();
    }
    /**
     * Submiting changes on loosing focus event
     */
    onGenreBlur() {
        if (!this.streamGenre.hasAttribute("contenteditable")) {
            return;
        }

        this.streamGenre.removeAttribute("contenteditable");
        Player.getTracks(this.streamGenre.innerHTML);
    }
    /** 
     * when data starts fetching, we can start populate UI
    */
    onLoadStart() {
        let endtime = new Date(this.stream.track.duration);

        this.streamBgArtwork.style.backgroundImage =`url("${this.stream.cover}")`;
        this.streamTitle.innerHTML = this.stream.track.title;
        this.streamGenre.innerHTML = this.stream.track.genre;
        this.streamArtwork.src = this.stream.cover;
        this.streamDurationTime.innerHTML = `${(endtime.getUTCHours() ? endtime.toUTCString().slice(17, 25) : endtime.toUTCString().slice(20, 25))}`;
    }

    /**
     * Initialization
     */
    init() {
        Settings.genre = params.genre || Settings.genre;

        this.stream.shuffled = false;
        this.stream.looped = false;
        this.stream.volume = Settings.volume;

        // play tap
        this.actionPlay.applyEvent("tap", () => {this.onPlay();}, "Play");
        // pause tap
        this.actionPause.applyEvent("tap", () => {this.onPause();}, "Pause");
        // next tap
        this.actionNext.applyEvent("tap", () => {this.onNext();}, "Next");
        // prev tap
        this.actionPrev.applyEvent("tap", () => {this.onPrev();}, "Previous");
        // shuffle tap
        this.actionShuffle.applyEvent("tap", () => {this.onShuffle();}, "Shuffle");
        // repeat tap
        this.actionLoop.applyEvent("tap", () => {this.onLoop();}, "Repeat");

        // can playtrough
        this.stream.addEventListener("canplaythrough", () => {this.onCanPlayThrough();});
        // load start
        this.stream.addEventListener("loadstart", () => {this.onLoadStart();});
        // stream ended
        this.stream.addEventListener("ended", () => {this.onEnded();});
        // time update
        this.stream.addEventListener("timeupdate", () => {this.onTimeUpdate();});
        // volume change
        this.stream.addEventListener("volumechange", () => {this.onVolumeChange();});
        // paused
        this.stream.addEventListener("pause", () => {this.onPaused();});
        // played
        this.stream.addEventListener("play", () => {this.onPlayed();});

        // stream trackbar tap
        this.streamTrackbar.applyEvent("tap", (event) => {this.onTrackBar(event);});
        // genre tap
        this.streamGenre.addEventListener("click", () => {this.onGenreClick();});
        // genre keypress
        this.streamGenre.addEventListener("keypress", (event) => {this.onGenreKeypress(event);});
        // genre keydown
        this.streamGenre.addEventListener("keydown", (event) => {this.onGenreKeydown(event);});
        // genre blur
        this.streamGenre.addEventListener("blur", () => {this.onGenreBlur();});

        // keydown
        window.addEventListener("keydown", (event) => {this.onKeydown(event);});

        Player.getTracks();
        this.on();
    }
}

export default new PlayerState();
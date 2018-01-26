import { getSearchParameters } from "./utils.js";
import { Settings } from "./settings.js";
const params = getSearchParameters();
const protocol = location.protocol === "chrome-extension:" ? "https:" : location.protocol;
/**
 * Class representing a player
 */
class Player {
    /**
     * Create a player
     */
    constructor() {
        this.LIMIT = 30,
        this.CLIENT_ID = "7172aa9d8184ed052cf6148b4d6b8ae6";
        this.REDIRECT_URI = "http://www.player-denisnarush.c9.io";
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
        this.playlist = document.getElementById("playlist");
        this.stream = document.getElementById("stream");
        this.streamBgArtwork = document.getElementById("streamBgArtwork");
        this.streamArtwork = document.getElementById("streamArtwork");
        this.streamGenre = document.getElementById("streamGenre");
        this.streamTitle = document.getElementById("streamTitle");

        this.init();
    }
    /**
     * fetch SoundCloud data
     * @param {String} endpoint 
     * @param {String} params 
     * @param {Function} callback 
     */
    fetch(endpoint, params, callback) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", `${protocol}//api.soundcloud.com/${endpoint}?client_id=${this.CLIENT_ID}${params}`, true);
        xhr.addEventListener("load", (event) => {
            if (event.currentTarget.status === 200) {
                callback(JSON.parse(event.currentTarget.response));
            } else {
                callback({});
            }
        });
        xhr.send();
    }
    /**
     * Play button handler
     */
    onPLay() {
        if(!this.stream.paused) {
            return;
        }
        this.stream.play();
        this.actionPlay.setAttribute("hidden", "");
        this.actionPause.removeAttribute("hidden");
    }
    /**
     * Pause button handler
     */
    onPause() {
        if(this.stream.paused) {
            return;
        }
        this.stream.pause();
        this.actionPlay.removeAttribute("hidden");
        this.actionPause.setAttribute("hidden", "");
    }
    /**
     * Next button handler
     */
    onNext() {
        if (this.playlist.shuffled) {
            let i = Math.floor(Math.random() * (this.playlist.tracks.length - 0)) + 0;
            ( this.playlist.current === i ? this.playlist.current++ : this.playlist.current = i );
        } else {
            this.playlist.current++;
        }

        ( this.playlist.current === this.playlist.tracks.length ?  this.playlist.current = 0 :  this.playlist.current );

        this.getTrack();
    }
    /**
     * Prev button handler
     */
    onPrev() {
        if (this.playlist.shuffled) {
            let i = Math.floor(Math.random() * (this.playlist.tracks.length - 0)) + 0;
            ( this.playlist.current === i ? this.playlist.current-- : this.playlist.current = i );
        } else {
            this.playlist.current--;
        }

        ( this.playlist.current === 0 ?  this.playlist.current = this.playlist.tracks.length - 1 : this.playlist.current );

        this.getTrack();
    }
    /**
     * Stream can play handler
     */
    onCanPlayThrough() {
        if (!this.stream.paused) {
            this.actionPlay.setAttribute("hidden", "");
            this.actionPause.removeAttribute("hidden");
        }
    }
    /**
     * Stream ends handler
     */
    onEnded() {
        if (this.playlist.looped) {
            this.stream.currentTime = 0;
        } else {
            this.onNext();
        }
    }
    /**
     * Stream loaded handler
     */
    onLoadStart() {
        this.stream.pause();
        this.stream.play();
    }
    /**
     * Shuffle button handler
     */
    onShuffle() {
        // turn off loop
        this.playlist.looped = false;
        this.actionLoop.style.opacity = 0.5;

        this.playlist.shuffled = !this.playlist.shuffled;
        this.actionShuffle.style.opacity = (this.playlist.shuffled ? 1 : 0.5);
    }
    /**
     * Loop button handler
     */
    onLoop() {
        // turn off shuffle
        this.playlist.shuffled = false;
        this.actionShuffle.style.opacity = 0.5;

        this.playlist.looped = !this.playlist.looped;
        this.actionLoop.style.opacity = (this.playlist.looped ? 1 : 0.5);
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
     * Playlist item click handler
     * @param {MouseEvent} event 
     */
    onPlaylist(event) {
        let item = "",
            current = event.target;

        while(this.playlist !== current) {
            if (current.parentElement === this.playlist) {
                item = current;
            }
            current = current.parentElement;
        }

        if (!item) {
            return;
        }

        this.playlist.current = item.getAttribute("data-trackindex");
        this.getTrack();
    }
    /**
     * Keyboard configuration
     * @param {KeyboardEvent} event 
     */
    onKeydown(event) {
        switch (event.code) {
        case "Space":
            if(this.stream.paused) {
                this.onPLay();
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
                this.getTracks();
            }
            break;
        }
    }
    /**
     * Track swing
     * @param {MouseEvent} event 
     */
    onTrackBar(event) {
        if (this.stream.readyState === 4) {
            const d = event.offsetX / event.target.offsetWidth;
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
            this.getTracks(this.streamGenre.innerHTML);
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
        this.getTracks(this.streamGenre.innerHTML);
    }
    /**
     * Get track from playlist array
     */
    getTrack () {
        if (this.playlist.querySelector(".playlist-item__current")) {
            this.playlist.querySelector(".playlist-item__current").classList.remove("playlist-item__current");
        }

        let cover;
        let time = new Date();
        let track = this.playlist.tracks[this.playlist.current];

        // track time
        time.setTime(track.duration);
        // reset track progress bar width
        this.streamTrackbarIndicator.style.width = "0";
        // set audio src url to soundcloud stream
        this.stream.src = track.stream_url + "?client_id=" + this.CLIENT_ID;
        // discovering track artwork
        if (track.artwork_url !== null) {
            cover = track.artwork_url.replace(new RegExp("large","g"),"t500x500");
        } else {
            cover = track.user.avatar_url.replace(new RegExp("large","g"),"t500x500");
        }
        
        this.streamArtwork.src = cover;
        this.streamBgArtwork.style.backgroundImage = "url('"+cover+"')";
        this.streamGenre.innerHTML = track.genre;
        this.streamTitle.innerHTML = track.title;
        this.streamDurationTime.innerHTML = time.toUTCString().slice(20, 25);

        this.playlist.children[this.playlist.current].classList.toggle("playlist-item__current");
    }
    /**
     * Get list of tracks from SoundCloud
     * @param {String} genre 
     */
    getTracks(genre) {
        if (genre && genre.toLocaleLowerCase() === Settings.genre) {
            return;
        }
        let offset = Math.floor(Math.random() * (2000 - 0)) + 0;

        this.fetch("tracks", `&limit=${this.LIMIT}&genres=${genre || Settings.genre}&offset=${offset}`, (tracks) => {
            if (genre && tracks.length === 0) {
                return this.getTracks();
            }

            if (genre) {
                Settings.genre = genre.toLocaleLowerCase();
            }

            this.playlist.tracks = tracks;
            this.playlist.current = 0;
            
            // generate playlist
            this.generatePlaylist();
            
            // preload first track
            this.getTrack();
        });
    }
    /**
     * Playlist generator method
     */
    generatePlaylist() {
        let html = "";
        this.playlist.tracks.forEach(function (itm, i) {
            let time = new Date();
            // track time
            time.setTime(itm.duration);

            // template
            html += `<div class="playlist-item" data-trackindex="${i}">
                        <div class="playlist-item-s playlist-item-s__left">
                            <p class="playlist-item-title">${itm.user.username}<span class="playlist-item-author">${itm.title}</span></p>
                        </div>
                        <div class="playlist-item-s playlist-item-s__right">
                            <p class="playlist-item-time">${(time.getUTCHours() ? time.toUTCString().slice(17, 25) : time.toUTCString().slice(20, 25))}</p>
                        </div>
                    </div>`;
        });
        // past to the DOM
        this.playlist.innerHTML = html;
    }
    /**
     * Initialization
     */
    init() {
        Settings.genre = params.genre || Settings.genre;

        this.playlist.shuffled = false;
        this.playlist.looped = false;

        this.stream.volume = Settings.volume;

        // play tap
        this.actionPlay.addEventListener("click", () => {this.onPLay();});
        // pause tap
        this.actionPause.addEventListener("click", () => {this.onPause();});
        // next tap
        this.actionNext.addEventListener("click", () => {this.onNext();});
        // prev tap
        this.actionPrev.addEventListener("click", () => {this.onPrev();});
        // stream can play
        this.stream.addEventListener("canplaythrough", () => {this.onCanPlayThrough();});
        // stream ended
        this.stream.addEventListener("ended", () => {this.onEnded();});
        // stream load
        this.stream.addEventListener("loadstart", () => {this.onLoadStart();});
        // shuffle tap
        this.actionShuffle.addEventListener("click", () => {this.onShuffle();});
        // repeat tap
        this.actionLoop.addEventListener("click", () => {this.onLoop();});
        // time update
        this.stream.addEventListener("timeupdate", () => {this.onTimeUpdate();});
        // volume change
        this.stream.addEventListener("volumechange", () => {this.onVolumeChange();});
        // playlist tap
        this.playlist.addEventListener("click", (event) => {this.onPlaylist(event);});
        // stream trackbar tap
        this.streamTrackbar.addEventListener("click", (event) => {this.onTrackBar(event);});
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

        this.getTracks();
    } 
}

export default new Player();
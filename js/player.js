/* global SC */
/**
 * Class representing a player
 */
class Player {
    /**
     * Create a player
     */
    constructor() {
        this.LIMIT = 30,
        this.GENRE = "Chillout",
        this.CLIENT_ID = "7172aa9d8184ed052cf6148b4d6b8ae6",
        this.REDIRECT_URI = "http://www.player-denisnarush.c9.io";
        this.DEFAULT_TRACK_COVER = "img/tmp/album-cover.png";
        this.actionPlay = document.getElementById("actionPlay");
        this.actionPause = document.getElementById("actionPause");
        this.actionNext = document.getElementById("actionNext");
        this.actionPrev = document.getElementById("actionPrev");
        this.actionLoop = document.getElementById("actionLoop");
        this.actionShuffle = document.getElementById("actionShuffle");
        
        this.streamCurrentTime = document.getElementById("streamCurrentTime");
        this.streamBgArtwork = document.getElementById("streamBgArtwork");
        this.streamTrackbar = document.getElementById("streamTrackbar");
        this.playlist = document.getElementById("playlist");
        this.stream = document.getElementById("stream");
        this.streamBgArtwork = document.getElementById("streamBgArtwork");
        this.streamArtwork = document.getElementById("streamArtwork");
        this.streamGenre = document.getElementById("streamGenre");
        this.streamTitle = document.getElementById("streamTitle");

        this.init();
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

        this.getTrack(this.playlist.tracks[this.playlist.current].id);
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

        this.getTrack(this.playlist.tracks[this.playlist.current].id);
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
    onLoad() {
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
        this.streamTrackbar.style.width = w;
        // current track time
        this.streamCurrentTime.innerHTML = `${(time.getUTCHours() ? time.toUTCString().slice(17, 25) : time.toUTCString().slice(20, 25))}`;
    }
    /**
     * Playlist item click handler
     * @param {MouseEvent} event 
     */
    onPlaylist(event) {
        let path = event.path, i = 0;

        while (this.playlist !== path[i]) {
            i++;
        }
        let item = path[i - 1];

        if (!item) {
            return;
        }

        this.playlist.current = item.getAttribute("data-trackindex");
        this.getTrack(this.playlist.tracks[this.playlist.current].id);
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
            (this.stream.volume >= 1 ? this.stream.volume = 1 : this.stream.volume += 0.05);
            break;
        case "ArrowDown":
            (this.stream.volume < 0.05 ? this.stream.volume = 0.00 : this.stream.volume -= 0.05);
            break;
        case "KeyR":
            if (event.metaKey || event.ctrlKey) {
                this.getTracks();
            }
            break;
        }
    }

    getTrack (trackID) {
        if (this.playlist.querySelector(".playlist-item__current")) {
            this.playlist.querySelector(".playlist-item__current").classList.remove("playlist-item__current");
        }

        SC.get("/tracks/" + trackID).then((data) => {
            let cover;

            this.stream.pause();
            // set audio src url to soundcloud stream
            this.stream.src = data.stream_url + "?client_id=" + this.CLIENT_ID;
            // track artwork
            if (data.artwork_url !== null) {
                cover = data.artwork_url.replace(new RegExp("large","g"),"t500x500");
            } else {
                cover = this.DEFAULT_TRACK_COVER;
            }
            
            this.streamArtwork.src = cover;
            this.streamBgArtwork.style.backgroundImage = "url('"+cover+"')";
            this.streamGenre.innerHTML = data.genre;
            this.streamTitle.innerHTML = data.title;

            this.playlist.children[this.playlist.current].classList.toggle("playlist-item__current");
        });
    }

    getTracks() {
        let offset = Math.floor(Math.random() * (2000 - 0)) + 0;

        // search query
        SC.get("/tracks", {
            client_id: this.CLIENT_ID,
            limit: this.LIMIT,
            genres: this.GENRE,
            offset: offset
        }).then((tracks) => {
            this.playlist.tracks = tracks;
            this.playlist.current = 0;
        
            // preload first track
            this.getTrack(tracks[this.playlist.current].id);
            // generate playlist
            this.generatePlaylist();
        });
    }

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
        this.playlist.shuffled = false;
        this.playlist.looped = false;

        this.stream.volume = 0.75;
        this.streamBgArtwork.style.backgroundImage = "url('" + this.DEFAULT_TRACK_COVER + "')";

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
        this.stream.addEventListener("load", () => {this.onLoad();});
        // shuffle tap
        this.actionShuffle.addEventListener("click", () => {this.onShuffle();});
        // repeat tap
        this.actionLoop.addEventListener("click", () => {this.onLoop();});
        // time update
        this.stream.addEventListener("timeupdate", () => {this.onTimeUpdate();});
        // playlist tap
        this.playlist.addEventListener("click", (event) => {this.onPlaylist(event);});
        // keydown
        window.addEventListener("keydown", (event) => {this.onKeydown(event);});

        SC.initialize({
            client_id: this.CLIENT_ID,
            redirect_uri: this.REDIRECT_URI
        });
        this.getTracks();
    } 
}

export default new Player();
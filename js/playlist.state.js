import { State } from "./state.js";
import { default as Player } from "./player.js";

class Playlist extends State {
    constructor() {
        super("playlist", {
            topBarElement: ".bar.bar__top"
        });

        this.state.topBar = [{
            icon: {
                type: "icon-list"
            }
        }, {
            push: "right"
        }, {
            title: "Playlist"
        }, {
            push: "right"
        }, {
            icon: {
                type: "icon-list"
            }
        }];

        this.state.topBar.manually = true;

        this.stream = document.getElementById("stream");
        this.playlist = this.state.querySelector("#playlist");
        this.playlistTopBar = this.state.querySelector(".bar.bar__top");
    }

    /**
     * Playlist generator method
     */
    generate() {
        let html = "";

        this.stream.tracks.forEach((itm, i) => {
            let time = new Date();
            // track time
            time.setTime(itm.duration);

            // template
            html += `<div class="playlist-item ${this.stream.current === i ? "playlist-item__current" : ""}" data-trackindex="${i}">
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
     * Playlist item click handler
     * @param {MouseEvent|TouchEvent} event
     */
    onPlaylistItem(event) {
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

        Player.select(item.getAttribute("data-trackindex"));
    }
    /**
     * Playlist state top bar handler
    */
    onPlaylistBar(event) {
        event.preventDefault();
        this.isOn() ? this.off() : this.on();
    }
    /**
     * Changing current class of playlist item
     */
    onCanPlayThrough() {
        if (!this.isOn()) {
            return;
        }

        try {
            this.playlist.querySelector(".playlist-item__current").classList.remove("playlist-item__current");
        } catch (error) {
            // no any previous setted current class
        } finally {
            this.playlist.querySelectorAll(".playlist-item")[this.stream.current].classList.add("playlist-item__current");
        }
    }
    /**
     * On state instructions
     */
    on() {
        this.generate();
        super.on();
    }

    init() {
        let onTop = true;
        let onBot = false;
        let y = 0;

        // playlist item tap
        this.playlist.applyEvent("click", (event) => {this.onPlaylistItem(event);});
        // playlist top bar tap
        this.playlistTopBar.applyEvent("tap", (event) => {this.onPlaylistBar(event);});

        this.stream.addEventListener("canplaythrough", () => {this.onCanPlayThrough();});
        // render bar to local element before `on` event
        this.topBar.to(this.state.topBar || []);



        //TODO: extract to Utils

        this.playlist.addEventListener("touchstart", (event) => {
            onTop = (this.playlist.scrollTop === 0);
            onBot = (this.playlist.scrollTop + this.playlist.clientHeight === this.playlist.scrollHeight);
            y = event.layerY;
        });

        this.playlist.addEventListener("touchmove", (event) => {
            let movingUp = y < event.layerY;
            let movingDown = y > event.layerY;

            if ((movingUp && onTop) || (movingDown && onBot)) {
                event.preventDefault();
            }
        });
    }
}

export default new Playlist();
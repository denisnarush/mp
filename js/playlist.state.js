import { State } from "./state.js";
import { Player } from "./player.js";

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

        this.stream = document.getElementById("stream");
        this.playlist = this.state.querySelector("#playlist");
        this.playlistTopBar = this.state.querySelector(".bar.bar__top");

        this.init();
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
    onPlaylistBar() {
        this.isOn() ? this.off() : this.on();
    }
    on() {
        this.generate();
        this.state.removeAttribute("off");
    }
    init() {
        // playlist item tap
        this.playlist.applyEvent("click", (event) => {this.onPlaylistItem(event);});
        // playlist top bar tap
        this.playlistTopBar.applyEvent("tap", () => {this.onPlaylistBar();});
        // render bar to local element before `on` event
        this.topBar.to(this.state.topBar || []);
    }
}

export default new Playlist();
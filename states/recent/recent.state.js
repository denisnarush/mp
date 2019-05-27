import { State } from "/modules/state.js";
import { Settings } from "/modules/settings.js";
/**
  * Class representing a Recent State
  * 
  * @author Denis Narush <child.denis@gmail.com>
  * @extends State
 */
export class RecentState extends State {
    /**
     * Recent state constructor
     */
    constructor(options) {
        super("recent", options);
    }
    /**
     * Init
     */
    init() {
        this.elements["container"]  .removeAttribute("hidden");

        this.elements["tbar"]       .doOn("tap", RecentState.onPlaylistBar.bind(this));
        this.elements["container"]  .doOn("transitionend", RecentState.onTransitionEnd.bind(this));

        this.player                 .onMetadataLoaded(RecentState.onMetadataLoaded.bind(this));

        this.generate();
    }
    /**
     * On state closed custom event subsrcibtion
     * @param {Function} fn Callback functions
     */
    onClosed(fn) {
        this.elements["container"].doOn("onstateclosed", fn.bind(this));
    }
    /**
     * Playlist generator method
     */
    generate() {
        let html = "";

        let i = Settings.recent.length;
        while (i--) {
            let itm = Settings.recent[i];

            let time = new Date();
            // track time
            time.setTime(itm.duration);

            // template
            html += `<div class="playlist-item ${this.player.getTrackId() == itm.id ? "playlist-item__current" : ""}" data-trackindex="${i}">
                        <div class="playlist-item-s playlist-item-s__left">
                            <p class="playlist-item-title">${itm.user.username}<span class="playlist-item-author">${itm.title}</span></p>
                        </div>
                        <div class="playlist-item-s playlist-item-s__right">
                            <p class="playlist-item-time">${(time.getUTCHours() ? time.toUTCString().slice(17, 25) : time.toUTCString().slice(20, 25))}</p>
                        </div>
                    </div>`;
        }
        // past to the DOM
        this.elements["list"].innerHTML = html;
    }
    /**
     * Recent state top bar handler
    */
    static onPlaylistBar() {
        this.off();
    }
    /**
     * Recetn state transition end handler
     */
    static onTransitionEnd() {
        // check if state closed to dispatch event
        if (!this.isOn()) {
            this.elements["container"].dispatchEvent(RecentState.onStateClosedEvent);
        }
    }
    /**
     * Player metadata is loaded
     */
    static onMetadataLoaded() {
        this.generate();
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
            this.playlist.querySelector(`[data-trackindex='${this.stream.current}']`).classList.add("playlist-item__current");
        }
    }

    _init() {
        let onTop = true;
        let onBot = false;
        let y = 0;

        // playlist item tap
        this.playlist.doOn("tap", (event) => {this.onPlaylistItem(event);});
        // playlist top bar tap
        this.playlistTopBar.doOn("tap", (event) => {this.onPlaylistBar(event);});

        this.stream.addEventListener("canplaythrough", () => {this.onCanPlayThrough();});
        // render bar to local element before `on` event
        this.topBar.to(this.state.topBar || []);




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

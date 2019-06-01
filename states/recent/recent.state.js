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
        this.elements["list"]       .doOn("tap", RecentState.onListTap.bind(this));

        this.player                 .onMetadataLoaded(RecentState.onMetadataLoaded.bind(this));

        this.generateList();
    }
    /**
     * On state closed custom event subsrcibtion
     * @param {Function} fn Callback function
     */
    onClosed(fn) {
        this.elements["container"]  .doOn("onstateclosed", fn.bind(this));
    }
    /**
     * Playlist generator method
     */
    generateList() {
        let html = "";

        let i = Settings.recent.length;
        while (i--) {
            const item = Settings.recent[i];
            const time = new Date();

            // track time
            time.setTime(item.duration);

            // template
            html += `<div class="playlist-item ${this.player.getTrackId() == item.id ? "playlist-item__current" : ""}" track-id="${item.id}">
                        <div class="playlist-item-s playlist-item-s__left">
                            <p class="playlist-item-title">${item.user.username}<span class="playlist-item-author">${item.title}</span></p>
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
        this.generateList();
    }
    /**
     * @param {TapEvent} evt
     */
    static onListTap(evt) {
        let item = "",
            current = evt.target;

        while(this.elements["list"] !== current) {
            if (current.parentElement === this.elements["list"]) {
                item = current;
            }
            // next step
            current = current.parentElement;
        }

        if (!item) {
            return;
        }

        this.player.getTrackById(item.getAttribute('track-id'));
    }
}

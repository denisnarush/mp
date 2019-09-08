import { State, StateOptionsInterface } from "../../modules/state.js";
import { Player } from "../../modules/player.js";

export class RecentState extends State {
    // Player instance
    private player: Player

    constructor(options: StateOptionsInterface) {
        super(`recent`, options);
    }
    /**
     * Init
     */
    init() {
        this.elements[`container`]  .removeAttribute(`hidden`);

        this.elements[`tbar`]       .doOn(`tap`, this.stateTopBarTap.bind(this));
        this.elements[`container`]  .doOn(`transitionend`, this.onTransitionEnd.bind(this));
        this.elements[`list`]       .doOn(`tap`, this.listTap.bind(this));

        this.player                 .onMetadataLoaded(this.onMetadataLoaded.bind(this));

        this.generateList();

        return this;
    }
    /**
     * On state closed custom event subsrcibtion
     */
    onClosed(fn : () => void) {
        this.elements[`container`]  .doOn(`onstateclosed`, fn.bind(this));
    }
    /**
     * Playlist generator method
     */
    generateList() {
        let html = ``;

        let i = this.player.settings.recent.length;
        while (i--) {
            const item = this.player.settings.recent[i];
            const time = new Date();

            // track time
            time.setTime(item.duration);

            // template
            html += `<div class="playlist-item ${this.player.getTrackId() == item.id ? `playlist-item__current` : ``}" track-id="${item.id}">
                        <div class="playlist-item-s playlist-item-s__left">
                            <p class="playlist-item-title">${item.author}<span class="playlist-item-author">${item.title}</span></p>
                        </div>
                        <div class="playlist-item-s playlist-item-s__right">
                            <p class="playlist-item-time">${(time.getUTCHours() ? time.toUTCString().slice(17, 25) : time.toUTCString().slice(20, 25))}</p>
                        </div>
                    </div>`;
        }
        // past to the DOM
        this.elements[`list`].innerHTML = html;
    }
    /**
     * Recent state top bar handler
    */
    stateTopBarTap() {
        this.off();
    }
    /**
     * Recetn state transition end handler
     */
    onTransitionEnd() {
        // check if state closed to dispatch event
        if (!this.isOn()) {
            this.elements[`container`].dispatchEvent(State.onStateClosedEvent);
        }
    }
    /**
     * Player metadata is loaded
     */
    onMetadataLoaded() {
        this.generateList();
    }
    /**
     * 
     */
    // TODO: add Tap Event
    listTap(event: any) {
        let item,
            current = event.target;

        while(this.elements[`list`] !== current) {
            if (current.parentElement === this.elements[`list`]) {
                item = current;
            }
            // next step
            current = current.parentElement;
        }

        if (!item) {
            return;
        }

        // TODO: implement reciving element from recent list
        // this.player.getTrackById(item.getAttribute('track-id'));
    }
}

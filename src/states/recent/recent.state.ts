import { PLAYER_SETTINGS_RECENT_LIMIT } from "../../environments/environment.js";
import { Player } from "../../modules/player/player.js";
import { State, StateOptionsInterface } from "../../modules/state/state.js";

const styles = [
  `/src/states/recent/recent.state.css`,
  `/src/styles/bar.css`,
  `/src/styles/playlist.css`,
];

export class RecentState extends State {
  /**
   * Init
   */
  public init() {
    this.loadStyles();
    this.elements[`container`].removeAttribute(`hidden`);
    /**
     * State elements handlers
     */
    this.elements[`tbar`].doOn(`tap`, this.stateTopBarTap.bind(this));
    this.elements[`container`].doOn(
      `transitionend`,
      this.onTransitionEnd.bind(this)
    );
    this.elements[`list`].doOn(`tap`, this.listTap.bind(this));

    this.player.onMetadataLoaded(this.onMetadataLoaded.bind(this));

    this.generateList();

    return this;
  }
  /**
   * On state closed custom event subsrcibtion
   */
  public onClosed(fn: () => void) {
    this.elements[`container`].doOn(`onstateclosed`, fn.bind(this));
  }

  public constructor(options: StateOptionsInterface) {
    super(`recent`, { ...options, styles });
  }
  // Player instance
  private player: Player;
  /**
   * Playlist generator method
   */
  private generateList() {
    let html = ``;

    if (this.player.settings.recent.length > PLAYER_SETTINGS_RECENT_LIMIT) {
      this.player.settings = {
        recent: this.player.settings.recent.splice(
          0,
          PLAYER_SETTINGS_RECENT_LIMIT
        ),
      };
    }

    let i = this.player.settings.recent.length;
    while (i--) {
      const item = this.player.settings.recent[i];
      const time = new Date();

      // Track time
      time.setTime(item.duration);

      // Template
      html += `<div class="playlist-item ${
        this.player.getTrackId() === item.id ? `playlist-item__current` : ``
      }" track-id="${item.id}">
                        <div class="playlist-item-s playlist-item-s__left">
                            <p class="playlist-item-title">${
                              item.author
                            }<span class="playlist-item-author">${
        item.title
      }</span></p>
                        </div>
                        <div class="playlist-item-s playlist-item-s__right">
                            <p class="playlist-item-time">${
                              time.getUTCHours()
                                ? time.toUTCString().slice(17, 25)
                                : time.toUTCString().slice(20, 25)
                            }</p>
                        </div>
                    </div>`;
    }
    // Past to the DOM
    this.elements[`list`].innerHTML = html;
  }
  /**
   * List item tap handler
   */
  // TODO: add Tap Event logic on recent list item
  private listTap(event) {
    let item;
    let current = event.target;

    while (this.elements[`list`] !== current) {
      if (current.parentElement === this.elements[`list`]) {
        item = current;
      }
      // Next step
      current = current.parentElement;
    }

    if (!item) {
      return;
    }

    // This.player.getTrackById(item.getAttribute('track-id'));
  }
  /**
   * Player metadata is loaded
   */
  private onMetadataLoaded() {
    this.generateList();
  }
  /**
   * Recetn state transition end handler
   */
  private onTransitionEnd() {
    // Check if state closed to dispatch event
    if (!this.isOn()) {
      this.elements[`container`].dispatchEvent(State.onStateClosedEvent);
    }
  }
  /**
   * Recent state top bar handler
   */
  private stateTopBarTap() {
    this.off();
  }
}

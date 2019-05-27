import "../modules/moti-on.js";

import { PlayerState } from "./states/player/player.state.js";
import { RecentState } from "./states/recent/recent.state.js";
import { Player } from "./modules/player.js";

if ("serviceWorker" in navigator && "nw" in window === false) {
    navigator.serviceWorker.register("service-worker.js");
}
/**
  * Class representing a Main module
  * 
  * @author Denis Narush <child.denis@gmail.com>
 */
class Main {
    constructor() {
        this.player = new Player();
        this.recent = new RecentState({
            player: this.player
        });

        window.addEventListener("keydown", Main.onKeydown.bind(this));
    }

    init() {
        new PlayerState({
            player: this.player,
            recent: this.recent,
            background: document.querySelector("#streamBgArtwork")
        }).init();
    }

    /**
     * Keyboard configuration
     * @param {KeyboardEvent} event 
     */
    static onKeydown(event) {
        switch (event.code) {
        case "Space":
            this.player.togglePlaying();
            break;
        case "ArrowRight":
            this.player.currentTime += 5;
            break;
        case "ArrowLeft":
        this.player.currentTime -= 5;
            break;
        case "ArrowUp":
            this.player.volume += 5;
            break;
        case "ArrowDown":
            this.player.volume -=5;
            break;
        }
    }
}

new Main().init();
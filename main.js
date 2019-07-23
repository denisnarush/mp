import "./modules/moti-on.js";
import { Player } from "./modules/player.js";

import { PlayerState } from "./states/player/player.state.js";
import { RecentState } from "./states/recent/recent.state.js";

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
        this.player = new Player({
            service: "SoundCloud"
        });
        // TODO: use recent state {0}
        // this.recent = new RecentState({
        //     player: this.player
        // });

        const defaultSettings = {
            genres: ["Chillout", "Chill", "Deep House", "Minimal"],
            volume: 1.0,
            limit: 200,
            duration: {
                from: 90000,
                to: 600000
            },
            offset: 0,
            ...this.player.settings
        }

        this.player.volume = defaultSettings.volume;
        this.player.settings = defaultSettings;


        window.addEventListener("keydown", Main.onKeydown.bind(this));
    }

    init() {
        new PlayerState({
            player: this.player,
            // TODO: use recent state {1}
            // recent: this.recent,
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
            this.player.volume += 0.05;
            break;
        case "ArrowDown":
            this.player.volume -=0.05;
            break;
        }
    }
}

new Main().init();
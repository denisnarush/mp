import "./modules/motion.js";
import { Player } from "./modules/player.js";
import { PlayerState } from "./states/player/player.state.js";
import { PlayerServiceEmum } from "./services/player.service.js";
import { RecentState } from "./states/recent/recent.state.js";
import { DEFAULT_PLAYER_SETTINGS } from "./envs/common.js";

if ("serviceWorker" in navigator && "nw" in window === false) {
    navigator.serviceWorker.register("service-worker.js");
}

function onKeydown(event: KeyboardEvent) {
    switch (event.code) {
    case `Space`:
        this.player.togglePlaying();
        break;
    case `ArrowRight`:
        this.player.currentTime += 5;
        break;
    case `ArrowLeft`:
        this.player.currentTime -= 5;
        break;
    case `ArrowUp`:
        this.player.volume += 0.05;
        break;
    case `ArrowDown`:
        this.player.volume -=0.05;
        break;
    }
}

class Main {
    public player: Player;
    public recentState: RecentState;

    constructor() {
        this.player = new Player({
            service: PlayerServiceEmum.SoundCloud
        });

        this.recentState = new RecentState({
            player: this.player
        });

        const defaultSettings = {
            ...DEFAULT_PLAYER_SETTINGS,
            ...this.player.settings
        }

        this.player.settings = defaultSettings;

        window.addEventListener(`keydown`, onKeydown.bind(this));
    }

    public init() {
        new PlayerState({
            player: this.player,
            recentState: this.recentState,
            background: document.querySelector(`#streamBgArtwork`)
        }).init()
    }
}

new Main().init();
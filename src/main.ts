
import { Player } from "./modules/player.js";
import { PlayerState } from "./states/player/player.state.js";
import { PlayerServiceEmum } from "./services/player.service.js";

class Main {
    public player: Player;
    static player: Player;

    constructor() {
        this.player = new Player({
            service: PlayerServiceEmum.SoundCloud
        });

        const defaultSettings = {
            genres: [`Chillout`, `Chill`, `Deep House`, `Minimal`],
            volume: 1.0,
            limit: 200,
            duration: {
                from: 90000,
                to: 600000
            },
            offset: 0,
            ...this.player.settings
        }

        this.player.settings = defaultSettings;

        window.addEventListener(`keydown`, Main.onKeydown.bind(this));
    }

    public init() {
        new PlayerState({
            player: this.player,
            background: document.querySelector(`#streamBgArtwork`)
        }).init()
    }

    static onKeydown(event: KeyboardEvent) {
        switch (event.code) {
        case `Space`:
            // this.player.togglePlaying();
            break;
        case `ArrowRight`:
            // this.player.currentTime += 5;
            break;
        case `ArrowLeft`:
        // this.player.currentTime -= 5;
            break;
        case `ArrowUp`:
            this.player.volume += 0.05;
            break;
        case `ArrowDown`:
            this.player.volume -=0.05;
            break;
        }
    }
}

new Main().init();
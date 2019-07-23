
import { Player } from "./modules/player";
import { PlayerState } from "./states/player/player.state";

class Main {
    public player: Player;

    constructor() {
        this.player = new Player({
            service: "SoundCloud"
        });

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

        this.player.settings = defaultSettings;
    }

    public init() {
        new PlayerState({
            player: this.player,
            background: document.querySelector("#streamBgArtwork")
        }).init()
    }
}

new Main().init();
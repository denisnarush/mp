import "./modules/motion.js";
import { Player } from "./modules/player/player.js";
import { PlayerServiceEmum } from "./services/player.service.js";
import { PlayerState } from "./states/player/player.state.js";
import { RecentState } from "./states/recent/recent.state.js";

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
      this.player.volume -= 0.05;
      break;
  }
}

class Main {
  public player: Player;
  public recentState: RecentState;

  public init() {
    new PlayerState({
      player: this.player,
      recentState: this.recentState,
      background: document.querySelector(`#streamBgArtwork`),
    }).init();
  }

  public constructor() {
    this.player = new Player({
      service: PlayerServiceEmum.SoundCloud,
    });

    this.recentState = new RecentState({
      player: this.player,
    });

    window.addEventListener(`keydown`, onKeydown.bind(this));
    setTimeout(() => {
      this.init();
    }, 100);
  }
}

(() => new Main())();

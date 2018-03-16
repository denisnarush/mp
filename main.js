import { default as Player } from "./js/player.state.js";

Player.init();

if ("serviceWorker" in navigator && "nw" in window === false) {
    navigator.serviceWorker.register("service-worker.js");
}
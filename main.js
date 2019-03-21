import "../modules/moti-on.js";
import { PlayerState } from "./states/player.state.js";

new PlayerState().init();

if ("serviceWorker" in navigator && "nw" in window === false) {
    navigator.serviceWorker.register("service-worker.js");
}
import "../modules/moti-on.js";
import { PlayerState } from "./states/player.state.js";

const MAIN_STATE = new PlayerState();
MAIN_STATE.init();

if ("serviceWorker" in navigator && "nw" in window === false) {
    navigator.serviceWorker.register("service-worker.js");
}
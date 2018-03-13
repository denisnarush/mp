import "./js/player.state.js";
import "./js/playlist.state.js";

if ("serviceWorker" in navigator && "nw" in window === false) {
    navigator.serviceWorker.register("service-worker.js");
}
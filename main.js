import "./js/utils.js";
import "./js/animation.js";
import "./js/player.js";

if ("serviceWorker" in navigator && "nw" in window === false) {
    navigator.serviceWorker.register("service-worker.js");
}
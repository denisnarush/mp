import "./js/animation.js";
import "./js/player.js";
import "./js/equalizer.js";

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js");
}
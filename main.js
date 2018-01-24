/*global nw*/
import "./js/animation.js";
import "./js/player.js";
import "./js/equalizer.js";



if ("serviceWorker" in navigator && nw) {
    navigator.serviceWorker.register("service-worker.js");
}

if (true) {
    import("./js.js").then(function (f) {

    });
}
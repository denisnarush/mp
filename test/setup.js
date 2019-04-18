import "./chai.js";

const container = document.createElement("div");
container.setAttribute("id", "mocha");
document.body.appendChild(container);

mocha.setup("bdd");

/**
 * Clear
 * 1. Removing HTML elemnt of the player
 * 2. Removing localStorage settings
 */
mocha.suite.afterEach(() => {
    const container = document.getElementById("stream");
    // remove player element
    if (container) {
        document.getElementById("stream").remove();
    }
    // clear localStorage
    localStorage.removeItem("settings");
});

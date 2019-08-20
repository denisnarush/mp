import "./../node_modules/chai/chai.js";

const container = document.createElement("div");
container.setAttribute("id", "mocha");
document.body.appendChild(container);

mocha.setup("bdd");
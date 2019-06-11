import { Player } from "./player";

export interface StateElements {
    [key: string]: Element;
}

export interface StateOptions {
    player?: Player;
}

export class State {
    private elements: StateElements = {};

    constructor(name: string, options: StateOptions = {}) {
        let container = document.querySelector(`[data-state="${name}"]`);

        if (!container) {
            container = document.createElement("div");
            container.classList.add("state");
            container.setAttribute("data-state", name);
            container.setAttribute("off", "");
            document.body.appendChild(container);
        }

        Object.assign(this, options);

        this.elements["container"] = container;

        container.querySelectorAll(`[data-element]`).forEach((el) => {
            this.elements[el.getAttribute('data-element')] = el;
        })

    }
}
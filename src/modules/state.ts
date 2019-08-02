import { Player } from "./player.js";

export interface ElementsInterface {
    [key: string]: Element|HTMLElement|HTMLAudioElement;
}

export interface StateOptionsInterface {
    player?: Player;
    background?: HTMLElement;
}

export class State {
    private elements: ElementsInterface = {};

    constructor(name: string, options: StateOptionsInterface = {}) {
        let container = document.querySelector(`[data-state=${name}]`);

        if (!container) {
            container = document.createElement(`div`);
            container.classList.add(`state`);
            container.setAttribute(`data-state`, name);
            container.setAttribute(`off`, ``);
            document.body.appendChild(container);
        }

        Object.assign(this, options);

        this.elements[`container`] = container;

        container.querySelectorAll(`[data-element]`).forEach((el) => {
            this.elements[el.getAttribute('data-element')] = el;
        })

    }
}
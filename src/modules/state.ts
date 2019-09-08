import { Player } from "./player.js";
import { RecentState } from "../states/recent/recent.state.js";

export interface ElementsInterface {
    [key: string]: Element|HTMLElement|HTMLAudioElement;
}

export interface StateOptionsInterface {
    player?: Player;
    recentState?: RecentState;
    background?: HTMLElement;
}

export class State {
    public elements: ElementsInterface = {};

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
    // Events
    static get onStateClosedEvent() { return new CustomEvent("onstateclosed"); }
    /**
     * On
     */
    on() {
        this.elements["container"]  .removeAttribute("off");
    }
    /**
     * Off
     */
    off() {
        this.elements["container"]  .setAttribute("off", "");
    }
    /**
     * Show
     */
    show() {
        this.elements["container"]  .removeAttribute("hide");
    }
    /**
     * Hide
     */
    hide() {
        this.elements["container"]  .setAttribute("hide", "");
    }
    /**
     * isOn
     */
    isOn() {
        return !this.elements["container"].hasAttribute("off");
    }
    /**
     * Init
     */
    init() {
        this.on();
    }
    /**
     * Destroy
     */
    destroy() {
        this.off();
    }
}
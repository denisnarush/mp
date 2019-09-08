import { Player } from "./player.js";
import { RecentState } from "../states/recent/recent.state.js";

export interface ElementsInterface {
    [key: string]: Element|HTMLElement|HTMLAudioElement;
}

export interface StateOptionsInterface {
    player?: Player;
    recentState?: RecentState;
    background?: HTMLElement;
    styles?: string[]
}

export class State {
    public elements: ElementsInterface = {};
    public styles: string[];

    constructor(name: string, options: StateOptionsInterface) {
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
    // Loading styles
    public loadStyles() {
        this.styles = this.styles.map(item => `@import url("${item}");`)

        let loadedStyles: string[] = [];

        document.head.querySelectorAll(`style`).forEach(item => {
            loadedStyles = loadedStyles.concat([item.innerHTML]);
        });

        this.styles
            .filter(item => loadedStyles.indexOf(item) === -1)
            .forEach(item => {
                let styleElement = document.createElement("style");
                styleElement.innerHTML = item;
                document.head.appendChild(styleElement);
            })
    }
    /**
     * On
     */
    public on() {
        this.elements["container"]  .removeAttribute("off");
    }
    /**
     * Off
     */
    public off() {
        this.elements["container"]  .setAttribute("off", "");
    }
    /**
     * Show
     */
    public show() {
        this.elements["container"]  .removeAttribute("hide");
    }
    /**
     * Hide
     */
    public hide() {
        this.elements["container"]  .setAttribute("hide", "");
    }
    /**
     * isOn
     */
    public isOn() {
        return !this.elements["container"].hasAttribute("off");
    }
}
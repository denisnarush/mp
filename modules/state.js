/**
  * Class representing an App State
  * 
  * @author Denis Narush <child.denis@gmail.com>
 */
export class State {
    /**
     * State constructor
     * @param {String} name State's name
     * @param {any} options Options
     */
    constructor(name, options = {}) {
        let container = document.querySelector(`[data-state="${name}"]`);

        if (!container) {
            container = document.createElement("div");
            container.classList.add("state");
            container.setAttribute("data-state", name);
            container.setAttribute("off", "");
            document.body.appendChild(container);
        }

        Object.assign(this, options);

        this.elements = {};
        this.elements["container"] = container;

        container.querySelectorAll(`[data-element]`).forEach((el) => {
            this.elements[el.getAttribute('data-element')] = el;
        })

    }
    /**
     * On state Closed custom event
     */
    static onStateClosedEvent = new CustomEvent("onstateclosed");
    /**
     * On
     */
    on () {
        this.elements["container"].removeAttribute("off");
    }
    /**
     * Off
     */
    off () {
        this.elements["container"].setAttribute("off", "");
    }
    /**
     * Show
     */
    show() {
        this.elements["container"].removeAttribute("hide", "");
    }
    /**
     * Hide
     */
    hide() {
        this.elements["container"].setAttribute("hide", "");
    }
    /**
     * isOn
     */
    isOn () {
        return !this.elements["container"].hasAttribute("off");
    }
    /**
     * Init
     */
    init () {
        this.on();
    }
    /**
     * Destroy
     */
    destroy () {
        this.off();
    }
}

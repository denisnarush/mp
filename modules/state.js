import {Bar} from "./bar.js";

/**
 * State
 */
class State {
    /**
     * 
     * @param {String} name State's name
     * @param {any} options Options
     */
    constructor(name, options = {}) {
        this.state = document.querySelector(`[data-state="${name}"]`);
        if (!this.state) {
            this.state = document.createElement("div");
            this.state.classList.add("state");
            this.state.setAttribute("data-state", name);
            this.state.setAttribute("off", "");
            document.body.appendChild(this.state);
        }

        if (options.topBarElement) {
            this.topBar = new Bar(this.state.querySelector(options.topBarElement));
        }

        this.topBar = this.topBar || new Bar(document.body.querySelector(".bar.bar__top"));
    }

    /**
     * On
     */
    on () {
        if (!this.state.topBar.manually) {
            this.topBar.to(this.state.topBar || []);
        }
        this.state.removeAttribute("off");
    }

    /**
     * Off
     */
    off () {
        this.state.setAttribute("off", "");
    }

    /**
     * isOn
     */
    isOn () {
        return !this.state.hasAttribute("off");
    }

    /**
     * Switches to state by name
     * @param {String} state
     * @param {Objecte} optionsq
     */
    switchTo (state, options) {
        let params = options || {};

        params.init = params.init === undefined ? true : params.init;

        try {
            import(`../states/${state}.state.js`).then((module) => {
                if (params.init) {
                    module.default.init();
                } else {
                    module.default.on();
                }
                this.destroy();
            });
        } catch (Errror) {
            // console.log(`Can't import state ${state}`);
        }
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

/**
 * Export
 */
export { State };
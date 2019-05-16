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
     * On
     */
    on () {
        this.elements["container"].removeAttribute("off");
        this.elements["container"].removeAttribute("hidden");
    }

    /**
     * Off
     */
    off () {
        this.elements["container"].setAttribute("off", "");
    }

    /**
     * isOn
     */
    isOn () {
        return !this.elements["container"].hasAttribute("off");
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

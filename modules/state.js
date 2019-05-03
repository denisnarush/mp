/**
  * Class representing an App State
  * 
  * @author Denis Narush <child.denis@gmail.com>
 */
class State {
    /**
     * State constructor
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

        Object.assign(this, options);

         this.state.querySelectorAll(`[data-element]`).forEach((el) => {
             this.elements = this.elements || {};
             this.elements[el.getAttribute('data-element')] = el;
         })
    }

    /**
     * On
     */
    on () {
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
import {Bar} from "./bar.js";

class State {
    constructor(name, options = {}) {
        this.state = document.querySelector(`[data-state="${name}"]`);

        if (options.topBarElement) {
            this.topBar = new Bar(this.state.querySelector(options.topBarElement));
        }

        this.topBar = this.topBar || new Bar(document.body.querySelector(".bar.bar__top"));
    }

    on () {
        this.topBar.to(this.state.topBar || []);
        this.state.removeAttribute("off");
    }
    off () {
        this.state.setAttribute("off", "");
    }
    isOn () {
        return !this.state.hasAttribute("off");
    }
    switchTo (state) {
        try {
            import(`./${state}.state.js`).then((module) => {
                module.default.on();
                this.destroy();
            });
        } catch (Errror) {
            // console.log(`Can't import state ${state}`);
        }
    }

    init () {
        this.on();
    }

    destroy () {
        this.off();
    }
}

export {State};
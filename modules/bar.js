import "./moti-on.js";

/**
 * Bar
 */
class Bar {
    /**
     * constructor
     * @param {HTMLElement} targer 
     */
    constructor (targer) {
        this.element  = targer;
    }

    /**
     * Html container of elements
     * @param {Array} elements 
     */
    to(elements) {
        let fragment = document.createDocumentFragment();

        elements.forEach((item) => {
            let type = Object.keys(item)[0];
            fragment.appendChild(this[`${type}Element`](item[type]));
        });

        while (this.element.firstChild) {
            this.element.removeChild(this.element.firstChild);
        }

        this.element.appendChild(fragment);
    }

    /**
     * Html element for Icon type
     * @param {Object} options
     */
    iconElement(options) {
        let element = document.createElement("div");
        element.className = "bar-icon";

        if (options.handler) {
            element.doOn("tap", options.handler);
        }

        let icon = document.createElement("i");
        icon.classList = `icon ${options.type}`;

        element.appendChild(icon);
        return element;
    }

    /**
     * Html element for Title type
     * @param {String} value
     */
    titleElement(value) {
        let element = document.createElement("div");
        element.className = "bar-title";
        element.innerHTML = value;
        return element;
    }

    /**
     * Html element for Push type
     * @param {String} direction
     */
    pushElement(direction) {
        let element = document.createElement("div");
        element.className = `bar-push bar-push__${direction}`;
        return element;
    }
}

/**
 * Exeport
 */
export { Bar };
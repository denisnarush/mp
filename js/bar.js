class Bar {
    constructor (targer) {
        this.element  = targer;
    }

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

    iconElement(options) {
        let element = document.createElement("div");
        element.className = "bar-icon";

        if (options.handler) {
            element.applyEvent("tap", options.handler);
        }

        let icon = document.createElement("i");
        icon.classList = `icon ${options.type}`;

        element.appendChild(icon);
        return element;
    }

    titleElement(value) {
        let element = document.createElement("div");
        element.className = "bar-title";
        element.innerHTML = value;
        return element;
    }

    pushElement(direction) {
        let element = document.createElement("div");
        element.className = `bar-push bar-push__${direction}`;
        return element;
    }
}
export {Bar};
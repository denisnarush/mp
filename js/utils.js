export function isMouseEvent () {
    try {
        new MouseEvent("test");
        return true;
    } catch (e) {
        return false;
    }
}

Element.prototype.applyEvent = function (type, listner, title) {
    const element = this;

    if (type == "tap") {
        if (isMouseEvent()) {
            element.addEventListener("click", listner);
        } else {
            // TODO: made changes for working with touch
            element.addEventListener("click", listner);
        }
    } else {
        element.addEventListener(type, listner);
    }

    if (title) {
        element.setAttribute("title", title);
    }

    return element;
};

export function getSearchParameters() {
    function transformToAssocArray( prmstr ) {
        let params = {};
        let prmarr = prmstr.split("&");
        for ( let i = 0; i < prmarr.length; i++) {
            let tmparr = prmarr[i].split("=");
            params[tmparr[0]] = tmparr[1];
        }
        return params;
    }

    const prmstr = window.location.search.substr(1);

    return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

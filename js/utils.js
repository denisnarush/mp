export function isMouseEvent () {
    return !("ontouchstart" in document);
}

Element.prototype.applyEvent = function (type, listner, title) {
    const element = this;

    if (type == "tap") {
        TapEvent(element, listner);
    } else {
        element.addEventListener(type, listner);
    }

    if (title) {
        element.setAttribute("title", title);
    }

    return element;
};


function TapEvent (element, listner) {
    let x, y, t;

    let originalEvent;

    let start = (e) => {
        originalEvent = e;
        x = e.layerX;
        y = e.layerY;
        t = (new Date()).getTime();
    };

    let end = (e) => {
        let d = (new Date()).getTime() - t;

        if (x == e.layerX && y == e.layerY && d < 100) {
            listner(originalEvent);
        }
    };


    if (isMouseEvent()) {
        element.addEventListener("click", listner);
    } else {
        element.addEventListener("touchstart", start);
        element.addEventListener("touchend", end);
    }
}


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

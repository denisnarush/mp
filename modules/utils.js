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

export function isMouseEvent () {
    return !("ontouchstart" in document);
}

export function toURLencoded (element, key, list) {
    list = list || [];
    if (typeof(element) == "object") {
        for (var idx in element)
            toURLencoded(element[idx], key ? key + "[" + idx + "]" : idx, list);
    } else {
        list.push(key + "=" + encodeURIComponent(element));
    }
    return list.join("&");
}

export function request (obj) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();

        obj.method = obj.method || "GET";

        if (obj.method === "GET") {
            obj.url += "?" + toURLencoded(obj.options);
            obj.options = null;
        }

        xhr.open(
            obj.method || "GET",
            obj.url,
            obj.async || true,
            obj.user || null,
            obj.password || null
        );

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.response));
            } else {
                reject(xhr.statusText);
            }
        };
        xhr.onerror = () => reject(xhr.statusText);

        xhr.send(obj.options);
    });
}
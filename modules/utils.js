import { Settings } from "./settings.js";

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

export function assignToPlayedGenre (source) {
    let target = {};
    let src;
    
    if(Settings.played[Settings.genre]) {
        src = Object.assign(Settings.played[Settings.genre], source);
    } else {
        src = source;
    }

    target[Settings.genre] = src;
    Settings.played = Object.assign(Settings.played, target);
}
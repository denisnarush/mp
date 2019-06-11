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

export function Request(obj) {
    let options = {};
    let url = "";

    options.method = obj.method || "GET";

    if (options.method === "GET") {
        url = obj.url + "?" + toURLencoded(obj.options);
    }

    return fetch(url, options).then(response => response.json());
}

export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

export function getRandomStartCharForQuery() {
    const collection = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
        'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
        'u', 'v', 'w', 'x', 'y', 'z'
    ];

    return collection[getRandomInt(0, collection.length)];
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
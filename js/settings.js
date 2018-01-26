const key = "settings";

function get(prop) {
    let settings = JSON.parse(localStorage.getItem(key));

    if (settings === null || prop in settings === false) {
        setDefault();
        return get(prop);
    }

    return settings[prop];
}
function set(prop, value) {
    let settings = JSON.parse(localStorage.getItem(key));

    if (settings === null || prop in settings === false) {
        setDefault();
        return set(prop, value);
    }

    settings[prop] = value;
    localStorage.setItem(key, JSON.stringify(settings));
    return value;
}
function setDefault() {
    const settings = {
        volume: 0.70,
        genre: "chillout"
    };

    localStorage.setItem(key, JSON.stringify(settings));
}

let Settings = {
    get volume () {
        return get("volume");
    },
    set volume (value) {
        return set("volume", value);
    },
    get genre () {
        return get("genre");
    },
    set genre (value) {
        return set("genre", value);
    }
};

export {Settings};
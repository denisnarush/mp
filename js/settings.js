const key = "settings";

function get(prop) {
    let settings = JSON.parse(localStorage.getItem(key));

    if (settings === null) {
        setDefault();
        return get(prop);
    }

    if (prop in settings) {
        return settings[prop];
    }
}
function set(prop, value) {
    let settings = JSON.parse(localStorage.getItem(key));

    if (settings === null) {
        setDefault();
        return set(prop, value);
    }

    if (prop in settings) {
        settings[prop] = value;
        localStorage.setItem(key, JSON.stringify(settings));
        return value;
    }
}
function setDefault() {
    const settings = {
        volume: 0.70
    };

    localStorage.setItem(key, JSON.stringify(settings));
}

let Settings = {
    get volume () {
        return get("volume");
    },
    set volume (value) {
        return set("volume", value);
    }
};

export {Settings};
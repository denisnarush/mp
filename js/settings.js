/**
 * localstorage key
 */
const key = "settings";
/**
 * SoundCloud
 */
const SCKEY = "7172aa9d8184ed052cf6148b4d6b8ae6";
const SCURL = "//api.soundcloud.com";

/**
 * Getter
 * @param {String} prop 
 */
function getter(prop) {
    let settings = JSON.parse(localStorage.getItem(key));

    if (settings === null  || prop in settings === false) {
        setDefault();
        return getter(prop);
    }

    if (!settings[prop]) {
        setDefault();
        return getter(prop);
    }

    return settings[prop];
}

/**
 * Setter
 * @param {String} prop 
 * @param {String || Number} value 
 */
function setter(prop, value) {
    let settings = JSON.parse(localStorage.getItem(key));

    if (settings === null || prop in settings === false) {
        setDefault();
        return setter(prop, value);
    }

    settings[prop] = value;
    localStorage.setItem(key, JSON.stringify(settings));
    return value;
}

/**
 * Default Settings setter
 */
function setDefault() {
    const settings = {
        volume: 0.70,
        limit: 30,
        genre: "chillout"
    };

    localStorage.setItem(key, JSON.stringify(settings));
}

/**
 * Settings object
 */
let Settings = {
    // App
    get volume () {
        return getter("volume");
    },
    set volume (value) {
        return setter("volume", value.toFixed(2) * 1);
    },
    get limit () {
        return getter("limit");
    },
    set limit (value) {
        return setter("limit", value * 1);
    },
    get genre () {
        return getter("genre");
    },
    set genre (value) {
        return setter("genre", value);
    },
    // SoundCloud
    get scKey () {
        return SCKEY;
    },
    set scKey (value) {
        return SCKEY;
    },
    get scURL () {
        return SCURL;
    },
    set scURL (value) {
        return SCURL;
    }
};

export {Settings};
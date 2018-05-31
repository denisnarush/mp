/**
 * localstorage key
 */
const key = "settings";
/**
 * SoundCloud
 */
const SCKEY = "7172aa9d8184ed052cf6148b4d6b8ae6";
const SCURL = ("nw" in window === false ? "//api.soundcloud.com" : "http://api.soundcloud.com");

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

    if (!settings.hasOwnProperty(prop)) {
        setDefault();
        return getter(prop);
    }

    return settings[prop];
}

/**
 * Setter
 * @param {String} prop Poperty to update
 * @param {any} value New value
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
        offset: 0,
        volume: 0.70,
        limit: 9,
        genre: "chillout",
        recent: [],
        ok:[]
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
    // App
    get offset () {
        return getter("offset");
    },
    set offset (value) {
        return setter("offset", value);
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
    get recent () {
        return getter("recent");
    },
    set recent (value) {
        // destroy one if no free index to apply
        if (value.length > Settings.limit) {
            value.pop();
            return Settings.recent = value;
        }
        // apply
        return setter("recent", value);
    },
    get ok () {
        return getter("ok");
    },
    set ok (value) {
        return setter("ok", value);
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

export { Settings };
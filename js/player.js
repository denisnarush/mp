import { Settings } from "./settings.js";
import { getSearchParameters, request } from "./utils.js";

const params = getSearchParameters();

Settings.genre = params.genre || Settings.genre;
Settings.limit = params.limit || Settings.limit;

class Player {
    constructor() {
        this.LIMIT = Settings.limit;
        this.CLIENT_ID = Settings.scKey;
        this.stream = document.getElementById("stream");

        this.stream.volume = Settings.volume;

        // volume change
        this.stream.addEventListener("volumechange", () => {
            this.onVolumeChange();
        });
    }
    /**
     * fetch SoundCloud data
     * @param {String} endpoint 
     * @param {String} params 
     * @param {Function} callback 
     */
    fetch(endpoint, params, callback) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", `//api.soundcloud.com/${endpoint}?client_id=${this.CLIENT_ID}${params}`, true);
        xhr.addEventListener("load", (event) => {
            if (event.currentTarget.status === 200) {
                callback(JSON.parse(event.currentTarget.response));
            } else {
                callback({});
            }
        });
        xhr.send();
    }

    /**
     * Get list of tracks from SoundCloud
     * @param {String} genre 
     */
    getTracks(genre) {
        if (genre && genre.toLocaleLowerCase() === Settings.genre) {
            return;
        }

        let offset = Math.floor(Math.random() * (2000 - 0)) + 0;
        Settings.genre = genre ? genre.toLocaleLowerCase() : Settings.genre;

        request({ url: Settings.scURL + "/tracks", body: {
            client_id: Settings.scKey,
            limit: this.LIMIT,
            genres: genre || Settings.genre,
            offset: offset
        }}).then((tracks) => {
            // this.stream.tracks = tracks;
            this.stream.tracks = tracks;
            // this.stream.current = 0;
            this.stream.current = 0;

            this.start();
        });
    }

    play() {
        if (!this.stream.paused) {
            return;
        }

        const promise = this.stream.play();

        if (promise !== undefined) {
            promise.catch(() => {
                /**
                * iOS 11 play() is a promise.
                */
            });
        }
    }

    start() {
        // important pause!
        this.stop();

        let track = this.stream.tracks[this.stream.current];

        if (!track) {return;}

        // detecting if track was paused
        if (this.stream.currentTime && this.stream.src === track.stream_url + "?client_id=" + this.CLIENT_ID) {
            // and resume
            return this.stream.play();
        }

        let cover;
        let time = new Date();

        // track time
        time.setTime(track.duration);

        // discovering track artwork
        if (track.artwork_url !== null) {
            cover = track.artwork_url.replace(new RegExp("large","g"),"t500x500");
        } else {
            cover = track.user.avatar_url;
        }

        this.stream.track = track;
        this.stream.cover = cover;
        this.stream.src = track.stream_url + "?client_id=" + this.CLIENT_ID;

    }
    stop() {
        setTimeout(() => {this.stream.pause();}, 0);
    }
    next() {
        let last = this.stream.current;

        if (this.stream.shuffled) {
            let i = Math.floor(Math.random() * (this.stream.tracks.length - 0)) + 0;
            ( this.stream.current === i ? this.stream.current++ : this.stream.current = i );
        } else {
            this.stream.current++;
        }

        ( this.stream.current === this.stream.tracks.length ?  this.stream.current = 0 :  this.stream.current );

        if (this.stream.current !== last) {
            this.stream.currentTime = 0;
        }

        this.start();
    }
    prev() {
        let last = this.stream.current;

        if (this.stream.shuffled) {
            let i = Math.floor(Math.random() * (this.stream.tracks.length - 0)) + 0;
            ( this.stream.current === i ? this.stream.current-- : this.stream.current = i );
        } else {
            this.stream.current--;
        }

        ( this.stream.current <= 0 ?  this.stream.current = this.stream.tracks.length - 1 : this.stream.current );

        if (this.stream.current !== last) {
            this.stream.currentTime = 0;
        }

        this.start();
    }
    select(id) {
        if (this.stream.current === id) {
            return;
        }
        this.stream.current = id;
        this.stream.currentTime = 0;
        this.start();
    }
    onVolumeChange() {
        Settings.volume = this.stream.volume;
    }
}

export default new Player();
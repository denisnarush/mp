import {Settings} from "./settings.js";
const protocol = location.protocol === "chrome-extension:" ? "https:" : location.protocol;

class Player {
    constructor() {
        this.LIMIT = Settings.limit;
        this.CLIENT_ID = Settings.scKey;
        this.stream = document.getElementById("stream");
    }
    /**
     * fetch SoundCloud data
     * @param {String} endpoint 
     * @param {String} params 
     * @param {Function} callback 
     */
    fetch(endpoint, params, callback) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", `${protocol}//api.soundcloud.com/${endpoint}?client_id=${this.CLIENT_ID}${params}`, true);
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

        this.fetch("tracks", `&limit=${this.LIMIT}&genres=${genre || Settings.genre}&offset=${offset}`, (tracks) => {
            if(!tracks.length) {
                return this.getTracks("chillout");
            }

            // this.stream.tracks = tracks;
            this.stream.tracks = tracks;
            // this.stream.current = 0;
            this.stream.current = 0;

            this.start();
        });
    }

    start() {
        // important pause!
        this.stream.pause();

        let track = this.stream.tracks[this.stream.current];

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

        
        const promise = this.stream.play();

        if (promise !== undefined) {
            promise.catch(() => {
                /**
                * iOS 11 play() is a promise.
                */
            });
        }
    }
    stop() {
        this.stream.pause();
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
            this.stream.pause();
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
            this.stream.pause();
            this.stream.currentTime = 0;
        }

        this.start();
    }
    select(id) {
        if (this.stream.current === id) {
            return;
        }
        this.stream.current = id;

        this.stream.pause();
        this.stream.currentTime = 0;
        this.start();
    }
}
let instance = new Player();

export {instance as Player};
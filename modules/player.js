import { Settings } from "./settings.js";
import { request, assignToPlayedGenre } from "./utils.js";

const params = {};

Settings.genre = params.genre || Settings.genre;
Settings.limit = params.limit || Settings.limit;


/**
 * Player
 */
class Player {
    /**
     * Constructor
     */
    constructor() {
        this.LIMIT = Settings.limit;
        this.CLIENT_ID = Settings.scKey;

        this.stream = document.getElementById("stream");

        if (!this.stream) {
            const container = document.createElement("audio");
            container.setAttribute("preload", "auto");
            container.volume = Settings.volume;

            // volume change
            container.addEventListener("volumechange", () => {
                this.onVolumeChange();
            });
    
            // can playtrough
            container.addEventListener("canplaythrough", () => {
                this.onCanPlayThrough();
            });
            // can play
            container.addEventListener("canplay", () => {
                this.onCanPlay();
            });

            document.body.appendChild(container);
            this.stream = container;
        }
    }

    /**
     * Get list of tracks from SoundCloud
     * @param {String} [genre=undefined] Tracks genre
     * @return {void} undefined
     */
    getTracks(genre = undefined) {
        // do not set genre twice
        if (genre && genre.toLocaleLowerCase() === Settings.genre) {
            return;
        }

        if (genre) {
            Settings.genre = genre.toLocaleLowerCase();
        }

        // init playing genre in settings
        if (!Settings.played[Settings.genre]) {
            assignToPlayedGenre({
                offset: 50,
                id: []
            });
        }

        let offset = Math.floor(Math.random() * (Settings.played[Settings.genre].offset)) + 1;

        // if track allready founded once
        if (Settings.played[Settings.genre].id.indexOf(offset) !== -1) {
            if (Settings.played[Settings.genre].id.length == 1) {
                assignToPlayedGenre({
                    offset: Settings.played[Settings.genre].offset += Settings.limit
                });
            }
            return this.getTracks();
        }

        // request params
        const params = {
            client_id: Settings.scKey,
            limit: 1,
            genres: Settings.genre,
            offset: offset
        };

        assignToPlayedGenre({
            offset: Settings.played[Settings.genre].offset += Settings.limit
        });

        request({ url: Settings.scURL + "/tracks", options: params})
            .then((tracks) => {
                // response has no tracks
                if (!tracks.length) {
                    return this.getTracks();
                }

                let ids = Settings.played[Settings.genre].id;
                ids.push(params.offset);

                assignToPlayedGenre({
                    id: ids
                });

                // no longer then 7.5 min
                if (tracks[0].duration > Settings.duration) {
                    return this.getTracks();
                }

                let recent = Settings.recent;
                recent.unshift(tracks[0]);
                Settings.recent = recent;

                this.stream.tracks = Settings.recent;
                this.stream.current = 0;

                this.start();
            }, () => {
                return this.getTracks();
            });
    }

    /**
     * Play
     */
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

    /**
     * Start
     */
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

    /**
     * Stop
     */
    stop() {
        setTimeout(() => {this.stream.pause();}, 0);
    }

    /**
     * Next
     */
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

    /**
     * Prev
     */
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

    /**
     * Select
     * @param {Number} id Index of track in list
     */
    select(id) {
        if (this.stream.current === id) {
            return;
        }
        this.stream.current = id;
        this.stream.currentTime = 0;
        this.start();
    }

    /**
     * Volume changed
     */
    onVolumeChange() {
        Settings.volume = this.stream.volume;
    }

    /**
     * Can play handler
     */
    onCanPlay() {
        this.play();
    }

    /**
     * Can play through handler
     */
    onCanPlayThrough() {
        this.play();
    }
}

export default new Player();

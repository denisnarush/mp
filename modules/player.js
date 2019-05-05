import { Settings } from "./settings.js";
import { request, assignToPlayedGenre } from "./utils.js";
/**
  * Class representing a Player
  * 
  * @author Denis Narush <child.denis@gmail.com>
 */
export class Player {
    /**
     * Player constructor
     */
    constructor() {

        this.LIMIT = Settings.limit;
        this.CLIENT_ID = Settings.scKey;

        const container = document.createElement("audio");

        this.stream = container;

        container.setAttribute("preload", "auto");
        container.volume = Settings.volume;

        // volume change
        container.addEventListener("volumechange", () => {
            this.onVolumeChange();
        });

        document.body.appendChild(container);
    }
    /**
     * Get list of tracks from SoundCloud
     */
    getTracks() {
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
            genres: Settings.genre,
            client_id: Settings.scKey,
            offset: offset,
            limit: 1
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

                let track = tracks[0];

                // no longer then 7.5 min
                if (track.duration > Settings.duration) {
                    return this.getTracks();
                }

                // get recent array from Settings
                let recent = Settings.recent;
                // store information about track with only necessary values
                recent.unshift({
                    id: track.id,
                    duration: track.duration,
                    artwork_url: track.artwork_url,
                    stream_url: track.stream_url,
                    title: track.title,
                    genre: track.genre,
                    user: {
                        username: track.user.username,
                        avatar_url: track.user.avatar_url
                    }
                });
                // save modified recent array
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
        if (isNaN(this.stream.duration)) {
            return this.getTracks();
        }

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

        this.stream.track = track;
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
     * Volume changed
     */
    onVolumeChange() {
        Settings.volume = this.stream.volume;
    }



    /**
     * @returns {number} Player volume
     */
    get volume() {
        return this.stream.volume;
    }
    /**
     * @param {number} value Set player volume
     */
    set volume(value) {
        let volume = this.stream.volume * 100 + value;

        if (volume >= 100) {
            volume = 100;
        }
        if (volume <= 0) {
            volume = 0;
        }

        this.stream.volume = volume / 100;
    }
    /**
     * @returns {boolean} Returns true if audio element is HAVE_ENOUGH_DATA
     */
    get isReady() {
        // 4 HAVE_ENOUGH_DATA Enough data is available—and the download rate
        // is high enough—that the media can be played through to the end without interruption.
        return this.stream.readyState === 4;
    }
    /**
     * @returns {number} audio element current time
     */
    get currentTime() {
        return this.stream.currentTime;
    }
    /**
     * @param {number} value Should be as audio element time value
     */
    set currentTime(value) {
        this.stream.currentTime = value;
    }
    getCover() {
        return (this.stream.track.artwork_url ? this.stream.track.artwork_url.replace(new RegExp("large","g"),"t500x500") : this.stream.track.user.avatar_url);
    }
    getTrackTitle() {
        return this.stream.track.title;
    }
    getTrackGenre() {
        return this.stream.track.genre;
    }
    getCurrentTimeString() {
        const time = new Date(this.currentTime * 1000);
        return `${(time.getUTCHours() ? time.toUTCString().slice(17, 25) : time.toUTCString().slice(20, 25))}`;
    }
    getCurrentTimePercent() {
        return `${this.getTrackDuration() ? this.currentTime * 100000 / this.getTrackDuration() : 0}%`;
    }
    getDuration() {
        return this.stream.duration;
    }
    getTrackDuration() {
        return this.stream.track.duration;
    }
    getTrackDurationString() {
        const time = new Date(this.getTrackDuration());
        return `${(time.getUTCHours() ? time.toUTCString().slice(17, 25) : time.toUTCString().slice(20, 25))}`;
    }
    togglePlaying() {
        this.stream.paused ? this.play() : this.stop();
    }
    onProgress(fn) {
        this.stream.addEventListener("progress", fn);
    }
    onLoadStart(fn) {
        this.stream.addEventListener("loadstart", fn);
    }
    onMetadataLoaded(fn) {
        this.stream.addEventListener("loadedmetadata", fn);
    }
    onPlay(fn) {
        this.stream.addEventListener("play", fn);
    }
    onPause(fn) {
        this.stream.addEventListener("pause", fn);
    }
    onEnded(fn) {
        this.stream.addEventListener("ended", fn);
    }
    onTimeUpdate(fn) {
        this.stream.addEventListener("timeupdate", fn);
    }
}

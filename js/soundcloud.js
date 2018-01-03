/* global SC */

(function (SC) {
    if (!SC) {
        return false;
    }

    const actionPlay = document.getElementById("actionPlay");
    const actionPause = document.getElementById("actionPause");
    const actionNext = document.getElementById("actionNext");
    const actionPrev = document.getElementById("actionPrev");
    const actionLoop = document.getElementById("actionLoop");
    const actionShuffle = document.getElementById("actionShuffle");
    
    const streamCurrentTime = document.getElementById("streamCurrentTime");
    const streamBgArtwork = document.getElementById("streamBgArtwork");
    const streamTrackbar = document.getElementById("streamTrackbar");
    const streamArtwork = document.getElementById("streamArtwork");
    const streamGenre = document.getElementById("streamGenre");
    const streamTitle = document.getElementById("streamTitle");

    // default artwork bg
    const DEFAULT_TRACK_COVER = "img/tmp/album-cover.png";
    // SC settings
    const CLIENT_ID = "7172aa9d8184ed052cf6148b4d6b8ae6";
    const REDIRECT_URI = "http://www.player-denisnarush.c9.io";
    // SC search params
    const LIMIT = 30;
    const GENRE = "Chillout";
    // playlist
    const playlist = document.getElementById("playlist");
    playlist.shuffled = false;
    playlist.looped = false;
    // stream
    const stream = document.getElementById("stream");
    stream.volume = 0.75;
    streamBgArtwork.style.backgroundImage = "url('" + DEFAULT_TRACK_COVER + "')";

    // stream ended
    stream.addEventListener("ended", onEnded);
    // stream can play
    stream.addEventListener("canplaythrough", onCanPlayThrough);
    // stream load
    stream.addEventListener("load", onLoad);
    // time update
    stream.addEventListener("timeupdate", onTimeUpdate);
    // play tap
    actionPlay.addEventListener("click", onPLay);
    // pause tap
    actionPause.addEventListener("click", onPause);
    // next tap
    actionNext.addEventListener("click", onNext);
    // prev tap
    actionPrev.addEventListener("click", onPrev);
    // shuffle tap
    actionShuffle.addEventListener("click", onShuffle);
    // repeat tap
    actionLoop.addEventListener("click", onLoop);
    // keydown
    window.addEventListener("keydown", onKeydown);
    // playlist tap
    playlist.addEventListener("click", onPlaylist);

    // init
    SC.initialize({
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI
    });

    getTracks();

    function getTrack (trackID) {
        if (playlist.querySelector(".playlist-item__current")) {
            playlist.querySelector(".playlist-item__current").classList.remove("playlist-item__current");
        }

        SC.get("/tracks/" + trackID).then(function(data) {
            let cover;

            stream.pause();
            // set audio src url to soundcloud stream
            stream.src = data.stream_url + "?client_id=" + CLIENT_ID;
            // track artwork
            if (data.artwork_url !== null) {
                cover = data.artwork_url.replace(new RegExp("large","g"),"t500x500");
            } else {
                cover = DEFAULT_TRACK_COVER;
            }
            
            streamArtwork.src = cover;
            streamBgArtwork.style.backgroundImage = "url('"+cover+"')";
            streamGenre.innerHTML = data.genre;
            streamTitle.innerHTML = data.title;

            playlist.children[playlist.current].classList.toggle("playlist-item__current");
        });
    }

    function getTracks() {
        let offset = Math.floor(Math.random() * (2000 - 0)) + 0;

        // search query
        SC.get("/tracks", {limit: LIMIT, genres: GENRE, offset: offset, client_id: CLIENT_ID,}).then(function(tracks) {

            let html = "",
                i = 0;

            playlist.tracks = tracks;
            playlist.current = 0;
        
            // preload first track
            getTrack(tracks[playlist.current].id);
            // generate playlist
            tracks.forEach(function (itm) {
                let time = new Date();
                // track time
                time.setTime(itm.duration);
                // template
                html += `<div class="playlist-item" data-trackindex="${i++}">
                            <div class="playlist-item-s playlist-item-s__left">
                                <p class="playlist-item-title">${itm.user.username}<span class="playlist-item-author">${itm.title}</span></p>
                            </div>
                            <div class="playlist-item-s playlist-item-s__right">
                                <p class="playlist-item-time">${(time.getUTCHours() ? time.toUTCString().slice(17, 25) : time.toUTCString().slice(20, 25))}</p>
                            </div>
                        </div>`;
            });
            // past to the DOM
            playlist.innerHTML = html;
        });
    }



    /**
     * Play handler
     */
    function onPLay() {
        if(!stream.paused) {
            return;
        }
        stream.play();
        actionPlay.setAttribute("hidden", "");
        actionPause.removeAttribute("hidden");
    }



    /**
     * Pause handler
     */
    function onPause() {
        if(stream.paused) {
            return;
        }
        stream.pause();
        actionPlay.removeAttribute("hidden");
        actionPause.setAttribute("hidden", "");
    }



    /**
     * Next handler
     */
    function onNext() {
        if (playlist.shuffled) {
            let i = Math.floor(Math.random() * (playlist.tracks.length - 0)) + 0;
            ( playlist.current === i ? playlist.current++ : playlist.current = i );
        } else {
            playlist.current++;
        }

        ( playlist.current === playlist.tracks.length ?  playlist.current = 0 :  playlist.current );

        getTrack(playlist.tracks[playlist.current].id);
    }



    /**
     * Prev handler
     */
    function onPrev() {
        if (playlist.shuffled) {
            let i = Math.floor(Math.random() * (playlist.tracks.length - 0)) + 0;
            ( playlist.current === i ? playlist.current-- : playlist.current = i );
        } else {
            playlist.current--;
        }

        ( playlist.current === 0 ?  playlist.current = playlist.tracks.length - 1 : playlist.current );

        getTrack(playlist.tracks[playlist.current].id);
    }



    /**
     * Shuffle handler
     */
    function onShuffle() {
        // turn off loop
        playlist.looped = false;
        actionLoop.style.opacity = 0.5;

        playlist.shuffled = !playlist.shuffled;
        actionShuffle.style.opacity = (playlist.shuffled ? 1 : 0.5);
    }



    /**
     * Loop handler
     */
    function onLoop() {
        // turn off shuffle
        playlist.shuffled = false;
        actionShuffle.style.opacity = 0.5;

        playlist.looped = !playlist.looped;
        actionLoop.style.opacity = (playlist.looped ? 1 : 0.5);
    }



    /**
     * Keyboard handler
     * @param {Event} event 
     */
    function onKeydown(event) {
        switch (event.code) {
        case "Space":
            if(stream.paused) {
                onPLay();
            } else {
                onPause();
            }
            break;
        case "ArrowRight":
            stream.currentTime += 5;
            break;
        case "ArrowLeft":
            stream.currentTime -= 5;
            break;
        case "ArrowUp":
            (stream.volume >= 1 ? stream.volume = 1 : stream.volume += 0.05);
            break;
        case "ArrowDown":
            (stream.volume < 0.05 ? stream.volume = 0.00 : stream.volume -= 0.05);
            break;
        case "KeyR":
            if (event.metaKey || event.ctrlKey) {
                getTracks();
            }
            break;
        }
    }



    /**
     * Playlist handler
     * @param {Event} event 
     */
    function onPlaylist(event) {
        let path = event.path, i = 0;

        while (playlist !== path[i]) {
            i++;
        }
        let item = path[i - 1];

        if (!item) {
            return;
        }

        playlist.current = item.getAttribute("data-trackindex");
        getTrack(playlist.tracks[playlist.current].id);
    }



    /**
     * Stream time update handler
     */
    function onTimeUpdate() {
        let w, time;
        time = new Date(stream.currentTime * 1000);
        // trackbar width
        w = (stream.currentTime * 100 / stream.duration).toFixed(1) + "%";
        // trackbar moving
        streamTrackbar.style.width = w;
        // current track time
        streamCurrentTime.innerHTML = `${(time.getUTCHours() ? time.toUTCString().slice(17, 25) : time.toUTCString().slice(20, 25))}`;
        // playlist item bg with
        // playlist.children[playlist.current].style.backgroundSize = `${w} 100%`;
    }



    /**
     * Stream load handler
     */
    function onLoad() {
        stream.pause();
        stream.play();
    }



    /**
     * Stream can play through handler
     */
    function onCanPlayThrough() {
        if (!stream.paused) {
            actionPlay.setAttribute("hidden", "");
            actionPause.removeAttribute("hidden");
        }
    }



    /**
     * Stream ended handler
     */
    function onEnded() {
        if (playlist.looped) {
            getTrack(playlist.tracks[playlist.current].id);
        } else {
            onNext();
        }
    }
})(SC);
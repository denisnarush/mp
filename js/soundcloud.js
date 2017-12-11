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
    const stream = document.getElementById("stream");

    const playlist = document.getElementById("playlist");

    playlist.shuffled = false;
    playlist.looped = false;

    playlist.addEventListener("click", function (event) {
        let path = event.path,
            i = 0;

        while (playlist !== path[i]) {
            i++;
        }
        let item = path[i - 1],
            trackIndex;

        if (!item) {
            return;
        }

        clean();
        trackIndex = item.getAttribute("data-trackindex");
        playlist.current = trackIndex;

        getTrack(playlist.tracks[playlist.current].id);
    });
    

    var // default artwork bg
        artworkUrl = "img/tmp/album-cover.png",

        // soundcloud id
        CLIENT_ID = "7172aa9d8184ed052cf6148b4d6b8ae6",
        REDIRECT_URI = "http://www.player-denisnarush.c9.io",

        // soundcloud search params
        LIMIT = 30,
        GENRE = "Chillout";



    // init
    SC.initialize({
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI
    });

    stream.volume = 0.75;
    streamBgArtwork.style.backgroundImage = "url('"+artworkUrl+"')";

    stream.addEventListener("canplaythrough", function () {
        if (!stream.paused) {
            actionPlay.setAttribute("hidden", "");
            actionPause.removeAttribute("hidden");
        }
    });

    stream.addEventListener("ended", function () {
        if (playlist.looped){
            getTrack(playlist.tracks[playlist.current].id);
        } else {
            onNext();
        }
    });

    stream.addEventListener("load", function () {
        stream.pause();
        stream.play();
    });


    stream.addEventListener("timeupdate", function () {
        var s, w;

        w = (stream.currentTime*100/stream.duration).toFixed(1)+ "%";
        // trackbar moving
        streamTrackbar.style.width = w;

        // sec
        s = (stream.currentTime % 60).toString().split(".")[0];

        // append 0 if number lower than 10 (00-09)
        s = (s < 10 ? "0"+s : s);

        // current track time
        streamCurrentTime.innerHTML = (stream.currentTime / 60).toString().split(".")[0] + "."+ s;

        playlist.children[playlist.current].style.backgroundSize = `${w} 100%`;
    });
    
    getTracks();

    function getTrack (trackID) {
        SC.get("/tracks/" + trackID).then(function(data){
    
            stream.pause();
            // set src url to soundcloud stream
            stream.src = data.stream_url + "?client_id=" + CLIENT_ID;
    
            if (data.artwork_url !== null) {
                artworkUrl = data.artwork_url.replace(new RegExp("large","g"),"t500x500");
            } else {
                artworkUrl = "https://s-media-cache-ak0.pinimg.com/736x/18/82/0d/18820da64d8732ca79f9161157549b0b.jpg";
            }
            
            streamArtwork.src = artworkUrl;
            streamBgArtwork.style.backgroundImage = "url('"+artworkUrl+"')";
            streamGenre.innerHTML = data.genre;
            streamTitle.innerHTML = data.title;

            playlist.children[playlist.current].classList.toggle("playlist-item__current");
        });
    }

    window.getTrack = getTrack;

    function getTracks(){
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
                var time = new Date();
                time.setTime(itm.duration);

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

    function clean(){
        playlist.children[playlist.current].style.backgroundSize = "";
        playlist.children[playlist.current].classList.remove("playlist-item__current");
    }


    function onPLay(){
        if(!stream.paused){
            return;
        }
        stream.play();
        actionPlay.setAttribute("hidden", "");
        actionPause.removeAttribute("hidden");
    }



    function onPause(){
        if(stream.paused){
            return;
        }
        stream.pause();
        actionPlay.removeAttribute("hidden");
        actionPause.setAttribute("hidden", "");
    }



    function onNext(){
        clean();

        if (playlist.shuffled) {
            let i = Math.floor(Math.random() * (playlist.tracks.length - 0)) + 0;
            ( playlist.current === i ? playlist.current++ : playlist.current = i );
        } else {
            playlist.current++;
        }

        ( playlist.current === playlist.tracks.length ?  playlist.current = 0 :  playlist.current );

        getTrack(playlist.tracks[playlist.current].id);
    }



    function onPrev(){
        clean();

        if (playlist.shuffled) {
            let i = Math.floor(Math.random() * (playlist.tracks.length - 0)) + 0;
            ( playlist.current === i ? playlist.current-- : playlist.current = i );
        } else {
            playlist.current--;
        }

        ( playlist.current === 0 ?  playlist.current = playlist.tracks.length - 1 : playlist.current );

        getTrack(playlist.tracks[playlist.current].id);
    }



    function onShuffle(){
        // turn off loop
        playlist.looped = false;
        actionLoop.style.opacity = 0.5;

        playlist.shuffled = !playlist.shuffled;
        actionShuffle.style.opacity = (playlist.shuffled ? 1 : 0.5);
    }



    function onLoop(){
        // turn off shuffle
        playlist.shuffled = false;
        actionShuffle.style.opacity = 0.5;

        playlist.looped = !playlist.looped;
        actionLoop.style.opacity = (playlist.looped ? 1 : 0.5);
    }


    // play tap
    actionPlay.addEventListener("click", onPLay);
    //



    // pause tap
    actionPause.addEventListener("click", onPause);
    //



    // next tap
    actionNext.addEventListener("click", onNext);
    //



    // prev tap
    actionPrev.addEventListener("click", onPrev);
    //



    // shuffle tap
    actionShuffle.addEventListener("click", onShuffle);
    //



    // repeat tap
    actionLoop.addEventListener("click", onLoop);
    //

    window.addEventListener("keydown", function (event) {
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
    });

})(SC);
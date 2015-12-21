(function (SC) {
	if (!SC) {
		return false;
	}

	var stream = document.getElementById('stream'),
		// default artwork bg
		artworkUrl = '/img/tmp/album-cover.png',

		// soundcloud id
		CLIENT_ID = '7172aa9d8184ed052cf6148b4d6b8ae6',

		// soundcloud search params
		OFFSET = Math.floor(Math.random() * (5000 - 0)) + 0,
		LIMIT = 30,
		GENRE = 'Chillout';



	// init
	SC.initialize({
	  client_id: CLIENT_ID,
	  redirect_uri: 'http://www.player-denisnarush.c9.io'
	});



	stream.addEventListener('canplaythrough', function () {
		stream.play();
		actionPlay.setAttribute('hidden', "");
		actionPause.removeAttribute('hidden');
	})



	stream.addEventListener('timeupdate', function () {
		var t,s;

		// trackbar moving
		streamTrackbar.style.width = (stream.currentTime*100/stream.duration).toFixed(1)+ '%';

		// sec
		s = (stream.currentTime % 60).toString().split('.')[0];

		// append 0 if number lower than 10 (00-09)
		s = (s < 10 ? '0'+s : s);

		// current track time
		streamCurrentTime.innerHTML = (stream.currentTime / 60).toString().split('.')[0] + '.'+ s;
	})

	streamBgArtwork.style.backgroundImage = "url('"+artworkUrl+"')";

	function getTrack (trackID) {
		SC.get('/tracks/' + trackID).then(function(data){

			// set src url to soundcloud stream
			stream.src = data.stream_url + '?client_id=' + CLIENT_ID;

			if (data.artwork_url !== null) {
				artworkUrl = data.artwork_url.replace(new RegExp("large",'g'),"t500x500");
			} else {
				artworkUrl = 'https://s-media-cache-ak0.pinimg.com/736x/18/82/0d/18820da64d8732ca79f9161157549b0b.jpg';
			}

			streamArtwork.src = artworkUrl;
			streamBgArtwork.style.backgroundImage = "url('"+artworkUrl+"')";
			streamGenre.innerHTML = data.genre;
			streamTitle.innerHTML = data.title;

			stream.play();
		});
	}


	window.getTrack = getTrack; // REMOVE!!!!



	// search query
	SC.get('/tracks', {limit: LIMIT, tags: GENRE, offset: OFFSET, client_id: CLIENT_ID,}).then(function(tracks) {

		var html = '';



		// preload first track
		getTrack(tracks[0].id);



		// generate playlist
		tracks.forEach(function (itm, i, tracks) {
			var time = new Date();
			time.setTime(itm.duration);
			html += '';
			html += '<div class="playlist-item"  data-trackid="'+itm.id+'" onclick="getTrack('+itm.id+')" ontouchstart="getTrack('+itm.id+')">';
				html += '<div class="playlist-item-s playlist-item-s__left">';
					html += '<p class="playlist-item-title">'+itm.user.username+'<span class="playlist-item-author">'+itm.title+'</span></p>';
				html += '</div>';
				html += '<div class="playlist-item-s playlist-item-s__right">';
					html += '<p class="playlist-item-time">'+time.getMinutes()+'.'+(time.getSeconds() < 10 ? '0'+time.getSeconds() : time.getSeconds())+'</p>';
				html += '</div>';
			html += '</div>';
		});



		// past to the DOM
		playlist.innerHTML = html;
	});




	function onPLay(){
		if(!stream.paused){
			return;
		}
		stream.play();
		actionPlay.setAttribute('hidden', '');
		actionPause.removeAttribute('hidden');
	}



	function onPause(){
		if(stream.paused){
			return;
		}
		stream.pause();
		actionPlay.removeAttribute('hidden');
		actionPause.setAttribute('hidden', '');
	}



	// play tap
	actionPlay.addEventListener('touchstart', onPLay);
	actionPlay.addEventListener('click', onPLay);



	// pause tap
	actionPause.addEventListener('touchstart', onPause);
	actionPause.addEventListener('click', onPause);



	// next tap
	//
	//



	// prev tap
	//
	//



	// shuffle tap
	//
	//



	// repeat tap
	//
	//



})(SC);
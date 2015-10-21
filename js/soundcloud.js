(function (SC, trackID) {
	if (!SC) {
		return false;
	}

	var stream,
		track;

	SC.initialize({
	  client_id: '7172aa9d8184ed052cf6148b4d6b8ae6'
	});

	SC.get('/tracks/' + trackID).then(function(data){
		track = data;
		window.track = data;
		var artworkUrl = track.artwork_url.replace(new RegExp("large",'g'),"t500x500");
		streamArtwork.src = artworkUrl;
		streamBgArtwork.style.backgroundImage = "url('"+track.artwork_url.replace(new RegExp("large",'g'),"t500x500")+"')";
	});
	
	
	SC.stream('/tracks/' + trackID).then(function(player){
		stream = player;
		window.stream = stream;


		stream.on('time', function (e) {
			var p = (stream.currentTime() * 100 / track.duration).toFixed(1);
			streamTrackbar.style.width = p+"%";
		});
	});

	actionPlay.addEventListener('touchstart', function () {
		stream.play();
		actionPlay.setAttribute('hidden', "");
		actionPause.removeAttribute('hidden');
	});

	actionPause.addEventListener('touchstart', function () {
		stream.pause();
		actionPause.setAttribute('hidden', "");
		actionPlay.removeAttribute('hidden');
	});

	actionPlay.addEventListener('click', function () {
		stream.play();
		actionPlay.setAttribute('hidden', "");
		actionPause.removeAttribute('hidden');
	});

	actionPause.addEventListener('click', function () {
		stream.pause();
		actionPause.setAttribute('hidden', "");
		actionPlay.removeAttribute('hidden');
	});
})(SC, 186050953);
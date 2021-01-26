var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '400px',
    width: '100%',
    videoId: 'M7lc1UVf-VE',
    playerVars: { 'autoplay': 0, 'controls': 1 },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}


function onPlayerReady(event) {
  //event.target.playVideo();
}

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.ENDED) {
      console.log('ENDED')
      //player.playVideoAt(0)
  }
}

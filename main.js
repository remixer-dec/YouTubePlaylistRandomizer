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

var app = new Vue({
    'el': '#app',
    'data': {
        'tab': 1,
        'initcfg': function() {
            return  {
                'rng': 3,
                'savePlaylist': true,
                'savePos': true,
                'saveSeed': true,
                'allowRepeat': true,
                'seed': false,
                'playlistURL': '',
                'playlistID': false,
                'pos': 0,
                'lap': 0,
                'videos': 0
            }
        },
        'cfg': false,
        'info': '',
        'infoClass': ''
    },
    'computed': {
        'playlistIDShort': function() {
            return this.playlistID? this.playlistID.slice(0,3) + '..' + this.playlistID.slice(-3) : ''
        }
    },
    'methods': {
        'loadPlaylist': function() {
            this.cfg.playlistID = parsePlaylistID(this.cfg.playlistURL)
            if (!this.cfg.playlistID) {
                this.msg('error', 'Unable to parse playlist ID.')
                this.cfg.playlistURL = ''
                return false
            }
            this.msg('success', 'Playlist ID: '+this.cfg.playlistID)
        },
        'okClicked': function() {
            this.loadPlaylist()
        },
        'msg': function(mclass, message) {
            this.infoClass = 'info' + (mclass ? (' info-' + mclass) : '')
            this.info = message
        },
        'saveConfig': function() {
            localStorage['ytrng-cfg'] = JSON.stringify(this.cfg)
        }
    },
    'mounted': function() {
        if (!lsAvailable()) {
            alert('Local Storage is unavailable! This might be caused by insufficient amount of memory, restricted browser mode, or old browser version. Can\'t save the configuration in current browser.')
        }
        this.cfg = localStorage['ytrng-cfg'] ? JSON.parse(localStorage['ytrng-cfg']) : this.initcfg()
    }
})

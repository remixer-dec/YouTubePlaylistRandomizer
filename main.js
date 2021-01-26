var player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '400px',
        width: '100%',
        videoId: 'M7lc1UVf-VE',
        playerVars: {
            'autoplay': 0,
            'controls': 0
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onYTError
        }
    });
}

function onYTError(e) {
    console.warn(e)
}
function onPlayerReady(event) {
    app.status.playerReady = true
}

function onPlayerStateChange(event) {
    switch (event.data) {
        case YT.PlayerState.ENDED:
            console.log('ENDED')
        break;
        case YT.PlayerState.PLAYING:
            app.status.playlistLoaded = true
        break;
    }
}

var app = new Vue({
    'el': '#app',
    'data': {
        'tab': 1,
        'initcfg': function() {
            return {
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
        'infoClass': '',
        'status': {
            'playerReady': false,
            'playlistLoaded': false
        }
    },
    'computed': {
        'playlistIDShort': function() {
            return this.cfg.playlistID ? this.cfg.playlistID.slice(0, 3) + '..' + this.cfg.playlistID.slice(-3) : ''
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
            this.msg('success', 'Loading...')
            player.loadPlaylist({
                list: this.cfg.playlistID,
                listType: 'playlist'
            })
            setTimeout(function(that) {
                if (!that.status.playlistLoaded && player.getPlayerState() == 5) {
                    that.msg('error', 'Unable to load the playlist. Please check if it\'s public.')
                }
            }, 3000, this)
        },
        'okClicked': function() {
            this.loadPlaylist()
        },
        'editPlaylist': function() {
            player.stopVideo()
            player.clearVideo()
            this.tab = 1
        },
        'msg': function(mclass, message) {
            this.infoClass = 'info' + (mclass ? (' info-' + mclass) : '')
            this.info = message
        },
        'saveConfig': function() {
            var cfg = Object.assign({}, this.cfg)
            cfg.pos = cfg.savePos ? cfg.pos : 0
            cfg.seed = cfg.saveSeed ? cfg.seed : false
            cfg.playlistID = cfg.savePlaylist ? cfg.playlistID : ''
            cfg.playlistURL = cfg.savePlaylist ? cfg.playlistURL : ''
            localStorage['ytrng-cfg'] = JSON.stringify(cfg)
        }
    },
    'watch': {
        'status.playlistLoaded': function(val) {
            if (val == true) {
                this.cfg.videos = player.playerInfo.playlist.length
                this.status.playlistLoaded = false
                this.tab = 2
                player.pauseVideo()
                this.msg('', '')
                this.cfg.seed = this.cfg.seed || Date.now()
                //ready to generate randomized playlist
            }
        }
    },
    'mounted': function() {
        if (!lsAvailable()) {
            alert('Local Storage is unavailable! This might be caused by insufficient amount of memory, restricted browser mode, or old browser version. Can\'t save the configuration in current browser.')
        }
        this.cfg = localStorage['ytrng-cfg'] ? JSON.parse(localStorage['ytrng-cfg']) : this.initcfg()
    }
})

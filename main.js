var player;

function onYouTubeIframeAPIReady() {
    loadPlayer()
}

function loadPlayer() {
    console.log('player loaded')
    if (player) player.destroy()
    player = new YT.Player('player', {
        height: '400px',
        width: '100%',
        videoId: 'M7lc1UVf-VE',
        playerVars: {
            'autoplay': 0,
            'controls': + app.cfg.showControls
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
    if (app.cfg.savePlaylist && app.cfg.playlistID && !app.status.controlsBoxClicked) {
        app.loadPlaylist()
    }
}

function onPlayerStateChange(event) {
    switch (event.data) {
        case YT.PlayerState.ENDED:
            app.playNextVideo()
        break;
        case YT.PlayerState.PLAYING:
                app.status.playlistLoaded = true
        break;
    }
    console.log('playstate', event.data)
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
                'allowRepeat': false,
                'seed': false,
                'playlistURL': '',
                'playlistID': false,
                'pos': 0,
                'lap': 0,
                'videos': 0,
                'showControls': true,
                'darkTheme': window.matchMedia('(prefers-color-scheme: dark)').matches,
            }
        },
        'cfg': false,
        'info': '',
        'infoClass': '',
        'status': {
            'playerReady': false,
            'playlistLoaded': false,
            'controlsBoxClicked': false,
        }
    },
    'playlist': [],
    'computed': {
        'playlistIDShort': function() {
            return this.cfg.playlistID ? this.cfg.playlistID.slice(0, 3) + '..' + this.cfg.playlistID.slice(-3) : ''
        }
    },
    'methods': {
        'loadPlaylist': function() {
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
            this.cfg.playlistID = parsePlaylistID(this.cfg.playlistURL)
            this.cfg.seed = Date.now()
            this.cfg.pos = 0
            this.loadPlaylist()
        },
        'editPlaylist': function() {
            player.stopVideo()
            player.clearVideo()
            this.tab = 1
            this.status.playlistLoaded = false
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
        },
        'randomizePlaylist': function() {
            var prng = RNGS[this.cfg.rng]()
            prng.seed(this.cfg.seed)
            var arrGen = this.cfg.allowRepeat? generateRandomArray : generateUniqueRandomArray
            this.playlist = arrGen(prng.random, this.cfg.videos)
            this.saveConfig()
        },
        'playNextVideo': function() {
            this.cfg.pos += 1
            if (this.cfg.pos == this.cfg.videos) {
                this.cfg.lap += 1
                this.cfg.seed = Date.now()
                this.cfg.pos = 0
                this.randomizePlaylist()
            }
            console.log('saving')
            this.saveConfig()
            player.playVideoAt(this.playlist[this.cfg.pos])
        }
    },
    'watch': {
        'status.playlistLoaded': function(val) {
            if (val == true) {
                this.cfg.videos = player.playerInfo.playlist.length
                this.tab = 2
                player.pauseVideo()
                player.setLoop(true)
                this.msg('', '')
                this.cfg.seed = this.cfg.seed || Date.now()
                this.randomizePlaylist()
                player.playVideoAt(this.playlist[this.cfg.pos])
            }
        },
        'cfg.showControls': function(val) {
            if (this.status.playerReady) {
                this.status.playerReady = false
                this.status.controlsBoxClicked = true
                loadPlayer()
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

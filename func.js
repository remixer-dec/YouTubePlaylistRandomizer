function lsAvailable() {
    try {
        var storage = window['localStorage']
        if (storage.getItem('ytrng-cfg')) {
            return true
        }
        var x = '__storage_test__'
        storage.setItem(x, x)
        storage.removeItem(x)
        return true
    }
    catch(e) {
        return false
    }
}

function parsePlaylistID(str) {
    var match = str.match(/list\=([A-z0-9_\+\-]+)/i)
    return match ? match[1] : false
}

function shuffle(a, rng) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(rng() * (i + 1))
        x = a[i]
        a[i] = a[j]
        a[j] = x
    }
    return a;
}

function generateRandomArray(rng, length) {
    var a = [], al = 0, n = 0
    while (a.length < length) {
        n = randomInt(rng, 0, length-1)
        al = a.length
        while (al >= 1 && a[al-1] == n) {
            n = randomInt(rng, 0, length-1)
        }
        a.push(n)
    }
    return a
}

function generateUniqueRandomArray(rng, length){
    var arange = Array.apply(null, Array(length)).map(function (_, i) {return i})
    var a = shuffle(arange, rng)
    return a
}

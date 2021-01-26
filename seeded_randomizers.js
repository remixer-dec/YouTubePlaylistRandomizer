//https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript/47593316
//by bryc, Antti Kissaniemi

function multiplyWithCarry() {
    var m_w = 123456789
    var m_z = 987654321
    var mask = 0xffffffff

    function seed(i) {
        m_w = (123456789 + i) & mask
        m_z = (987654321 - i) & mask
    }

    function random() {
        m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask
        m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask
        var result = ((m_z << 16) + (m_w & 65535)) >>> 0
        result /= 4294967296
        return result
    }

    return {seed: seed, random: random}
}

function sinBased() {
    var seedState

    function seed(i) {
        seedState = i
    }

    function random() {
        var x = Math.sin(seedState++) * 10000
        return x - Math.floor(x)
    }

    return {seed: seed, random: random}
}

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul#polyfill
if (!Math.imul) Math.imul = function(a, b) {
    var aHi = (a >>> 16) & 0xffff;
    var aLo = a & 0xffff;
    var bHi = (b >>> 16) & 0xffff;
    var bLo = b & 0xffff;
    return ((aLo * bLo) + (((aHi * bLo + aLo * bHi) << 16) >>> 0) | 0);
}


function xmur(str) {
    for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353),
        h = h << 13 | h >>> 19
    return function() {
        h = Math.imul(h ^ h >>> 16, 2246822507)
        h = Math.imul(h ^ h >>> 13, 3266489909)
        return (h ^= h >>> 16) >>> 0
    }
}

function sfc32() {
    var a, b, c, d

    function seed(i) {
        var gen = xmur(i.toString())
        a = gen()
        b = gen()
        c = gen()
        d = gen()
    }

    function random() {
        a >>>= 0
        b >>>= 0
        c >>>= 0
        d >>>= 0
        var t = (a + b) | 0
        a = b ^ b >>> 9
        b = c + (c << 3) | 0
        c = (c << 21 | c >>> 11)
        d = d + 1 | 0
        t = t + d | 0
        c = c + t | 0
        return (t >>> 0) / 4294967296
    }

    return {seed: seed, random: random}
}

function mulberry32() {
    var a

    function seed(i) {
        a = xmur(i.toString())()
    }

    function random() {
        var t = a += 0x6D2B79F5
        t = Math.imul(t ^ t >>> 15, t | 1)
        t ^= t + Math.imul(t ^ t >>> 7, t | 61)
        return ((t ^ t >>> 14) >>> 0) / 4294967296
    }

    return {seed: seed, random: random}
}

function xoshiro128ss() {
    var a,b,c,d

    function seed(i) {
        var gen = xmur(i.toString())
        a = gen()
        b = gen()
        c = gen()
        d = gen()
    }

    function random(i) {
        var t = b << 9, r = a * 5; r = (r << 7 | r >>> 25) * 9;
        c ^= a; d ^= b;
        b ^= c; a ^= d; c ^= t;
        d = d << 11 | d >>> 21;
        return (r >>> 0) / 4294967296;
    }

    return {seed: seed, random: random}
}

function jsf32() {
    var a,b,c,d

    function seed(i) {
        var gen = xmur(i.toString())
        a = gen()
        b = gen()
        c = gen()
        d = gen()
    }

    function random() {
        a |= 0; b |= 0; c |= 0; d |= 0;
        var t = a - (b << 27 | b >>> 5) | 0;
        a = b ^ (c << 17 | c >>> 15);
        b = c + d | 0;
        c = d + t | 0;
        d = a + t | 0;
        return (d >>> 0) / 4294967296;
    }

    return {seed: seed, random: random}
}

function LCG() {
    var s

    function seed(i) {
        s = i
    }

    function random() {
        return (2147483648-1&(s=Math.imul(48271,s)))/2147483648
    }

    return {seed: seed, random: random}
}

function defaultJS() {
    // USE ONLY FOR TESTS
    function seed() {

    }

    return {seed: seed, random: Math.random}
}

var RNGS = [multiplyWithCarry, sinBased, sfc32, mulberry32, xoshiro128ss, jsf32, LCG, defaultJS]

function randomInt(rng, min, max) {
    return Math.floor(rng() * (max - min + 1)) + min;
}

if (typeof module != 'undefined') {
    module.exports = {RNGS: RNGS, randomInt: randomInt}
}

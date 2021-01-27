## YouTube playlist randomizer (shuffler)
Are you tired of listening to the same songs over and over? Is YouTube's default shuffle not good enough for you? Do you want to save randomized playlist for later, keeping the playback history? [This app] (https://remixer-dec.github.io/YouTubePlaylistRandomizer/) was created to deal with these issues.  
  
![Screenshot](https://i.imgur.com/n5eDzU4.png "Screenshot")
### Random
This randomizer dones't rely on Math.random, and it uses a few different [seed-based pseudoRandom generators](https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript/47593316 "seed-based pseudoRandom generators").  
Is up to you, if you want to keep the seed (and the count of generated numbers) or generate it based on current time. You can also specify if duplicates are allowed in the playlist. The seed is reset when you add a playlist or when you reach the full length of the playlist.  
  
### Privacy
After googling a few different implementations of playlist randomizers, I noticed that they either communicate to thrid-party servers or leak their api keys. This implementation uses Google's [iFrame Player API](https://developers.google.com/youtube/iframe_api_reference "iFrame Player API"). So you're only communicating with YouTube directly. All the configuration data is stored locally in your browser.  
  
### Compatibility
This app was written using ES5 + Vue, so you could run it even in Internet Explorer 10. Mobile devices are also supported.  

### Building
You don't need to build anything. All you need is a static content server.  
  
(c) 2021 Remixer Dec | Source code license: [CC-BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
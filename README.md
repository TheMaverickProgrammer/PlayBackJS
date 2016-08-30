# PlayBackJS
> Given a spritesheet url or Image object, playback an animation

# Features
- Play, pause, and stop supported
- Supply frame sequence as an array
- Control playback delay
- Stand alone javascript plugin - does not need jQuery to work

## Usage
- Download and install by dropping the ```/PlayBackJS``` in your project's javascript directory
- Include the script in your HTML headers e.g. ```<script src="js/PlayBackJS/playback.js"></script>```
- Provide an html canvas to render the animation onto e.g. ```<canvas id="playbackCanvas"></canvas>```
- Call the constructor
```javascript
  var playback = new PlayBack({
    imgSrc: "http://mysite.com/img/spritesheet.png",
    target: "playbackCanvas",
    blockWidth: 32,
    blockHeight 32,
    delay: 100
  });

  playback.play();
```

Optionally bind actions to control buttons:

```javascript
  $('#btnPlaybackPlay').on('click',  () => playback.play());
  $('#btnPlaybackPause').on('click', () => playback.pause());
  $('#btnPlaybackStop').on('click',  () => playback.stop());
```

## Contribute
Contributions are always welcome! Discovered a bug? Have an idea? File a [new issue](https://github.com/TheMaverickProgrammer/PlayBackJS/issues) on github.

## Donations
If you found this project useful, kindly donate to my bitcoin address: ```16Nvuh4zjD4kmdnLtR12jkK3NkYReJJB1G```

## License

![MIT](https://dl.dropbox.com/s/dmnb84n9s6sn55e/mit.png)

# PlayBackJS
> Given a spritesheet url or Image object, playback an animation

v0.0.2

# Features
- Play, pause, and stop supported
- Supply frame sequence as an array
- Control playback delay
- utility functions for mapping cursor position to frames
- Stand alone javascript plugin - does not need jQuery to work
- **View the source for more features**

## Usage
- Download and install by dropping the ```/PlayBackJS``` in your project's javascript directory
- Include the script in your HTML headers e.g.

  ```<script src="js/PlayBackJS/playback.js"></script>```
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

## Events
With jQuery included, a custom ```draw``` event will emit from the target canvas
referenced by the required ```target``` options property in the constructor.

```javascript
  var playback = new PlayBack({..., target: "playbackCanvas", ...});
  playback.play();

  ...

  // Example: display the animation's current frame on the web page
  $("#playbackCanvas").on('draw', (e) => { $("#frameCounterLabel").html(e.frame); });
```

Alternatively, if jQuery is not supplied, use the custom subscribe event function
found in the ```utils``` class utility object to catch all published draw events.

```javascript
  var playback = new PlayBack({..., target: "playbackCanvas", ...});
  playback.play();

  ...

  playback.utils.subscribeToDrawEvent((frame) => { $("#frameCounterLabel").html(frame); });
```

## Redraw
When changing properties to the playback object, you'll need to update the target
canvas render to reflect those new changes. For instance, changing the desired
animation frames does not automatically force a redraw. Do so by simply calling

```
playback.refresh();
```

## Contribute
Contributions are always welcome! Discovered a bug? Have an idea? File a [new issue](https://github.com/TheMaverickProgrammer/PlayBackJS/issues) on github.

## License

![MIT](https://dl.dropbox.com/s/dmnb84n9s6sn55e/mit.png)

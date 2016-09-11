/*****************************
Plugin:      playback.js
Author:      Maverick Peppers
Date:        08/28/2016
Description:
  This plugin makes it easy to create playback animations for spritesheets
  rendered onto a canvas. The animation is a sequence of cells fetched from
  the existing image and are swapped at a speficied rate.
  The cell is a piece of the canvas described by a block width and
  block height. These dimensions reflect the spacing inbetween graphics on a
  spritesheet. By rendering the cells from the canvas quickly, animation is
  achieved.

Options:
  imgSrc - String. URL of the spritesheet image
  imgPtr - Image instance. Uses an existing image as a spritesheet
  frames - Array. Top-left is frame 0 and the bottom-right of the image is the
                  last frame. Only the frame sequence is used in the playback.
                  ex: [0, 1, 2, 2, 2, 3, 4] might be the frames idle animation.
  target - Canvas ID. The canvas which the playback animation is rendered onto
  blockWidth  - Int. width of a single graphic on a spritesheet in pixels
  blockHeight - Int. height of a single graphic on a spritesheet in pixels
  delay       - Float. Milliseconds between one frame and the next

Functions:
  getDelay() - Get the delay in Milliseconds
  setDelay() - Instantly set the delay in Milliseconds
  getCurrentCell() - Get the current cell aka frame
  getCellCount()   - Get the total number of cells aka frames in the sprtiesheet
  play()     - Start the animation from the current cell
  stop()     - Stop the animation. Resets the current cell to the first frame
  pause()    - Pause the animation. Resumes on play() where last left

Usage:
  var playback = new PlayBack({
    imgSrc: "http://mysite.com/img/spritesheet.png",
    target: "playbackCanvas",
    blockWidth: 32,
    blockHeight 32,
    delay: 100
  });

  playback.play();
*****************************/

~function(){
  /**********************************
  CONSTRUCTOR
  **********************************/
  // Dev Note: we use the 'this' keyword so it attaches to the global context
  //           aka the 'window' object...
  this.PlayBack = function() {
    var __class = this; // Self-reference for deeply nested functions

    var targetCanvas = null; // reference to the target canvas element
    var targetContext = null;
    var cellCount = 0;
    var currCell = 0;
    var currFrame = 0;
    var playBackTimer = null;
    var imgObj = null;

    // default Options
    var defaults = {
      imgSrc: "",
      imgPtr: null,
      frames: null,
      target: "",
      blockWidth: 16,
      blockHeight: 16,
      delay: 1000.0 // 1s
    }

    // event listeners
    var listeners = [];

    // extend defaults with arguments to create final Options
    if(arguments[0] && typeof arguments[0] === "object") {
      this.options = extendDefaults(defaults, arguments[0]);
    }

    /********************************
    PRIVATE METHODS
    *********************************/
    var triggerDrawEvent = () => {}; // Pre define
    this.getFrame        = () => {}; // Pre define

    var fetchContext = function() {
      targetCanvas  = document.getElementById(defaults.target);
      targetContext = targetCanvas.getContext('2d');
    }

    var onImageLoad = function() {
      // set canvas equal to spritesheet block size
      targetCanvas.width  = defaults.blockWidth;
      targetCanvas.height = defaults.blockHeight;

      // 1st draw
      redraw();
    }

    var loadImg = function() {
      // If both imgPtr and imgSrc are supplied, use imgPtr
      if(!defaults.imgPtr) {
        imgObj        = new Image;
        imgObj.src    = defaults.imgSrc;
        imgObj.onload = onImageLoad;
      } else {
        imgObj        = defaults.imgPtr;
        onImageLoad();
      }

      // Count total frames
      cellCount = Math.floor(imgObj.width / defaults.blockWidth) * Math.floor(imgObj.height / defaults.blockHeight);
    }

    // returns x and y of the rectangle view to be drawn
    var calcCellRect = function() {
      var cols, row, col;

      // If frames have been supplied by the user, calculate the cell position
      if(Array.isArray(defaults.frames) && defaults.frames.length > 0){
        var index = defaults.frames[currFrame]; // Get the cell from frames
        cols = imgObj.width / defaults.blockWidth;
        row = Math.floor(index / cols);
        col = index % cols;
      } else {
        // Otherwise the cell is based directly off the cell count
        cols = imgObj.width / defaults.blockWidth;
        row = Math.floor(currCell / cols);
        col = currCell % cols;
      }

      // Store in a position object with x and y properties
      var pos = {x: (col * defaults.blockWidth), y: (row * defaults.blockHeight)};
      return pos;
    }

    var redraw = function() {
      // clear & redraw the color buffer for playback
      targetContext.clearRect(0, 0, targetCanvas.width, targetCanvas.height);

      // First 4 argument define the size of the image to draw,
      // Last  4 define the rect part of the image to draw.
      var view = calcCellRect();
      targetContext.drawImage(imgObj,
        view.x, view.y, defaults.blockWidth, defaults.blockHeight,
        0, 0, targetCanvas.width, targetCanvas.height);

      triggerDrawEvent();
    }

    var step = function(amt) {
      // If frames have been supplied by the user, flip through those cells only
      if(Array.isArray(defaults.frames) && defaults.frames.length > 0) {
        if(amt) {
          currFrame += amt;
          if(currFrame < 0) { currFrame = defaults.frames.length + currFrame; }
        } else {
          currFrame++;
        }

        currFrame = currFrame % defaults.frames.length;
      } else {
        // Otherwise, loop through every frame
        if(amt) {
          currCell += amt;
          if(currCell < 0) { currCell = cellCount + currCell; }
        } else {
          currCell++;
        }

        currCell = currCell % cellCount;
      }

      redraw();
    }

    // implement
    triggerDrawEvent = function() {
      if(window.jQuery) {
        // jQuery is loaded
        $(targetCanvas).trigger({
          type: "draw",
          frame: __class.getFrame(),
          time: new Date()
        });

        //console.log("jquery event fired");
      } else {
        // jQuery is not loaded, use the provided listener-subscriber utility
        for(var i = 0; i < listeners.length; i++) {
          listeners[i](__class.getFrame());
        }

        //console.log("listener event fired")
      }

      //console.log("draw event fired from class");
    }

    /********************************
    PRIVLIDGED METHODS
    *********************************/

    this.getDelay = function() {
      return defaults.delay;
    }

    this.setDelay = function(msDelay=1000.0) {
      defaults.delay = msDelay
    }

    // If using frames, return the frame index currFrame
    // If frames have not been supplied, return null
    this.getFrame = function() {
      if(Array.isArray(defaults.frames) && defaults.frames.length > 0) {
        if(currFrame < 0) {
          currFrame = 0;
        }

        return currFrame;
      }

      return null;
    }

    // If using frames, return null
    // If frames have not been supplied, return the cell index currCell
    this.getCell = function () {
      if(!Array.isArray(defaults.frames) || !(defaults.frames.length > 0)) {
        return currCell;
      }

      return null;
    }

    this.getCellCount = function() {
      return cells.length;
    }

    this.getFrameCount = function() {
      if(Array.isArray(defaults.frames) && defaults.frames.length > 0) {
        return defaults.frames.length;
      }

      // Otherwise return -1
      return -1;
    }

    this.getRows = function() {
      return (imgObj.height / defaults.blockHeight) | 0;
    }

    this.getColumns = function() {
      return (imgObj.width / defaults.blockWidth) | 0;
    }

    this.setFrames = function(frames) {
      defaults.frames = frames;

      // if the current frame in the playback is missing, assume the last frame
      if(currFrame > defaults.frames.length - 1) {
        currFrame = defaults.frames.length - 1;
      }
    }

    this.clearFrames = function() {
      defaults.frames = null;
    }

    this.play = function() {
      clearInterval(playBackTimer);
      playBackTimer = setInterval(step, defaults.delay);
    }

    this.stop = function() {
      clearInterval(playBackTimer);
      currCell = 0;
    }

    this.pause = function() {
      clearInterval(playBackTimer);
    }

    this.stepForward = function() {
      // clear the step counter and halt animation
      if(playBackTimer) {
        this.pause();
      }

      step(); // increment frame
    }

    this.stepBackward = function() {
      // clear the step counter and halt animation
      if(playBackTimer) {
        this.pause();
      }

      // force the next frame to count backward
      step(-1);
    }

    this.refresh = function() {
      redraw();
    }

    /***********************************************************
    PUBLIC UTILITY FUNCTIONS
    ***********************************************************/

    this.utils = {
      calcFrameFromPos: function(x, y, scale=1.0) {
        var frame = -1, row = 0, col = 0;

        var row = (y/(defaults.blockHeight*scale)) | 0;
        var col = (x/(defaults.blockWidth*scale))  | 0;
        var numCols = (imgObj.width / defaults.blockWidth) | 0;

        frame = col + (row*numCols);

        return frame;
      },

      calcCellRectFromPos: function(x, y, scale=1.0) {
          var view = {x: 0, y: 0};
          var w = defaults.blockWidth;
          var h = defaults.blockHeight;

          if(w != 0) {
            view.x = (x/(w*scale)) | 0;
            view.x *= w*scale;
          }

          if(h != 0) {
            view.y = (y/(h*scale)) | 0;
            view.y *= h*scale;
          }

          return view;
      },

      // callback functions have the signature (frameIndex) => { }
      subscribeToDrawEvent: function(callback) {
        listeners.push(callback);
      }
    };

    /*********************************
    RETURN READY OBJECT
    **********************************/

    fetchContext();
    loadImg();

    return this;
  }

  /*********************************
  CLASS AUX FUNCTIONS
  *********************************/
  function extendDefaults(source, properties) {
    var property;

    for(property in properties) {
      if(properties.hasOwnProperty(property)) {
        source[property] = properties[property];
      }
    }

    return source; // modified by extension
  }
}(); // invoke

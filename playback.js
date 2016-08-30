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
  getCurrentCell() - Get the current cell
  getCellCount()   - Get the total number of cells aka frames in the sprtiesheet
  play()     - Start the animation from the current cell
  stop()     - Stop the animation. Resets the current cell to the first frame
  pause()    - Pause the animation. Resumes on play() where last left

Usage:
  var playback = new PlayBack({
    imgSrc: "http://mysite.com/img/spritesheet.png",
    target: "#playbackCanvas",
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

    // extend defaults with arguments to create final Options
    if(arguments[0] && typeof arguments[0] === "object") {
      this.options = extendDefaults(defaults, arguments[0]);
    }

    /********************************
    PRIVATE METHODS
    *********************************/
    var fetchContext = function() {
      targetCanvas  = document.getElementById(defaults.target);
      targetContext = targetCanvas.getContext('2d');
    }

    var loadImg = function() {
      // If both imgPtr and imgSrc are supplied, use imgPtr
      if(!defaults.imgPtr) {
        imgObj        = new Image;
        imgObj.src    = defaults.imgSrc;
        imgObj.onload = redraw;
      } else {
        imgObj        = defaults.imgPtr;
        redraw();
      }

      // Count total frames
      cellCount = Math.floor(imgObj.width / defaults.blockWidth) * Math.floor(imgObj.height / defaults.blockHeight);
    }

    // returns x and y of the rectangle view to be drawn
    var calcCellRect = function() {
      var cols, row, col;

      // If frames have been supplied by the user, calculate the cell position
      if(Array.isArray(defaults.frames)){
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
      targetContext.clearRect(0, 0, defaults.blockWidth, defaults.blockHeight);

      // First 4 argument define the size of the image to draw,
      // Last  4 define the rect part of the image to draw.
      var view = calcCellRect();
      targetContext.drawImage(imgObj,
        view.x, view.y, defaults.blockWidth, defaults.blockHeight,
        0, 0, defaults.blockWidth, defaults.blockHeight);
    }

    var step = function() {
      // If frames have been supplied by the user, flip through those cells only
      if(Array.isArray(defaults.frames)) {
        currFrame++;
        currFrame = currFrame % defaults.frames.length;
      } else {
        // Otherwise, loop through every frame
        currCell++;
        currCell = currCell % cellCount;
      }

      redraw();
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

    this.getCurrentCell = function() {
      return currCell;
    }

    this.getCellCount = function() {
      return cells.length;
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

    /*********************************
    RETURN READY OBJECT
    **********************************/

    fetchContext();
    loadImg();

    return this;
  }

  /*********************************
  UTILITY
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

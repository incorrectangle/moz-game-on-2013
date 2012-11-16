/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Sprite.js
 * The base graphical unit in the game. 
 * Copyright (c) 2012 Schell Scivally. All rights reserved.
 * 
 * @author   Schell Scivally 
 * @since    Fri Nov  2 22:59:20 2012
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Sprite',
    dependencies : [ 
        'bang::View/View.js',
        'bang::Geometry/Rectangle.js'
    ],
    /** * *
    * Initializes the Sprite constructor.
    * @param {function():View}
    * * **/
    init : function initSpriteConstructor(View, Rectangle) {
        /** * *
        * Constructs new sprites.
        * @constructor
        * @nosideeffects
        * @extends View
        * @param {number=} x The x coordinate.
        * @param {number=} y The y coordinate.
        * @param {number=} w The width of the sprite.
        * @param {number=} h The height of the sprite.
        * @param {string=} src The source of the sprite sheet.
        * @param {Array.<number>=} frames A list of rectangles specifying the boundary of each frame.
        * @return {Sprite}
        * * **/ 
        function Sprite(x, y, w, h, src, frames) {
            // Forward the first params to View()...
            View.call(this, x, y, w, h);    
            /** * *
            * The source of the sprite sheet.
            * @type {string}
            * * **/
            this.src = src || '';
            /** * *
            * The boundaries of each frame in the sprite's animation.
            * @type {Array.<Rectangle>}
            * * **/
            this.frames = frames || [];
            /** * *
            * A list of objects  of strings->functions to play on a given frame.
            * @type {Array.<Object.<string, function>>}
            * * **/
           this.frameFunctions = this.frameFunctions || [];
            /** * *
            * The loaded sprite sheet.
            * @type {Image}
            * * **/
            this.sheet = new Image();
            var self = this;
            this.sheet.onload = function forwardToSpriteSheetLoad() {
                Sprite.prototype.onSpriteSheetLoad.apply(self, arguments);
            };
            this.sheet.onerror = function forwardToSpriteSheetFail() {
                Sprite.prototype.onSpriteSheetError.apply(self, arguments);
            };
            if (this.src !== '') {
               this.sheet.src = this.src; 
            }            
            /** * *
            * The number of frames that should pass each second.
            * @type {number}
            * * **/
            this.framesPerSecond = 12;
            /** * *
            * The current frame.
            * The first frame is 0.
            * @type {number}
            * * **/
            this.currentFrameIndex = 0;
            /** * *
            * The time at which the last frame was changed.
            * @type {number}
            * * **/
            this.lastFrameTimeStamp = 0;
            /** * *
            * Whether or not the sprite is playing.
            * @type {boolean}
            * * **/
            this.isPlaying = false;
        }  

        Sprite.prototype = new View();
        Sprite.prototype.constructor = Sprite;
        //-----------------------------
        //  METHODS
        //-----------------------------
        /** * *
        * Handles the successful load of the sprite sheet.
        * * **/
        Sprite.prototype.onSpriteSheetLoad = function Sprite_onSpriteSheetLoad() {
            if (this.frames.length === 0) {
                this.frames = [
                    new Rectangle(0,0,this.sheet.width,this.sheet.height)
                ]; 
            }
            this.updateContextWithCurrentFrame();
        };
        /** * *
        * Handles the unsuccesful load of the sprite sheet.
        * * **/
        Sprite.prototype.onSpriteSheetError = function Sprite_onSpriteSheetError() {
        }; 
        /** * *
        * Updates the context with the current frame.
        * * **/
        Sprite.prototype.updateContextWithCurrentFrame = function Sprite_updateContextWithCurrentFrame() {
            var ndx = Math.floor(this.currentFrameIndex);
            var frame = this.frames[ndx];
            var sx = frame.left();
            var sy = frame.top();
            var sw = frame.width();
            var sh = frame.height();
            var dw = this.width;
            var dh = this.height;
            this.context.clearRect(0, 0, dw, dh);
            this.context.drawImage(this.sheet, sx, sy, sw, sh, 0, 0, dw, dh);
        };
        /** * *
        * Returns the number of milliseconds per frame.
        * @return {number}
        * * **/
        Sprite.prototype.calculateMillisecondsPerFrame = function Sprite_calculateMillisecondsPerFrame() {
            return 1000/this.framesPerSecond;
        };
        /** * *
        * Returns the number of frames passed since the given time.
        * @param {number} time The time since the last frame.
        * @return {number}
        * * **/
        Sprite.prototype.numberOfFramesSince = function Sprite_numberOfFramesSince(time) {
            var millis = this.calculateMillisecondsPerFrame();
            var now = Date.now();
            var msElapsed = now - time;
            var frames = msElapsed/millis;
            return frames;
        };
        /** * *
        * Draws this view and its subviews into the given context.
        * @param {CanvasRenderingContext2D}
        * @override
        * * **/
        Sprite.prototype.draw = function View_draw(context) {
            if (this.isPlaying) {
                var framesElapsed = this.numberOfFramesSince(this.lastFrameTimeStamp);
                var nextFrame = framesElapsed + this.currentFrameIndex;
                if (nextFrame >= this.frames.length) {
                    nextFrame = nextFrame % this.frames.length;
                }

                var floorNdx = Math.floor(this.currentFrameIndex);
                if (floorNdx !== Math.floor(nextFrame)) {
                    this.stage.needsDisplay = true;
                }
                this.currentFrameIndex = nextFrame; 
                this.updateContextWithCurrentFrame();
                this.lastFrameTimeStamp = Date.now();

                var ndx = Math.floor(this.currentFrameIndex);
                // Play the frame functions...
                for (var funcName in this.frameFunctions[ndx]) {
                    this.frameFunctions[ndx][funcName]();            
                }
            }
            View.prototype.draw.call(this, context);
        };
        return Sprite;
    }
});

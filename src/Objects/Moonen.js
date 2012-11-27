/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Moonen.js
* A chromatic moonen.
* Copyright (c) 12 Schell Scivally. All rights reserved.
* 
* @author   Schell Scivally 
* @since    Mon Nov 26 16:10:37 2012  
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Moonen',
    dependencies : [ 
        'moon::Objects/Actor.js',
        'bang::Geometry/Rectangle.js',
        'moon::View/Filters.js',
        'moon::Events/Action.js'
    ],
    /** * *
    * Initializes the Moonen constructor.
    * * **/
    init : function initMoonenConstructor(Actor, Rectangle, Filters, Action) {
        /** * *
        * Constructs new Moonens.
        * @constructor
        * @param {String} color A CSS color value.
        * @nosideeffects
        * @return {Moonen}
        * * **/ 
        function Moonen(color) {
            Actor.call(this, 'Moonen', ' - A '+color+' colored moonen.', 'img/tiles.png', new Rectangle(96,160,32,32));

            var colorizeTrick = new Action(function colorize() {
                // Make a reference to the old sheet...
                var sheet = this.view.sheet;
                // Make a new canvas to hold the new data...
                var canvas = document.createElement('canvas');
                canvas.width = sheet.width;
                canvas.height = sheet.height;
                var context = canvas.getContext('2d');
                // Get the pixel value...
                context.fillStyle = color;
                context.fillRect(0,0,1,1);
                var data = context.getImageData(0,0,1,1);
                var pixelColor = Filters.pixelAt(data,0,0);
                context.drawImage(sheet,0,0);
                this.view.sheet = canvas;
                // Run through each frame and update the color...
                for (var i=0; i < this.view.frames.length; i++) {
                    var frame = this.view.frames[i];
                    var imageData = context.getImageData(frame.x(),frame.y(),frame.width(),frame.height());
                    context.putImageData(Filters.mapBitmap(imageData, function colorize(pixel, imageData) {
                        if (pixel.a > 0 && !pixel.isBlack && !pixel.isWhite) {
                            pixel.r = (pixelColor.r + pixel.r);
                            pixel.g = (pixelColor.g + pixel.g);
                            pixel.b = (pixelColor.b + pixel.b);
                        }
                        return pixel;
                    }),frame.x(),frame.y());
                }
                this.view.updateContextWithCurrentFrame();
                document.body.appendChild(canvas);
            }, this);
            this.view.reactor.addAction('onSpriteSheetLoad', colorizeTrick);
        }

        Moonen.prototype = new Actor();
        Moonen.prototype.constructor = Moonen;
        //-----------------------------
        //  METHODS
        //-----------------------------

        return Moonen;
    }
});    

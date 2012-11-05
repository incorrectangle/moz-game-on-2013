/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Map.js
* A tile map. One with square tiles. BOOOYAH! 
* Copyright (c) 12 Schell Scivally. All rights reserved.
* 
* @author   Schell Scivally 
* @since    Sun Nov  4 15:24:26 2012  
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Map',
    dependencies : [ 
        'bang::Geometry/Rectangle.js',
        'bang::View/View.js',
        'moon::View/Sprite.js'
    ],
    /** * *
    * Initializes the Map constructor.
    * * **/
    init : function initMapConstructor(Rectangle, View, Sprite) {
        /** * *
        * Constructs new Maps.
        * @constructor
        * @nosideeffects
        * @extends Sprite
        * @param {number=} x The x coordinate.
        * @param {number=} y The y coordinate.
        * @param {number=} w The width of the map.
        * @param {number=} h The height of the map.
        * @param {string=} src The source of the sprite sheet.
        * @param {Array.<number>=} frames A list of rectangles specifying the boundary of each frame.
        * @param {number} mapW The width of the map in tiles.
        * @param {number} mapH The height of the map in tiles.
        * @param {Array.<number>=} tileMap A list of indices mapping the tile to the frame (map spot -> image).
        * @param {Array.<Object>=} dataMap A list of objects of user data for each tile.
        * @return {Map}
        * * **/ 
        function Map(x, y, w, h, src, frames, mapW, mapH, tileMap, dataMap) {
            // Forward to Sprite...
            Sprite.call(this, x, y, w, h, src, frames);

            /** * *
            * The map width.
            * @type {number}
            * * **/
            this.mapW = mapW || 0;
            /** * *
            * The map height.
            * @type {number}
            * * **/
            this.mapH = mapH || 0;
            /** * *
            * The tile map.
            * @type {Array.<number>}
            * * **/
            this.tileMap = tileMap || [];        
            /** * *
            * The user data map.
            * @type {Array.<number>}
            * * **/
            this.dataMap = tileMap || [];
            /** * *
            * The amount scrolled in x.
            * @type {number}
            * * **/
            this.scrollX = 0;
            /** * *
            * The amount scrolled in y.
            * @type {number}
            * * **/
            this.scrollY = 0;
        }

        Map.prototype = new Sprite(); 
        Map.prototype.constructor = Map;
        //-----------------------------
        //  METHODS
        //-----------------------------
        /** * *
        * @inheritDoc
        * * **/
        Map.prototype.draw = function Map_draw(context) {
            // Maps cannot be played...
            this.isPlaying = false;
            // Clear the internal context...
            this.context.clearRect(0, 0, this.width, this.height);
            
            if (this.frames.length) {
                // Get our measurements...
                var frame = this.frames[0];
                var tileW = frame.width();
                var tileH = frame.height();
                // Get our index boundaries...
                var xstart = this.scrollX/tileW;
                var xsndx = Math.floor(xstart);
                var xend = (this.scrollX + this.width)/tileW;
                var xendx = Math.floor(xend);
                if (xstart !== xsndx) {
                    xendx += 1;
                }
                var ystart = this.scrollY/tileH;
                var ysndx = Math.floor(ystart);
                var yend = (this.scrollY + this.height)/tileH;
                var yendx = Math.floor(yend);
                if (ystart !== ysndx) {
                    yendx += 1;
                }
                // Find the offset...
                var xoff = xsndx - xstart;
                var yoff = ysndx - ystart;
                // Run through and draw...            
                for (var x = 0; x + xsndx < xendx; x++) {
                    // Bounds checking...
                    if (x + xsndx >= this.mapW) { 
                        continue;
                    }
                    for (var y = 0; y + ysndx < yendx; y++) {
                        // Bounds checking...
                        if (y + ysndx >= this.tileMap.length/this.mapW) {
                            continue;
                        }
                        // The current pixel offset at which to draw this tile...
                        var offsetx = (xoff*tileW) + x*tileW;
                        var offsety = (yoff*tileH) + y*tileH;
                        // The actual index of the tile we are drawing...
                        var ndx = (y + ysndx) * this.mapW + (x + xsndx);
                        // The tile map ndx...
                        var tileMapNdx = this.tileMap[ndx];
                        // The frame of our tile...
                        var frame = this.frames[tileMapNdx];
                        this.context.drawImage(this.sheet, frame.left(), frame.top(), frame.width(), frame.height(), offsetx, offsety, tileW, tileH);
                    }
                }
            }

            View.prototype.draw.call(this, context);
        };

        return Map;
    }
});    

/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* MapView.js
* A tiling map for scenery.
* Copyright (c) 12 Schell Scivally. All rights reserved.
* 
* @author   Schell Scivally 
* @since    Wed Nov 21 12:38:36 2012  
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'MapView',
    dependencies : [ 
        'bang::View/View.js'
    ],
    /** * *
    * Initializes the MapView constructor.
    * * **/
    init : function initMapViewConstructor(View) {
        /** * *
        * Constructs new MapViews.
        * @constructor
        * @nosideeffects
        * @return {MapView}
        * * **/ 
        function MapView(x, y, w, h) {
            View.call(this, x, y, w, h);
            /** * *
            * The width of one tile view.
            * @type {number}
            * * **/
            this.tileWidth = 32;
            /** * *
            * The height of one tile view.
            * @type {number}
            * * **/
            this.tileHeight = 32;
            /** * *
            * The number of tiles on the x axis.
            * @type {number}
            * * **/
            this.tilesX = this.tilesX || 16;
            /** * *
            * The number of tiles on the y axis.
            * @type {number}
            * * **/
            this.tilesY = this.tilesY || 16;
            /** * *
            * The tile views. These are used to draw the tiles.
            * @type {Array.<View>}
            * * **/
            this.tiles = [];
        }

        MapView.prototype = new View(); 
        MapView.prototype.constructor = MapView;
        //-----------------------------
        //  METHODS
        //-----------------------------
        /** * *
        * Adds a view as a tile.
        * @param {View} tile The view to add.
        * * **/
        MapView.prototype.addTile = function MapView_addTile(tile) {
            this.tiles.push(tile);
            this.stage.needsDisplay = true;
        }; 
        /** * *
        * Adds a tile index at the given x,y.
        * @param {number} ndx The index of the view that represents this tile.
        * @param {number} x The x location in the map to place the tile.
        * @param {number} y The y location in the map to place the tile.
        * * **/
        MapView.prototype.placeTileNdxAt = function MapView_placeTileNdxAt(ndx, x, y) {
            this.tileNdx[y*this.tilesX + x] = ndx;    
            this.needsDisplay = true;
        };
        /** * *
        * @inheritDoc
        * * **/
        MapView.prototype.draw = function Map_draw(context) {
            // Clear the internal context...
            this.context.clearRect(0, 0, this.width, this.height);
            
            if (this.tiles.length && this.tileNdx.length) {
                // Get our measurements...
                var tileW = this.tileWidth;
                var tileH = this.tileHeight;
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
                for (var y = 0; y + ysndx < yendx; y++) {
                    // Bounds checking...
                    if (y + ysndx >= this.tileNdx.length/this.tilesX) {
                        continue;
                    }
                    for (var x = 0; x + xsndx < xendx; x++) {
                        // Bounds checking...
                        if (x + xsndx >= this.tilesX) { 
                            continue;
                        }
                        // The current pixel offset at which to draw this tile...
                        var offsetx = (xoff*tileW) + x*tileW;
                        var offsety = (yoff*tileH) + y*tileH;
                        // The actual index of the tile we are drawing...
                        var ndx = (y + ysndx) * this.tilesX + (x + xsndx);
                        // The tile view...
                        var tileView = this.tiles[this.tileNdx[ndx]];
                        // Draw!
                        try {
                        this.context.drawImage(tileView.context.canvas, 0, 0, tileView.width, tileView.height, offsetx, offsety, tileView.width, tileView.height);
                        } catch (e) {
                            console.log('aoeusnth');
                        }
                    }
                }
            }
            View.prototype.draw.call(this, context);    
        };
        //-----------------------------
        //  GETTERS/SETTERS
        //-----------------------------
        /** * *
        * 
        * @returns {Array.<View>} tiles 
        * * **/
        /** * *
        * Gets the tileNdx property.
        * The map of tile view indices (in MapView.tiles) to
        * map index. This property tells the map to draw tile
        * n at pos x y.
        * @type {Array.<number>}
        * * **/
        MapView.prototype.__defineGetter__('tileNdx', function MapView_gettileNdx() {
            if (!this._tileNdx) {
                this._tileNdx = [];
                for (var i=0; i < this.tilesX*this.tilesY; i++) {
                    this._tileNdx[i] = 0;
                }
            }
            return this._tileNdx;
        });
        /** * *
        * Gets the scrollX property.
        * The number of pixels scrolled in the x axis. 
        * @returns {number} scrollX 
        * * **/
        MapView.prototype.__defineGetter__('scrollX', function MapView_getscrollX() {
            if (!this._scrollX) {
                this._scrollX = 0;
            }
            return this._scrollX;
        });
        /** * *
        * Sets the scrollX property.
        * Sets the number of pixels scrolled in the x axis. Triggers a redraw.
        * @param {number} 
        * * **/
        MapView.prototype.__defineSetter__('scrollX', function MapView_setscrollX(scrollX) {
            this._scrollX = scrollX;
            this.stage.needsDisplay = true;
        });
        /** * *
        * Gets the scrollY property.
        * The number of pixels scrolled in the y axis. 
        * @returns {number} scrollY 
        * * **/
        MapView.prototype.__defineGetter__('scrollY', function MapView_getscrollY() {
            if (!this._scrollY) {
                this._scrollY = 0;
            }
            return this._scrollY;
        });
        /** * *
        * Sets the scrollY property.
        * Sets the number of pixels scrolled in the y axis. Triggers a redraw.
        * @param {number} 
        * * **/
        MapView.prototype.__defineSetter__('scrollY', function MapView_setscrollY(scrollY) {
            this._scrollY = scrollY;
            this.stage.needsDisplay = true;
        });

        return MapView;
    }
});    

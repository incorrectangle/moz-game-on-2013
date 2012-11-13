/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Filters.js
 * A collection of canvas filters.
 * Copyright (c) 12 Schell Scivally. All rights reserved.
 * 
 * @author   Schell Scivally 
 * @since    Mon Nov  5 11:08:31 2012  
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Filters',
    dependencies : [ 
        
    ],
    /** * *
    * Initializes the Filters constructor.
    * * **/
    init : function initFiltersConstructor() {
        /** * *
        * Constructs new Filterss.
        * @constructor
        * @nosideeffects
        * @return {Filters}
        * * **/ 
        function Filters() {
        }

        Filters.prototype = {}; 
        Filters.prototype.constructor = Filters;
        //-----------------------------
        //  INTERNAL DATA STRUCTURES
        //-----------------------------
        /** * *
        * A pixel data type.
        * @param {number} r The red channel value.
        * @param {number} g The green channel value.
        * @param {number} b The blue channel value.
        * @param {number} a The alpha channel value.
        * * **/
        Filters.Pixel = function Pixel(r, g, b, a) {
            /** * *
            * Red.
            * @type {number}
            * * **/
            this.r = r || 0;
            /** * *
            * Green.
            * @type {number}
            * * **/
            this.g = r || 0;
            /** * *
            * Blue.
            * @type {number}
            * * **/
            this.b = b || 0;
            /** * *
            * Alpha.
            * @type {number}
            * * **/
            this.a = a || 0;
            /** * *
            * The ndx of the red channel value in the Pixel's original ImageData.
            * @type {number}
            * * **/
            this.redChannelNdx = 0;
            /** * *
            * The pixel's index in a one dimensional representation of the pixel data.
            * @type {number}
            * * **/
            this.pixelNdx = 0;
            /** * *
            * The pixel's x coordinate in its parent ImageData.
            * @type {number}
            * * **/
            this.pixelX = 0;
            /** * *
            * The pixel's y coordinate in its parent ImageData.
            * @type {number}
            * * **/
            this.pixelY = 0;
            /** * *
            * The pixel's owning ImageData.
            * @type {ImageData}
            * * **/
            this.imageData = false; 
        };
        Filters.Pixel.prototype = {};
        Filters.prototype.constructor = Filters.Pixel;
        //-----------------------------
        //  STATIC METHODS
        //-----------------------------
        /** * *
        * Returns the pixel at the given x,y coord in the given ImageData.
        * @param {ImageData} imageData
        * @param {number} x
        * @param {number} y
        * * **/
        Filters.pixelAt = function Filters_pixelAt(imageData, x, y) {
            if (x < 0 || x >= imageData.width) {
                return false;
            }
            if (y < 0 || y >= imageData.height) {
                return false;
            }
            var pixelNdx = y * imageData.width + x;
            var redChannelNdx = pixelNdx*4;
            var r = imageData.data[redChannelNdx];
            var g = imageData.data[redChannelNdx + 1];
            var b = imageData.data[redChannelNdx + 2];
            var a = imageData.data[redChannelNdx + 3];
            var pixel = new Filters.Pixel(r, g, b, a);
            pixel.pixelNdx = pixelNdx;
            pixel.redChannelNdx = redChannelNdx;
            pixel.x = x;
            pixel.y = y;
            pixel.imageData = imageData;
            return pixel;
        };
        /** * *
        * Returns the Moore neighborhood of the given Pixel.
        * @param {number=} width The 'radius' of the neighborhood. Default is one (will return immediate neighboors).
        * @return {Array.<Pixel>}
        * * **/
        Filters.getMoore = function Filters_Moore(pixel, width) {
            return [
                Filters.pixelAt(pixel.imageData, pixel.x-width, pixel.y-width),
                Filters.pixelAt(pixel.imageData, pixel.x,       pixel.y-width),
                Filters.pixelAt(pixel.imageData, pixel.x+width, pixel.y-width),
                Filters.pixelAt(pixel.imageData, pixel.x-width, pixel.y),
                Filters.pixelAt(pixel.imageData, pixel.x+width, pixel.y),
                Filters.pixelAt(pixel.imageData, pixel.x-width, pixel.y+width),
                Filters.pixelAt(pixel.imageData, pixel.x,       pixel.y+width),
                Filters.pixelAt(pixel.imageData, pixel.x+width, pixel.y+width)
            ].filter(function(el) {
                // Filters out non-pixels...
                return el;
            });
        }
        /** * *
        * Maps the threshold function over the supplied ImageData and returns a
        * new ImageData representing the results of the threshold mapping.
        * @param {ImageData} input The ImageData to map over.
        * @param {function(Filters.Pixel,array):Filters.Pixel} threshold The threshold function.
        * * **/
        Filters.mapBitmap = function Filters_mapBitmap(input, threshold) {
            var imageData = document.createElement('canvas').getContext('2d').createImageData(input.width, input.height); 
            for (var i=0; i < input.width; i++) {
                for (var j=0; j < input.height; j++) {
                    var pixel = threshold(Filters.pixelAt(input, i, j), input);  
                    imageData.data[pixel.redChannelNdx] = pixel.r;
                    imageData.data[pixel.redChannelNdx + 1] = pixel.g;
                    imageData.data[pixel.redChannelNdx + 2] = pixel.b;
                    imageData.data[pixel.redChannelNdx + 3] = pixel.a;
                }
            }
            return imageData;
        };
        return Filters;
    }
});    

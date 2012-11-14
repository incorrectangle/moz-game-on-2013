/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Toon.js
 * A special sprite
 * Copyright (c) 12 Schell Scivally. All rights reserved.
 * 
 * @author   Schell Scivally 
 * @since    Sat Nov 10 13:56:20 2012  
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Toon',
    dependencies : [ 
        'bang::View/View.js',
        'moon::View/Sprite.js'
    ],
    /** * *
     * Initializes the Toon constructor.
     * * **/
    init : function initToonConstructor(View, Sprite) {
        /** * *
        * Constructs new Toons.
        * @constructor
        * @param {number} x
        * @param {number} y
        * @param {number} w
        * @param {number} h
        * @param {Array.<Sprite>} sprites
        * @nosideeffects
        * @return {Toon}
        * * **/ 
        function Toon(x, y, w, h, sprites) {
           View.call(this, x, y, w, h);

           /** * *
           * An array of sprites that the toon can play.
           * @type {Array.<Sprite>} 
           * * **/
           this.sprites = sprites || [];
           /** * *
           * The index of the sprite that is currently showing.
           * @type {number}
           * * **/
           this.currentSpriteNdx = 0;
        }
        Toon.prototype = new View(); 
        Toon.prototype.constructor = Toon;
        //-----------------------------
        //  METHODS
        //-----------------------------
        /** * *
        * Draws this view and its subviews into the given context.
        * @param {CanvasRenderingContext2D}
        * * **/
        Toon.prototype.draw = function Toon_draw(context) {
            if (this.sprites.length) {
                for (var i=0; i < this.sprites.length; i++) {
                    if (i !== this.currentSpriteNdx && this.displayList.indexOf(this.sprites[i]) !== -1) {
                        this.removeView(this.sprites[i]);        
                    }
                }
                this.addView(this.sprites[this.currentSpriteNdx]);
            }
            View.prototype.draw.call(this, context);
        };
        return Toon;
    }
});    

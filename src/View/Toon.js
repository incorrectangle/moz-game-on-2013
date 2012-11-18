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
            Sprite.call(this, x, y, w, h);

            /** * *
            * The sprites.
            * @type {Array.<Sprite>}
            * * **/
            this.sprites = sprites || [];
            for (var i=0; i < this.sprites.length; i++) {
                this.addView(this.sprites[i]);
            }
            /** * *
            * The index of the sprite that is currently showing.
            * @type {number}
            * * **/
            if (typeof this.__defineGetter__ === 'function') {
                this._spriteNdx = 0;
                this.__defineGetter__('spriteNdx', function getspriteNdx() {
                    return this._spriteNdx;
                });
                this.__defineSetter__('spriteNdx', function setspriteNdx(spriteNdx) {
                    for (var i=0; i < this.sprites.length; i++) {
                        if (i === spriteNdx) {
                            this.sprites[i].isVisible = true;
                        }
                        this.sprites[i].isVisible = false;
                    }
                    this._spriteNdx = spriteNdx;
                });
            } else {
                this.spriteNdx = 0;
            }
        }
        Toon.prototype = new Sprite(); 
        Toon.prototype.constructor = Toon;
        //-----------------------------
        //  METHODS
        //-----------------------------
        /** * *
        * The step function!
        * * **/
        Toon.prototype.step = function Toon_step(context) {
            if (this.sprites.length) {
                for (var i=0; i < this.sprites.length; i++) {
                    if (i !== this.spriteNdx && this.displayList.indexOf(this.sprites[i]) !== -1) {
                        this.removeView(this.sprites[i]);        
                    }
                }
                this.addView(this.sprites[this.spriteNdx]);
            }
        };
        return Toon;
    }
});    

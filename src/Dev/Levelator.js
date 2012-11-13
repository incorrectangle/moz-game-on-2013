/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Levelator.js
 * A level editor.
 * Copyright (c) 12 Schell Scivally. All rights reserved.
 * 
 * @author   Schell Scivally 
 * @since    Sat Nov 10 19:51:15 2012  
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Levelator',
    dependencies : [ 
        'moon::Moonening.js',
        'moon::View/Sprite.js',
        'bang::View/View.js',
        'bang::Geometry/Rectangle.js'
    ],
    /** * *
    * Initializes the Levelator constructor.
    * * **/
    init : function initLevelatorConstructor(Moonening, Sprite, View, Rectangle) {
        /** * *
        * Constructs new Levelators.
        * @constructor
        * @nosideeffects
        * @return {Levelator}
        * * **/ 
        function Levelator() {
            View.call(this,0,0,512,512); 
            /** * *
            * A nice backing.
            * @type {View}
            * * **/
            this.back = new View(0,0,512,512);
            this.back.context.fillStyle = 'rgba(0,0,0,0.5)';
            this.back.context.fillRect(0,0,512,512);
            this.addView(this.back);
            /** * *
            * The tileset.
            * @type {Sprite}
            * * **/ 
            this.tileset = new Sprite(0,0,512,512,'img/tiles.png');
            this.addView(this.tileset);
            /** * *
            * The tile selector.
            * @type {View}
            * * **/
            this.tileSelector = new View(0,0,32,32);
            this.tileSelector.context.strokeStyle = 'rgb(255,0,255)';
            this.tileSelector.context.strokeRect(0,0,32,32);
            this.addView(this.tileSelector);
        }

        Levelator.prototype = new View() 
        Levelator.prototype.constructor = Levelator;
        //-----------------------------
        //  METHODS
        //-----------------------------
        return Levelator;
    }
});    

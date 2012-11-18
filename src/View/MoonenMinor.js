/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * MoonenMinor.js
 * The minor moonen.
 * Copyright (c) 12 Schell Scivally. All rights reserved.
 * 
 * @author   Schell Scivally 
 * @since    Tue Nov 13 20:39:49 2012  
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'MoonenMinor',
    dependencies : [ 
        'bang::View/View.js',
        'moon::View/Character.js',
        'moon::View/Toon.js',
        'moon::View/Sprite.js',
        'bang::Geometry/Rectangle.js'
    ],
    /** * *
    * Initializes the MoonenMinor constructor.
    * * **/
    init : function initMoonenMinorConstructor(View, Character, Toon, Sprite, Rectangle) {
        /** * *
        * Constructs new MoonenMinors.
        * @constructor
        * @nosideeffects
        * @return {MoonenMinor}
        * * **/ 
        function MoonenMinor() {
            var self = this;
            var appearing = new Sprite(0, 0, 32, 32, 'img/tiles.png', [
                new Rectangle(8*32, 5*32, 32, 32),
                new Rectangle(7*32, 5*32, 32, 32),
                new Rectangle(6*32, 5*32, 32, 32),
            ]);
            appearing.framesPerSecond = 8;
            // Make it so that once the last frame of the animation has played, it pauses...
            appearing.frameFunctions = [
                {},
                {},
                {
                    'pause' : function pauseAppearingMoonenMinor() {
                        appearing.isPlaying = false;
                        self.toon.spriteNdx = 1;
                        self.jump();
                    }
                }
            ];
            appearing.isPlaying = false;
            this.appearing = appearing;
            
            var idle = new Sprite(0, 0, 32, 32, 'img/tiles.png', [
                new Rectangle(3*32, 5*32, 32, 32),
                new Rectangle(4*32, 5*32, 32, 32)
            ]);
            idle.framesPerSecond = 4;
            idle.isPlaying = true;
            this.idle = idle;

            var jumping = new Sprite(0, 0, 32, 32, 'img/tiles.png' [
                new Rectangle(5*32, 5*32, 32, 32)
            ]);
            this.jumping = jumping;
            this.toon = new Toon(0, 0, 32, 32, [
                appearing,
                idle,
                jumping
            ]);
            
            Character.apply(this, arguments);

            this.tag = this.tag + '_MoonenMinor';
        }

        MoonenMinor.prototype = new Character(); 
        MoonenMinor.prototype.constructor = MoonenMinor;
        //-----------------------------
        //  METHODS
        //-----------------------------
        MoonenMinor.prototype.jump = function MoonenMinor_jump() {
            this.toon.spriteNdx = 2;
        };

        return MoonenMinor;
    }
});    

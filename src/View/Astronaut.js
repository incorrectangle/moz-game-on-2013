/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Astronaut.js
* The main this!
* Copyright (c) 12 Schell Scivally. All rights reserved.
* 
* @author   Schell Scivally 
* @since    Sat Nov 10 17:13:15 2012  
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Astronaut',
    dependencies : [ 
        'moon::View/Toon.js',
        'bang::Utils/Ease.js',
        'moon::View/Sprite.js',
        'bang::Geometry/Rectangle.js',
        'bang::View/View.js'
    ],
    /** * *
    * Initializes the Astronaut constructor.
    * * **/
    init : function initAstronautConstructor(Toon, Ease, Sprite, Rectangle, View) {
        /** * *
        * Constructs new Astronauts.
        * @constructor
        * @nosideeffects
        * @return {Astronaut}
        * * **/ 
        function Astronaut(x, y) {
            var startX = 1;
            var startY = -12;
            var toon = new Toon(startX, startY, 32,32, [
                new Sprite(0, 0, 32, 32, 'img/tiles.png', [
                    new Rectangle(0, 96+0*32, 32, 32), // 0 - forward
                ]),
                new Sprite(0, 0, 32, 32, 'img/tiles.png', [
                    new Rectangle(0, 96+1*32, 32, 32), // 1 - right
                ]),
                new Sprite(0, 0, 32, 32, 'img/tiles.png', [
                    new Rectangle(0, 96+2*32, 32, 32), // 2 - left
                ]),
                new Sprite(0, 0, 32, 32, 'img/tiles.png', [
                    new Rectangle(0, 96+3*32, 32, 32), // 3 - backward
                ]),
                new Sprite(0, 0, 32, 32, 'img/tiles.png', [
                    new Rectangle(32, 96+0*32, 32, 32), // 4 - forward (spray) 
                ]),
                new Sprite(0, 0, 32, 32, 'img/tiles.png', [
                    new Rectangle(32, 96+1*32, 32, 32), // 5 - right (spray)
                ]),
                new Sprite(0, 0, 32, 32, 'img/tiles.png', [
                    new Rectangle(32, 96+2*32, 32, 32), // 6 - left (spray)
                ]),
                new Sprite(0, 0, 32, 32, 'img/tiles.png', [
                    new Rectangle(32, 96+3*32, 32, 32), // 7 - backward (spray)
                ])
            ]);
            toon.isPlaying = false;
            toon.shadowAlpha = 1;
            /** * *
            * The player's astronaut toon.
            * @type {Toon}
            * * **/
            this.toon = toon;

            var shadow = new View(12,12,8,8);
            shadow.context.fillStyle = 'rgba(0,0,0,0.3)';
            shadow.context.fillRect(0,0,10,8);
            this.shadow = shadow;

            View.call(this,x,y);
            this.context.strokeStyle = 'rgba(255,0,0,0.5)';
            this.context.strokeRect(0,0,32,32);
            this.addView(shadow);
            this.addView(toon);
            this.hover = this.idleHover(startX, startY).interpolate();
        }

            Astronaut.prototype = new View(); 
            Astronaut.prototype.constructor = Astronaut;
            //-----------------------------
            //  METHODS
            //-----------------------------
            Astronaut.prototype.idleHover = function Astronaut_idleHover(startX, startY) {
                var toon = this.toon;
                var shadow = this.shadow;
                startX = startX || 0;
                startY = startY || 0;
                return new Ease({
                    target : toon,
                    duration : 1000,
                    properties : {
                        y : startY-8,
                        shadowAlpha : 0.3,
                    },
                    onComplete : function reverse(hover) {
                        if (toon.y === startY-8) { 
                            hover.config.properties.y = startY;
                            hover.config.properties.shadowAlpha = 1;
                        } else {
                            hover.config.properties.y = startY-8;
                            hover.config.properties.shadowAlpha = 0.3;
                        }
                        hover.interpolate();
                    },
                    onUpdate : function update(hover) {
                        toon.y = Math.round(toon.y);
                        shadow.alpha = toon.shadowAlpha;
                    }
                })
            };
            Astronaut.prototype.quickHover = function Astronaut_idleHover(startX, startY) {
                var toon = this.toon;
                var shadow = this.shadow;
                startX = startX || 0;
                startY = startY || 0;
                return new Ease({
                    target : toon,
                    duration : 1000,
                    properties : {
                        y : startY-8,
                        shadowAlpha : 0.3,
                    },
                    onComplete : function reverse(hover) {
                        if (toon.y === startY-8) { 
                            hover.config.properties.y = startY;
                            hover.config.properties.shadowAlpha = 1;
                        } else {
                            hover.config.properties.y = startY-8;
                            hover.config.properties.shadowAlpha = 0.3;
                        }
                        hover.interpolate();
                    },
                    onUpdate : function update(hover) {
                        toon.y = Math.round(toon.y);
                        shadow.alpha = toon.shadowAlpha;
                    }
                })
            };
            return Astronaut;
    }
});    

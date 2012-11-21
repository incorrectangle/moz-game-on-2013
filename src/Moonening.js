/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Moonening.js
 * The main game object.
 * Copyright (c) 12 Schell Scivally. All rights reserved.
 * 
 * @author   Schell Scivally 
 * @since    Sat Nov 10 19:13:49 2012  
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Moonening',
    dependencies : [ 
        'moon::View/Astronaut.js',
        'moon::View/Map.js',
        'moon::Data/MapData.js',
        'bang::View/View.js',
        'bang::Geometry/Rectangle.js',
        'bang::Utils/Ease.js',
        'bang::Geometry/Vector.js',
        'moon::View/MoonenMinor.js'
    ],
    /** * *
    * Initializes the Moonening constructor.
    * * **/
    init : function initMooneningConstructor(Astronaut, Map, MapData, View, Rectangle, Ease, Vector, MoonenMinor) {
        /** * *
        * Constructs new Moonenings.
        * @constructor
        * @nosideeffects
        * @return {Moonening}
        * * **/ 
        function Moonening() {
                        /** * *
            * The map selector.
            * @type {View}
            * * **/
            this.mapSelector = new View(0,0,32,32);
            this.mapSelector.context.strokeStyle = 'rgba(0, 255, 0, 0.5)';
            this.mapSelector.context.strokeRect(0,0,32,32);
            this.addView(this.mapSelector);
            
            // A badguy
            this.badguy = new MoonenMinor(32,4*32);
            this.addView(this.badguy);

            /** * *
            * The main player character.
            * @type {Astronaut}
            * * **/    
            this.player = new Astronaut(0,4*32);
            this.player.position.x(0);
            this.player.position.y(4);
            this.addView(this.player); 

            /** * *
            * Whether or not the game is suspended.
            * @type {Boolean}
            * * **/
            this.suspended = false;
        }
        Moonening.prototype = new Map(); 
        Moonening.prototype.constructor = Moonening;
        //-----------------------------
        //  METHODS
        //-----------------------------
        /** * *
        * Determines the player position given the request to move to x, y.
        * @param {Vector} p
        * * **/
        Moonening.prototype.determinePlayerPosition = function Moonening_determinePlayerPosition(p) {
            var x = p.x();
            var y = p.y();
            // Make sure the player can't jump more than one square... 
            if (Math.abs(this.player.position.x() - x) > 1 ) {
                return;
            }
            if (Math.abs(this.player.position.y() - y) > 1) {
                return;
            }
            // Make sure the positions are in the map bounds...
            if (x >= this.mapW) {
                return;
            }
            if (y >= this.mapH) {
                return;
            }
            // Make sure the new position isn't in a wall...
            var ndx = y*this.mapW + x;
            var mapData = this.dataMap[ndx];
            if (mapData.isWall) {
                return;
            }
            this.player.position = p;
        };
        /** * *
        * Animates a player moving to a spot.
        * @param {number} x
        * @param {number} y
        * @param {function} callback
        * * **/
        Moonening.prototype.movePlayerTo = function Moonening_movePlayerTo(x, y, callback) {
            var self = this;
            var move = new Ease({
                target : this.player,
                duration : 400,
                equation : Ease.easeInOutCirc,
                properties : {
                    x : x,
                    y : y
                },
                onComplete : function movePlayerToCallback() {
                    callback.call(self);
                }
            }).interpolate();
        };
        /** * *
        * Draws this view and its subviews into the given context.
        * @param {CanvasRenderingContext2D}
        * * **/
        Moonening.prototype.draw = function Moonening_draw(context) {
            if (!this.suspended) {
                // Put the player in the right place...
                var nextXPos = 32*this.player.position.x();
                if (this.player.x !== nextXPos) {
                    this.suspended = true;
                    if (this.player.x < nextXPos) { 
                        this.player.toon.sprites[0].frameNdx = 5;
                    } else {
                        this.player.toon.sprites[0].frameNdx = 6;
                    }
                    this.movePlayerTo(nextXPos, this.player.y, function moveXCallback() {
                        this.suspended = false;
                        this.player.toon.sprites[0].frameNdx -= 4;
                    }); 
                }
                var nextYPos = 32*this.player.position.y();
                if (this.player.y !== nextYPos) {
                    this.suspended = true;
                    if (this.player.y < nextYPos) { 
                        this.player.toon.sprites[0].frameNdx = 4;
                    } else {
                        this.player.toon.sprites[0].frameNdx = 7;
                    }
                    this.movePlayerTo(this.player.x, nextYPos, function moveYCallback() {
                        this.suspended = false;
                        this.player.toon.sprites[0].frameNdx -= 4;
                    }); 
                }
            }
            Map.prototype.draw.call(this,context);
        };

        return Moonening;
    }
});    

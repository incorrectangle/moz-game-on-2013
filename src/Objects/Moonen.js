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
        'moon::Events/Action.js',
        'moon::Events/ActionsDefault.js'
    ],
    /** * *
    * Initializes the Moonen constructor.
    * * **/
    init : function initMoonenConstructor(Actor, Rectangle, Filters, Action, ActionsDefault) {
        /** * *
        * Constructs new Moonens.
        * @constructor
        * @param {String} color A CSS color value.
        * @nosideeffects
        * @return {Moonen}
        * * **/ 
        function Moonen(color) {
            Actor.call(this, 'Moonen', ' - A '+color+' colored moonen.', 'img/tiles.png', new Rectangle(96,160,32,32));
            /** * *
            * The color of this Moonen.
            * @type {String} color The css color of the Moonen.
            * * **/
            this.color = color || 'chartruese';

            var colorizeTrick = new Action(function colorize() {
                // Make a reference to the old sheet...
                var sheet = this.iconView.sheet;
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
                this.iconView.sheet = canvas;
                // Run through each frame and update the color...
                for (var i=0; i < this.iconView.frames.length; i++) {
                    var frame = this.iconView.frames[i];
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
                this.iconView.updateContextWithCurrentFrame();
            }, this);
            this.iconView.reactor.addAction('onSpriteSheetLoad', colorizeTrick);
        }

        Moonen.prototype = new Actor();
        Moonen.prototype.constructor = Moonen;
        //-----------------------------
        //  STATIC METHODS
        //-----------------------------
        Moonen.fromJSONObject = function Moonen_fromJSONObject(object) {
            return new Moonen(object.color);
        };
        //-----------------------------
        //  GETTERS/SETTERS
        //-----------------------------
        /** * *
        * Gets the actions property.
        * 
        * @returns {Object.<String, Action>} actions 
        * * **/
        Moonen.prototype.__defineGetter__('actions', function Moonen_getactions() {
            if (!this._actions) {
                var self = this;
                this._actions = new ActionsDefault(this);
                var extras = {
                    turn : new Action(function moveMoonen() {
                        // Find an astro...
                        var selfNdx = this.level.actorMap.indexOf(this);
                        var sx = selfNdx%16;
                        var sy = Math.floor(selfNdx/16);
                        var astros = this.level.actorMap.map(function (el) {
                            if (el.name === 'Scooter') {
                                return el;
                            }
                            return false;
                        }).filter(function (el) {
                            return el;
                        });
                        var stepsToAstros = astros.map(function (astro) {
                            var astroNdx = self.level.actorMap.indexOf(astro);
                            var ax = astroNdx%16;
                            var ay = Math.floor(astroNdx/16);
                            var dx = ax - sx;
                            var dy = ay - sy;
                            var total = Math.sqrt(dx*dx + dy*dy);
                            return [dx,dy,total]
                        });
                        var closest = 0;
                        for (var i=0; i < stepsToAstros.length; i++) {
                            var steps = stepsToAstros[i][2];
                            if (steps < stepsToAstros[closest][2]) {
                                closest = i;
                            }                               
                        }

                        var direction = stepsToAstros[closest];
                        function moveY() {
                            // Move in y...
                            if (direction[1] > 0) {
                                // Move down...
                                self.react('down');
                            } else {
                                // Move up...
                                self.react('up');
                            }
                        }
                        function moveX() {
                            // Move in x...
                            if (direction[0] > 0) {
                                // Move right...
                                self.react('right');
                            } else {
                                // Move left...
                                self.react('left');
                            }
                        }
                        // Now move in that direction...
                        if (direction[0] === 0) {
                            moveY();    
                        } else if (direction[1] === 0) {
                            moveX();
                        } else if (Math.abs(direction[0]) < Math.abs(direction[1])) {
                            moveX(); 
                        } else {
                            moveY(); 
                        }
                    }, self),
                    // The move actions...
                    left : new Action(function levelLeft() {
                        console.log(this.name,'wants to go left');
                        this.attemptMove('left');
                    }, self),
                    right : new Action(function levelRight() {
                        console.log(this.name,'wants to go right');
                        this.attemptMove('right');
                    }, self),
                    up : new Action(function levelUp() {
                        console.log(this.name,'wants to go up');
                        this.attemptMove('up');
                    }, self),
                    down : new Action(function levelDown() {
                        console.log(this.name,'wants to go down');
                        this.attemptMove('down');
                    }, self)
                };
                for (var action in extras) {
                    this._actions[action] = extras[action];
                };
            }
            return this._actions;
        });
        //-----------------------------
        //  METHODS
        //-----------------------------
        

        /** * *
        * Gets the JSONObject property.
        * 
        * @returns {Object} JSONObject 
        * * **/
        Moonen.prototype.__defineGetter__('JSONObject', function Moonen_getJSONObject() {
            return {
                constructor : 'Moonen',
                color : this.color
            };
        });
        return Moonen;
    }
});    

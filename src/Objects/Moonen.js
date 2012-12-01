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
        'moon::Events/ActionsThatMoveActors.js',
        'moon::View/MoonenMinor.js'
    ],
    /** * *
    * Initializes the Moonen constructor.
    * * **/
    init : function initMoonenConstructor(Actor, Rectangle, Filters, Action, MoveActions) {
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
            this.color = color || 'black';
            /** * *
            * The pixel color of the moonen.
            * @type {Filters.Pixel}
            * * **/
            this.pixelColor = false;

            var self = this;
            function colorizeAction(view)  {
                return new Action(function colorize() {
                    // Make a reference to the old sheet...
                    var sheet = view.sheet;
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
                    this.pixelColor = pixelColor;
                    context.drawImage(sheet,0,0);
                    view.sheet = canvas;
                    // Run through each frame and update the color...
                    for (var i=0; i < view.frames.length; i++) {
                        var frame = view.frames[i];
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
                    view.updateContextWithCurrentFrame();
                }, self);
            }
            this.iconView.reactor.addAction('onSpriteSheetLoad', colorizeAction(this.iconView));
            this.view.reactor.addAction('onSpriteSheetLoad', colorizeAction(this.view));
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
        * Gets the view property.
        * 
        * @returns {MoonenMinor} view 
        * * **/
        //Moonen.prototype.__defineGetter__('view', function Moonen_getview() {
        //    if (!this._view) {
        //        this._view = new MoonenMinor();
        //    }
        //    return this._view;
        //});
        /** * *
        * Gets the turn property.
        * More...
        * @returns {Action} turn 
        * * **/
        Moonen.prototype.__defineGetter__('turn', function Moonen_getturn() {
            if (!this._turn) {
                this._turn = new Action(function moveMoonen() {
                    var self = this;
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
                }, this);
            }
            return this._turn;
        });
        /** * *
        * Gets the interact property.
        * 
        * @returns {Action} interact 
        * * **/
        Moonen.prototype.__defineGetter__('interact', function Moonen_getinteract() {
            if (!this._interact) {
                this._interact = new Action(function eatSomethingComingAtYou(actor) {
                    if (actor.name === 'Scooter') {
                        log('The '+this.color+' '+this.name+' ate a poor Scooter!');
                        actor.react('die');
                        return; 
                    }
                    if (actor.name === 'Key Cartridge') {
                        // Game Over...
                        log(this.color +' '+this.name+' ate the Key Cartridge!');
                        return this.level.turnOver();
                    }
                    if (actor.name === 'Moonen') {
                        // Consume each other...
                        var msg = actor.color+' '+actor.name+' jumped into and ate a '+this.color+' '+this.name;
                        if (this.pixelColor.isEqualTo(actor.pixelColor)) {
                            log(msg+'<br>&nbsp;and they both died!!!');
                            this.level.removeActor(this);
                            this.level.removeActor(actor);
                            this.view.parent.removeView(this.view);
                            actor.view.parent.removeView(actor.view);
                        } else {
                            var r = (this.pixelColor.r + actor.pixelColor.r)%256;
                            var g = (this.pixelColor.g + actor.pixelColor.g)%256;
                            var b = (this.pixelColor.b + actor.pixelColor.b)%256;
                            var color = new Filters.Pixel(r,g,b,255);
                            var actorNdx = this.level.actorMap.indexOf(actor); 
                            var selfNdx = this.level.actorMap.indexOf(this);
                            var turnNdx = this.level.actorsWithATurn.indexOf(this);
                            // Take both out...
                            this.level.removeActor(this);
                            this.level.removeActor(actor);
                            this.view.parent.removeView(this.view);
                            actor.view.parent.removeView(actor.view);
                            // Make the new one...
                            var newMoonen = new Moonen(color.toCSSString());
                            var pos = this.level.positionOfActorWithIndex(selfNdx);
                            newMoonen.view.x = pos[0];
                            newMoonen.view.y = pos[1];
                            newMoonen.level = this.level;
                            newMoonen.view.alpha = 0;
                            //newMoonen.view.alpha = 0;
                            this.level.actorMap[selfNdx] = newMoonen;
                            if (turnNdx !== -1) {
                                this.level.actorsWithATurn.splice(turnNdx,0,newMoonen);
                            }
                            new Ease({
                                target : newMoonen.view,
                                properties : {
                                    alpha : 1
                                },
                                duration : 500
                            }).interpolate();
                            log(msg+'&nbsp;and they combined to make a '+color.toCSSString()+' Moonen!!!',color.toCSSString());
                        }
                        return this.level.turnOver();
                    }
                    actor.react('interact', this);
                }, this);
            }
            return this._interact;
        });
        /** * *
        * Gets the reactor property.
        * 
        * @returns {Reactor} reactor 
        * * **/
        Moonen.prototype.__defineGetter__('reactor', function Moonen_getreactor() {
            if (!this._reactor) {
                this._reactor = new Reactor();

                var moveActions = new MoveActions(this);
                this._reactor.addActionBundle(moveActions);
                this._reactor.addAction('turn', this.turn);
                this._reactor.addAction('interact', this.interact);
            }
            return this._reactor;
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

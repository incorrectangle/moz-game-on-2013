/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Level.js
* A level in The Level.
* Copyright (c) 12 Schell Scivally. All rights reserved.
* 
* @author   Schell Scivally 
* @since    Tue Nov 27 18:00:49 2012  
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Level',
    dependencies : [ 
        'bang::View/View.js',
        'moon::View/MapView.js',
        'moon::Objects/MapPiece.js',
        'moon::Events/Action.js',
        'moon::Objects/Actor.js',
        'moon::Objects/Moonen.js',
        'moon::Objects/Objects.js',
        'moon::Objects/Astronaut.js',
        'moon::Objects/JoltCola.js',
        'moon::Objects/KeyCartridge.js',
        'moon::Events/Reactor.js'
    ],
    /** * *
    * Initializes the Level constructor.
    * * **/
    init : function initLevelConstructor(View, MapView, MapPiece, Action, 
                                         Actor, Moonen, Objects,
                                         Astronaut, JoltCola,
                                         KeyCartridge, Reactor) {
        /** * *
        * Constructs new Levels.
        * @constructor
        * @nosideeffects
        * @return {Level}
        * * **/ 
        function Level() {
            /** * *
            * A list of actors that are waiting for their turn.
            * @type {Array.<Actor>}
            * * **/
            this.actorsWithATurn = []; 
            /** * *
            * A list of all the actors currently in the game.
            * @type {Array.<Actor>}
            * * **/
            this.actorMap = [];
            /** * *
            * The actor that currently has focus.
            * @type {Actor}
            * * **/
            this.actorWithFocus = false;
        }

        Level.prototype = {}; 
        Level.prototype.constructor = Level;
        //-----------------------------
        //  METHODS
        //-----------------------------
        /** * *
        * Loads a level.
        * @param {Object} levelObject
        * * **/
        Level.prototype.load = function Level_load(levelObject) {
            var constructors = {
                'Actor' : Actor,
                'Astronaut' : Astronaut,
                'KeyCartridge' : KeyCartridge,
                'JoltCola' : JoltCola,
                'Moonen' : Moonen
            };

            this.actorsWithATurn = [];
            this.actorMap = [];
            this.mapView.tileNdx = levelObject.floor;

            var actorStartNdx = 0;
            for (var i=0; i < this.objects.length; i++) {
                if (this.objects[i].tier === 1) {
                    actorStartNdx = i;
                    break;
                }
            }
            
            for (var i=0; i < levelObject.actors.length; i++) {
                var actorNdx = levelObject.actors[i];
                var objectNdx = actorStartNdx + actorNdx;
                if (actorNdx) {
                    var obj = this.objects[objectNdx];
                    var config = obj.JSONObject;
                    var newActor = constructors[config.constructor].fromJSONObject(config); 
                    var position = this.positionOfActorWithIndex(i);
                    newActor.view.x = position[0];
                    newActor.view.y = position[1];
                    newActor.level = this;
                    this.actorView.addView(newActor.view);
                    this.actorMap[i] = newActor;
                }
            }           
            this.view.needsDisplay = true;

            // Start the game!
            var self = this;
            setTimeout(function() {
                self.iterate();
            }, 1);
        };
        /** * *
        * The [x,y] position of an actor at the given index in the game map.
        * @param {number} ndx
        * @return {Array.<number>}
        * * **/
        Level.prototype.positionOfActorWithIndex = function Level_positionOfActorWithIndex(ndx) {
            var x = (ndx%16);
            x *= this.mapView.tileWidth;
            var y = Math.floor(ndx/16);
            y *= this.mapView.tileHeight;
            return [x, y];
        };
        /** * *
        * Iterates over the actors, giving them focus and allowing them
        * to mutate the board.
        * * **/
        Level.prototype.iterate = function Level_iterate() {
            if (!this.actorsWithATurn.length) {
                // Build a new turn sequence and iterate over that...
                for (var i=0; i < this.actorMap.length; i++) {
                    var actor = this.actorMap[i];
                    if (!actor) {
                        // This is the 'Nothing' actor, which we should skip...
                        continue;
                    }
                    this.actorsWithATurn.push(actor);
                } 
            }

            var actor = this.actorsWithATurn.shift();
            actor.hasFocus = true;
            this.actorWithFocus = actor;
            this.selector.x = actor.view.x;
            this.selector.y = actor.view.y;
            
            actor.reactor.react('turn');
        };
        /** * *
         * Cleans up after a turn.
         * * **/
        Level.prototype.turnOver = function Level_turnOver() {
            this.actorWithFocus.hasFocus = false;
            this.iterate();            
        };
        //-----------------------------
        //  GETTERS/SETTERS
        //-----------------------------
        /** * *
        * Gets the actions property.
        * These are given to the reactor.
        * @returns {Object.<String, Action>} actions 
        * * **/
        Level.prototype.__defineGetter__('actions', function Level_getactions() {
            if (!this._actions) {
                var self = this;
                this._actions = {
                    iterationComplete : new Action(function continueIterating() {
                        this.iterate();
                    }, self),
                    // The move actions...
                    left : new Action(function levelLeft() {
                        // Forward the action to the current actor...
                        this.actorWithFocus.react('left');
                    }, self),
                    right : new Action(function levelRight() {
                        this.actorWithFocus.react('right');
                    }, self),
                    up : new Action(function levelUp() {
                        this.actorWithFocus.react('up');
                    }, self),
                    down : new Action(function levelDown() {
                        this.actorWithFocus.react('down');
                    }, self)
                };
            }
            return this._actions;
        });
        /** * *
        * Gets the reactor property.
        * The reactor manages events.
        * @returns {Reactor} reactor 
        * * **/
        Level.prototype.__defineGetter__('reactor', function Level_getreactor() {
            if (!this._reactor) {
                this._reactor = new Reactor(this.actions);
            }
            return this._reactor;
        });
        /** * *
        * Gets the actorView property.
        * Holds the game's actors.
        * @returns {View} actorView 
        * * **/
        Level.prototype.__defineGetter__('actorView', function Level_getactorView() {
            if (!this._actorView) {
                this._actorView = new View(0,0,512,512);
                this._actorView.tag = "actorView";
            }
            return this._actorView;
        });
        /** * *
        * Gets the view property.
        * 
        * @returns {View} view 
        * * **/
        Level.prototype.__defineGetter__('view', function Level_getview() {
            if (!this._view) {
                var view = new View(0,0,512,512);
                view.context.fillRect(0,0,512,512);
                view.addView(this.mapView);
                view.addView(this.selector);
                view.addView(this.actorView);
                this._view = view;
            }
            return this._view;
        });
        /** * *
        * Gets the mapView property.
        * Draws the level's floor map.
        * @returns {MapView} mapView 
        * * **/
        Level.prototype.__defineGetter__('mapView', function Level_getmapView() {
            if (!this._mapView) {
                this._mapView = new MapView(0,0,512,512);
                this._mapView.tag = "mapView";
                for (var i=0; i < this.objects.length; i++) {
                    var obj = this.objects[i];
                    if (obj.tier === 0) {
                        this._mapView.addTile(obj.iconView);
                    }
                }
            }
            return this._mapView;
        });
        /** * *
        * Gets the selector property.
        * The selector shows which actor has the current focus.
        * @returns {View} selector 
        * * **/
        Level.prototype.__defineGetter__('selector', function Level_getselector() {
            if (!this._selector) {
                var view = new View(0,0,32,32);
                view.context.fillStyle = '#00FF00';
                view.context.fillRect(0,0,32,32);
                view.context.clearRect(1,1,30,30); 
                this._selector = view;
            }
            return this._selector;
        });
        /** * *
        * Gets the objects property.
        * 
        * @returns {Array.<GameObject>} objects 
        * * **/
        Level.prototype.__defineGetter__('objects', function Level_getobjects() {
            if (!this._objects) {
                this._objects = new Objects();
            }
            return this._objects;
        });
        return Level;
    }
});    

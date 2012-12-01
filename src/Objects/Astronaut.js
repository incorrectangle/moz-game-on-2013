/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Astronaut.js
* The astronaut game object.
* Copyright (c) 12 Schell Scivally. All rights reserved.
* 
* @author   Schell Scivally 
* @since    Tue Nov 27 20:41:09 2012  
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Astronaut',
    dependencies : [ 
        'moon::Objects/Actor.js',
        'bang::Geometry/Rectangle.js',
        'moon::Events/ActionsDefault.js',
        'moon::Events/ActionsThatMoveActors.js',
        'moon::View/AstronautView.js',
        'bang::Utils/Ease.js'
    ],
    /** * *
    * Initializes the Astronaut constructor.
    * * **/
    init : function initAstronautConstructor(Actor, Rectangle, ActionsDefault, MoveActions, AstronautView) {
        /** * *
        * Constructs new Astronauts.
        * @constructor
        * @nosideeffects
        * @return {Astronaut}
        * * **/ 
        function Astronaut() {
            Actor.call(this,'Scooter', ' - Our protagonist astronaut explorer.', 'img/tiles.png', new Rectangle(0,96,32,32));
            this.constructor = 'Astronaut';
        }

        Astronaut.prototype = new Actor(); 
        Astronaut.prototype.constructor = Astronaut;
        //-----------------------------
        //  STATIC METHODS
        //-----------------------------
        /** * *
        * Returns a new astronaut from a config object.
        * @return {Astronaut}
        * * **/
        Astronaut.fromJSONObject = function Astronaut_fromJSONObject() {
            return new Astronaut();
        };
        //-----------------------------
        //  GETTERS/SETTERS
        //-----------------------------
        /** * *
        * Gets the view property.
        * 
        * @returns {AstronautView} view 
        * * **/
        Astronaut.prototype.__defineGetter__('view', function Astronaut_getview() {
            if (!this._view) {
                this._view = new AstronautView();
            }
            return this._view;
        });
        /** * *
        * Gets the JSONObject property.
        * 
        * @returns {Object} JSONObject 
        * * **/
        Astronaut.prototype.__defineGetter__('JSONObject', function Astronaut_getJSONObject() {
            return {
                constructor : 'Astronaut',
            };
        });
        /** * *
        * Gets the actions property.
        * This is used to populate the reactor's actions with.
        * @returns {Object.<String, Actions>} actions 
        * * **/
        Astronaut.prototype.__defineGetter__('actions', function Astronaut_getactions() {
            if (!this._actions) {
                var self = this;
                this._actions = {
                    turn : new Action(function getTurn() {
                        // Block until a move has been made by the player...
                    }, self),
                    left : new Action(function showLeft() {
                        this.view.toon.sprites[0].frameNdx = 6;
                    }, self),
                    right : new Action(function showRight() {
                        this.view.toon.sprites[0].frameNdx = 5;
                    }, self),
                    up : new Action(function showUp() {
                        this.view.toon.sprites[0].frameNdx = 7;
                    }, self),
                    down : new Action(function showDown() {
                        this.view.toon.sprites[0].frameNdx = 4;
                    }, self),
                    setNdx : new Action(function setNdxFromTo_Astro(from, to, doesNotEndTurn) {
                        // Animate the movement...
                        this.steps.push(to);
                        this.level.actorMap[from] = false;
                        this.level.actorMap[to] = this;

                        var nextPos = this.level.positionOfActorWithIndex(to);
                        var self = this;
                        var move = new Ease({
                            target : self.view,
                            duration : 400,
                            equation : Ease.easeInOutCirc,
                            properties : {
                                x : nextPos[0],
                                y : nextPos[1]
                            },
                            onComplete : function setNdxFromTo_AstroCB() {
                                self.view.toon.sprites[0].frameNdx -= 4;
                                if (!doesNotEndTurn) {
                                    self.level.turnOver();
                                }
                            }
                        }).interpolate();
                    }, self),
                    interact : new Action(function ifNotMyselfThenDie(actor) {
                        if (actor.name !== this.name) {
                            actor.react('interact', this);
                        }
                    }, self)
                };
            }
            return this._actions;
        });
        /** * *
        * Gets the die property.
        * 
        * @returns {Action} die 
        * * **/
        Astronaut.prototype.__defineGetter__('die', function Astronaut_getdie() {
            if (!this._die) {
                this._die = new Action(function dieYouCosmonautScum_exclamationMark() {
                    this.level.removeActor(this);
                    this.view.parent.removeView(this.view);
                    this.level.turnOver();
                    this.level.checkWinCondition();
                }, this);
            }
            return this._die;
        });
        /** * *
        * Gets the reactor property.
        * More...
        * @returns {Reactor} reactor 
        * * **/
        Astronaut.prototype.__defineGetter__('reactor', function Astronaut_getreactor() {
            if (!this._reactor) {
                this._reactor = new Reactor();

                var defaultActions = new ActionsDefault(this);
                delete defaultActions['turn'];
                delete defaultActions['interact'];

                var moveActions = new MoveActions(this);
                delete moveActions['setNdx'];

                this._reactor.addActionBundle(defaultActions);
                this._reactor.addActionBundle(moveActions);
                this._reactor.addActionBundle(this.actions);
                this._reactor.addAction('die', this.die);
            }
            return this._reactor;
        });
        //-----------------------------
        //  METHODS
        //-----------------------------
        return Astronaut;
    }
});    

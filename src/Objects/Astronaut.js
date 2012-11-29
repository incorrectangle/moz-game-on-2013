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
        'moon::Events/ActionsDefault.js'
    ],
    /** * *
    * Initializes the Astronaut constructor.
    * * **/
    init : function initAstronautConstructor(Actor, Rectangle, ActionsDefault) {
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
                var actions = new ActionsDefault(this); 
                actions.turn = new Action(function getTurn() {
                    // Block until a move has been made by the player...
                }, self);
                // The move actions...
                actions.left = new Action(function levelLeft() {
                    this.attemptMove('left');
                }, self);
                actions.right = new Action(function levelRight() {
                    this.attemptMove('right');
                }, self);
                actions.up = new Action(function levelUp() {
                    this.attemptMove('up');
                }, self);
                actions.down = new Action(function levelDown() {
                    this.attemptMove('down');
                }, self);
                this._actions = actions;
            }
            return this._actions;
        });
        //-----------------------------
        //  METHODS
        //-----------------------------
        return Astronaut;
    }
});    

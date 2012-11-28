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
        'bang::Geometry/Rectangle.js'
    ],
    /** * *
    * Initializes the Astronaut constructor.
    * * **/
    init : function initAstronautConstructor(Actor, Rectangle) {
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
        //-----------------------------
        //  METHODS
        //-----------------------------

        return Astronaut;
    }
});    

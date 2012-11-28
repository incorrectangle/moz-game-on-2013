/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* JoltCola.js
* The astronaut game object.
* Copyright (c) 12 Schell Scivally. All rights reserved.
* 
* @author   Schell Scivally 
* @since    Tue Nov 27 20:41:09 2012  
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'JoltCola',
    dependencies : [ 
        'moon::Objects/Actor.js',
        'bang::Geometry/Rectangle.js'
    ],
    /** * *
    * Initializes the JoltCola constructor.
    * * **/
    init : function initJoltColaConstructor(Actor, Rectangle) {
        /** * *
        * Constructs new JoltColas.
        * @constructor
        * @nosideeffects
        * @return {JoltCola}
        * * **/ 
        function JoltCola() {
            Actor.call(this,'Jolt Cola', ' - All the sugar and twice the caffeine. Oh, and twice the astronaut...', 'img/tiles.png', new Rectangle(192,64,32,32));
            this.constructor = 'JoltCola';
        }

        JoltCola.prototype = new Actor(); 
        JoltCola.prototype.constructor = JoltCola;
        //-----------------------------
        //  STATIC METHODS
        //-----------------------------
        /** * *
        * Returns a new JoltCola using a config object.
        * @return {JoltCola}
        * * **/
        JoltCola.fromJSONObject = function JoltCola_fromJSONObject() {
            return new JoltCola();
        };
        //-----------------------------
        //  GETTERS/SETTERS
        //-----------------------------
        /** * *
        * Gets the JSONObject property.
        * 
        * @returns {Object} JSONObject 
        * * **/
        JoltCola.prototype.__defineGetter__('JSONObject', function JoltCola_getJSONObject() {
            return {
                constructor : 'JoltCola',
            };
        });
        //-----------------------------
        //  METHODS
        //-----------------------------

        return JoltCola;
    }
});

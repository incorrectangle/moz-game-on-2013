/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Crate.js
* A crate. A wall. An immovable object.
* Copyright (c) 12 Schell Scivally. All rights reserved.
* 
* @author   Schell Scivally 
* @since    Fri Nov 30 15:22:01 2012  
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Crate',
    dependencies : [ 
        'moon::Objects/Actor.js',
        'bang::Geometry/Rectangle.js'
    ],
    /** * *
    * Initializes the Crate constructor.
    * * **/
    init : function initCrateConstructor(Actor, Rectangle) {
        /** * *
        * Constructs new Crates.
        * @constructor
        * @nosideeffects
        * @return {Crate}
        * * **/ 
        function Crate() {
            Actor.call(this,'Bargain Crate', ' - A crate, man. You know, the kind you lay around all over the place.', 'img/tiles.png', new Rectangle(9*32,0,32,32));
        }

        Crate.prototype = new Actor(); 
        Crate.prototype.constructor = Crate;
        //-----------------------------
        //  STATIC METHODS
        //-----------------------------
        /** * *
        * From an object of JSON.
        * * **/
        Crate.fromJSONObject = function Crate_fromJSONObject() {
            return new Crate();
        };
        //-----------------------------
        //  METHODS
        //-----------------------------
        /** * *
        * Gets the JSONObject property.
        * 
        * @returns {Object} JSONObject 
        * * **/
        Crate.prototype.__defineGetter__('JSONObject', function Crate_getJSONObject() {
            return {
                constructor : 'Crate',
            };
        });

        return Crate;
    }
});    

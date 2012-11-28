/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* KeyCartridge.js
* The astronaut game object.
* Copyright (c) 12 Schell Scivally. All rights reserved.
* 
* @author   Schell Scivally 
* @since    Tue Nov 27 20:41:09 2012  
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'KeyCartridge',
    dependencies : [ 
        'moon::Objects/Actor.js',
        'bang::Geometry/Rectangle.js'
    ],
    /** * *
    * Initializes the KeyCartridge constructor.
    * * **/
    init : function initKeyCartridgeConstructor(Actor, Rectangle) {
        /** * *
        * Constructs new KeyCartridges.
        * @constructor
        * @nosideeffects
        * @return {KeyCartridge}
        * * **/ 
        function KeyCartridge() {
            Actor.call(this,'Key Cartridge', ' - 16 bits of door opening mayhem...', 'img/tiles.png', new Rectangle(192,96,32,32));
            this.constructor = 'KeyCartridge';
        }

        KeyCartridge.prototype = new Actor(); 
        KeyCartridge.prototype.constructor = KeyCartridge;
        //-----------------------------
        //  STATIC METHODS
        //-----------------------------
        /** * *
        * Creates a new KeyCartridge from a config object.
        * @param {Object} object
        * * **/
        KeyCartridge.fromJSONObject = function KeyCartridge_fname(object) {
            return new KeyCartridge();
        };
        //-----------------------------
        //  GETTERS/SETTERS
        //-----------------------------
        /** * *
        * Gets the JSONObject property.
        * 
        * @returns {Object} JSONObject 
        * * **/
        KeyCartridge.prototype.__defineGetter__('JSONObject', function KeyCartridge_getJSONObject() {
            return {
                constructor : 'KeyCartridge',
            };
        });
        //-----------------------------
        //  METHODS
        //-----------------------------

        return KeyCartridge;
    }
});

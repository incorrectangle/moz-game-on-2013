/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Actor.js
* An actor game object. These do most of the interaction work in Moonening.
* Copyright (c) 12 Schell Scivally. All rights reserved.
* 
* @author   Schell Scivally 
* @since    Sat Nov 24 16:07:27 2012  
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Actor',
    dependencies : [ 
        'moon::Objects/MapPiece.js',
        'bang::Geometry/Rectangle.js'
    ],
    /** * *
    * Initializes the Actor constructor.
    * * **/
    init : function initActorConstructor(MapPiece, Rectangle) {
        /** * *
        * Constructs new Actors.
        * @constructor
        * @nosideeffects
        * @return {Actor}
        * * **/ 
        function Actor(name, description, src, frame) {
            MapPiece.call(this); 

            this.name = name || 'Actor';                
            this.description = description || ' - An actor.';
            this.tier = 1;
            this.src = src || false;
            this.frame = frame || new Rectangle();
        }
        Actor.prototype = new MapPiece(); 
        Actor.prototype.constructor = Actor;
        //-----------------------------
        //  STATIC METHODS
        //-----------------------------
        Actor.fromJSONObject = function Actor_fromJSONObject(object) {
            var r = new Rectangle();
            Rectangle.apply(r, object.frame);
            return new Actor(object.name,object.description,object.src,r);
        };
        //-----------------------------
        //  METHODS
        //-----------------------------
        //-----------------------------
        //  GETTERS/SETTERS
        //-----------------------------
        /** * *
        * Gets the JSONObject property.
        * The JSON representation of this object.
        * @returns {Object} JSONObject 
        * * **/
        Actor.prototype.__defineGetter__('JSONObject', function MapPiece_getJSONObject() {
            return {
                constructor : 'Actor',
                name : this.name,
                description : this.description,
                src : this.src,
                frame : [this.frame.x(),this.frame.y(),this.frame.width(),this.frame.height()]
            };
        });
        /** * *
        * Gets the view property.
        * The main (possibly animated) view for this actor.
        * @returns {View} view 
        * * **/
        Actor.prototype.__defineGetter__('view', function Actor_getview() {
            if (!this._view) {
                this._view = this.iconView;
            }
            return this._view;
        });

        return Actor;
    }
});    

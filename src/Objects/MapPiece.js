/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * MapPiece.js
 * The moonbase floor tile object.
 * Copyright (c) 12 Schell Scivally. All rights reserved.
 * 
 * @author   Schell Scivally 
 * @since    Sat Nov 17 16:46:36 2012  
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'MapPiece',
    dependencies : [ 
        'moon::Objects/GameObject.js',
        'moon::View/Sprite.js',
        'bang::Geometry/Rectangle.js'
    ],
    /** * *
    * Initializes the MapPiece constructor.
    * * **/
    init : function initMapPieceConstructor(GameObject, Sprite, Rectangle) {
        /** * *
        * Constructs new MapPieces.
        * @constructor
        * @nosideeffects
        * @return {MapPiece}
        * * **/ 
        function MapPiece(name, description, src, frame) {
            GameObject.call(this);
            this.name = name || 'MapPiece';                
            this.description = description || ' - A map tile.';
            this.tier = 0;
            /** * *
            * The source of the image to take the tile from.
            * @type {String}
            * * **/
            this.src = src || false;
            /** * *
            * The frame of the tile in the source image.
            * @type {Rectangle}
            * * **/
            this.frame = frame || new Rectangle();
        }
        MapPiece.prototype = new GameObject();
        MapPiece.prototype.constructor = MapPiece;
        //-----------------------------
        //  STATIC METHODS
        //-----------------------------
        MapPiece.fromJSONObject = function MapPiece_fromJSONObject(object) {
            var r = new Rectangle();
            Rectangle.apply(r, object.frame);
            return new MapPiece(object.name,object.description,object.src,r);
        };
        //-----------------------------
        //  METHODS
        //-----------------------------
        /** * *
        * The toJSON serializer.
        * @return {String}
        * * **/
        MapPiece.prototype.toJSON = function MapPiece_toJSON() {
            return JSON.stringify(this.JSONObject);
        };
        //-----------------------------
        //  GETTERS/SETTERS
        //-----------------------------
        /** * *
        * Gets the JSONObject property.
        * The JSON representation of this object.
        * @returns {Object} JSONObject 
        * * **/
        MapPiece.prototype.__defineGetter__('JSONObject', function MapPiece_getJSONObject() {
            return {
                constructor : 'MapPiece',
                name : this.name,
                description : this.description,
                src : this.src,
                frame : [this.frame.x(),this.frame.y(),this.frame.width(),this.frame.height()],
                tier : this.tier
            };
        });
        /** * *
        * Gets the iconView property. Its creation is deferred.
        * 
        * @returns {View} iconView 
        * * **/
        MapPiece.prototype.__defineGetter__('iconView', function MapPiece_geticonView() {
            if (!this._iconView) {
                var w = this.frame.width();
                var h = this.frame.height();
                this._iconView = new Sprite(0,0,w,h,this.src, [
                    this.frame
                ]);
            }
            return this._iconView;
        });
        return MapPiece;
    }
});    

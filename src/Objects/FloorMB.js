/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * FloorMB.js
 * The moonbase floor tile object.
 * Copyright (c) 12 Schell Scivally. All rights reserved.
 * 
 * @author   Schell Scivally 
 * @since    Sat Nov 17 16:46:36 2012  
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'FloorMB',
    dependencies : [ 
        'moon::GameObject.js',
        'moon::View/Sprite.js',
        'bang::Geometry/Rectangle.js'
    ],
    /** * *
    * Initializes the FloorMB constructor.
    * * **/
    init : function initFloorMBConstructor(GameObject, Sprite, Rectangle) {
        /** * *
        * Constructs new FloorMBs.
        * @constructor
        * @nosideeffects
        * @return {FloorMB}
        * * **/ 
        function FloorMB() {
            GameObject.call(this);
            this.name = 'Moonbase floor panel';                
            this.description = ' - just a floor piece...';
        }
        FloorMB.prototype = new GameObject();
        FloorMB.prototype.constructor = FloorMB;
        //-----------------------------
        //  METHODS
        //-----------------------------
        /** * *
        * Gets the view property. Its creation is deferred.
        * 
        * @returns {View} view 
        * * **/
        FloorMB.prototype.__defineGetter__('view', function FloorMB_getview() {
            if (!this._view) {
                this._view = new Sprite(0,0,32,32,'img/tiles.png', [
                    new Rectangle(0,0,32,32)
                ]);
            }
            return this._view;
        });
        return FloorMB;
    }
});    

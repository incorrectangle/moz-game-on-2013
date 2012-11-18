/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* DeleteTile.js
* A game object for deleting tiles in the editor.
* Copyright (c) 12 Schell Scivally. All rights reserved.
* 
* @author   Schell Scivally 
* @since    Sat Nov 17 17:59:13 2012  
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'DeleteTile',
    dependencies : [ 
        'moon::Objects/GameObject.js',
        'moon::View/Sprite.js',
        'bang::Geometry/Rectangle.js'
    ],
    /** * *
    * Initializes the DeleteTile constructor.
    * * **/
    init : function initDeleteTileConstructor(GameObject, Sprite, Rectangle) {
        /** * *
        * Constructs new DeleteTiles.
        * @constructor
        * @nosideeffects
        * @return {DeleteTile}
        * * **/ 
        function DeleteTile() {
            this.name = 'Delete';
            this.description = ' - deletes tiles on the map.';
        }

        DeleteTile.prototype = {}; 
        DeleteTile.prototype.constructor = DeleteTile;
        //-----------------------------
        //  METHODS
        //-----------------------------
        /** * *
        * Gets the view property. Its creation is deferred.
        * 
        * @returns {Sprite} view 
        * * **/
        DeleteTile.prototype.__defineGetter__('view', function DeleteTile_getview() {
            if (!this._view) {
                this._view = new Sprite(0,0,32,32,'img/tiles.png',[
                    new Rectangle(512-32,512-32,32,32)
                ]);
            }
            return this._view;
        });
        return DeleteTile;
    }
});    

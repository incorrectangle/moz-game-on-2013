/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* GameMapView.js
* A view that knows how to draw a GameMap.
* Copyright (c) 12 Schell Scivally. All rights reserved.
* 
* @author   Schell Scivally 
* @since    Mon Nov 19 18:09:15 2012  
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'GameMapView',
    dependencies : [ 
        'moon::Map/GameMap.js',
        'moon::Map/GameMapUnit.js',
        'moon::Map/GameObject.js',
        'moon::View/Map.js',
        'bang::View/View.js'
    ],
    /** * *
    * Initializes the GameMapView constructor.
    * * **/
    init : function initGameMapViewConstructor(GameMap, GameMapUnit, GameObject, View) {
        /** * *
        * Constructs new GameMapViews.
        * @constructor
        * @nosideeffects
        * @return {GameMapView}
        * * **/ 
        function GameMapView() {
            
        }

        GameMapView.prototype = new View();
        GameMapView.prototype.constructor = GameMapView;
        //-----------------------------
        //  METHODS
        //-----------------------------
        /** * *
        * Gets the floorMap property. Its creation is deferred.
        * The floor map is what draws the floor tiles.
        * @returns {Map} floorMap 
        * * **/
        GameMapView.prototype.__defineGetter__('floorMap', function GameMapView_getfloorMap() {
            if (!this._floorMap) {
                this._floorMap = new Map();
            }
            return this._floorMap;
        });
        return GameMapView;
    }
});    

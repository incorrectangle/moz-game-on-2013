/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* MapData.js
* A data object that represents one spot on the map.
* Copyright (c) 12 Schell Scivally. All rights reserved.
* 
* @author   Schell Scivally 
* @since    Sat Nov 10 19:35:32 2012  
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'MapData',
    dependencies : [],
    /** * *
    * Initializes the MapData constructor.
    * * **/
    init : function initMapDataConstructor() {
        /** * *
        * Constructs new MapDatas.
        * @constructor
        * @nosideeffects
        * @return {MapData}
        * * **/ 
        function MapData(isWall) {
            /** * *
            * Whether or not the spot is a wall.
            * @type {Boolean}
            * * **/
            this.isWall = 1;
        }
        MapData.prototype = {}; 
        MapData.prototype.constructor = MapData;
        //-----------------------------
        //  METHODS
        //-----------------------------

        return MapData;
    }
});    

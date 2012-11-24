/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* GameMap.js
* The main game map. Is a 2d list of GameUnits.
*
* Copyright (c) 12 Schell Scivally. All rights reserved.
* 
* @author   Schell Scivally 
* @since    Sun Nov 18 13:51:08 2012  
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'GameMap',
    dependencies : [ 
        'moon::Map/GameMapUnit.js'
    ],
    /** * *
    * Initializes the GameMap constructor.
    * * **/
    init : function initGameMapConstructor(GameMapUnit) {
        /** * *
        * Constructs new GameMaps.
        * @constructor
        * @param {number} w The width (in tiles).
        * @param {number} h The height (in tiles).
        * @nosideeffects
        * @return {GameMap}
        * * **/ 
        function GameMap(w, h) {
            /** * *
            * The width of the map.
            * @type {number}
            * * **/
            this.width = w || 16;
            /** * *
            * The height of the map.
            * @type {number}
            * * **/
            this.height = h || 16;
        }

        GameMap.prototype = {}; 
        GameMap.prototype.constructor = GameMap;
        //-----------------------------
        //  METHODS
        //-----------------------------
        /** * *
        * Creates a unit list.
        * @param {number} w 
        * @param {number} h
        * @return {Array.<GameMapUnit>}
        * * **/
        GameMap.prototype.createEmptyUnits = function GameMap_createEmptyUnits(w, h) {
            var units = [];
            for (var i=0; i < w*h; i++) {
                units.push(new GameMapUnit());
            }
            return units;
        };
        /** * *
        * Adds a game object to the unit at the given offset.
        * @param {GameObject} object 
        * @param {number} x
        * @param {number} y
        * * **/
        GameMap.prototype.addObjectAtXY = function GameMap_addObjectAtXY(object, x, y) {
            var ndx = y*this.width + x;
            this.addObjectAtNdx(ndx);
        };
        /** * *
        * Adds a game object to the unit at the given map index.
        * @param {GameObject} object 
        * @param {number} ndx
        * * **/
        GameMap.prototype.addObjectAtNdx = function GameMap_addObjectAtNdx(object, ndx) {
            var unit = this.mapUnits[ndx];
            switch (object.tier) {
                case 0:
                    unit.floor = object;
                break;
                case 1:
                    unit.actor = object;
                break;
                case 2:
                    unit.ceiling = object;
                break;
                default:
            }
        };
        //-----------------------------
        //  GETTERS/SETTERS
        //-----------------------------
        /** * *
        * Gets the JSONObject property.
        * The JSON representation of this object.
        * @returns {Object} JSONObject 
        * * **/
        GameMap.prototype.__defineGetter__('JSONObject', function GameMap_getJSONObject() {
            return {
                constructor : 'GameMap',
                width : this.width,
                height : this.height,
                units : this.mapUnits.map(function (el) {
                    return el.JSONObject;
                })
            };
        });
        /** * *
        * Gets the mapUnits property. Its creation is deferred.
        * Holds the flattened list of three-tiered GameMapUnits.
        * @returns {Array.<GameMapUnit>} mapUnits 
        * * **/
        GameMap.prototype.__defineGetter__('mapUnits', function GameMap_getmapUnits() {
            if (!this._mapUnits) {
                this._mapUnits = this.createEmptyUnits(this.width, this.height);
            }
            return this._mapUnits;
        });
        return GameMap;
    }
});    

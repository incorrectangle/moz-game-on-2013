/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Level.js
* A level in The Level.
* Copyright (c) 12 Schell Scivally. All rights reserved.
* 
* @author   Schell Scivally 
* @since    Tue Nov 27 18:00:49 2012  
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Level',
    dependencies : [ 
        'bang::View/View.js',
        'moon::View/MapView.js',
        'moon::Objects/MapPiece.js',
        'moon::Events/Action.js',
        'moon::Map/GameMap.js',
        'moon::Objects/Actor.js',
        'moon::Objects/Moonen.js',
        'moon::Objects/Objects.js',
        'moon::Map/GameMapUnit.js',
        'moon::Objects/Astronaut.js',
        'moon::Objects/JoltCola.js',
        'moon::Objects/KeyCartridge.js'
    ],
    /** * *
    * Initializes the Level constructor.
    * * **/
    init : function initLevelConstructor(View, MapView, MapPiece, Action, 
                                         GameMap, Actor, Moonen, Objects,
                                         GameMapUnit, Astronaut, JoltCola,
                                         KeyCartridge) {
        /** * *
        * Constructs new Levels.
        * @constructor
        * @nosideeffects
        * @return {Level}
        * * **/ 
        function Level() {
            
        }

        Level.prototype = {}; 
        Level.prototype.constructor = Level;
        //-----------------------------
        //  METHODS
        //-----------------------------
        /** * *
        * Loads a level.
        * @param {Object} levelObject
        * * **/
        Level.prototype.load = function Level_load(levelObject) {
            var constructors = {
                'Actor' : Actor,
                'Astronaut' : Astronaut,
                'KeyCartridge' : KeyCartridge,
                'JoltCola' : JoltCola,
                'Moonen' : Moonen
            };
            for (var i=0; i < levelObject.map.length; i++) {
                var floorNdx = levelObject.map[i][0];
                var actorNdx = levelObject.map[i][1];
                var ceilingNdx = levelObject.map[i][2];
                var mapUnit = new GameMapUnit();
                if (floorNdx !== -1) {
                    var obj = this.objects[floorNdx];
                    this.mapView.tileNdx[i] = this.mapView.tiles.indexOf(obj.iconView);
                    mapUnit.floor = obj;
                }
                if (actorNdx !== -1) {
                    var obj = this.objects[actorNdx];
                    var config = obj.JSONObject;
                    var newActor = constructors[config.constructor].fromJSONObject(config); 
                    mapUnit.actor = newActor;
                    var position = this.positionOfActorWithIndex(i);
                    newActor.view.x = position[0];
                    newActor.view.y = position[1];
                    this.actorView.addView(newActor.view);
                }
                if (ceilingNdx !== -1) {
                }
            }           
            this.gameMap[i] = mapUnit;
            this.view.needsDisplay = true;
        };
        /** * *
        * The [x,y] position of an actor at the given index in the game map.
        * @param {number} ndx
        * @return {Array.<number>}
        * * **/
        Level.prototype.positionOfActorWithIndex = function Level_positionOfActorWithIndex(ndx) {
            var x = (ndx%this.gameMap.width);
            x *= this.mapView.tileWidth;
            var y = Math.floor(ndx/this.gameMap.width);
            y *= this.mapView.tileHeight;
            return [x, y];
        };
        //-----------------------------
        //  GETTERS/SETTERS
        //-----------------------------
        /** * *
        * Gets the gameMap property.
        * Holds the three tiered game data for the entire map.
        * @returns {GameMap} gameMap 
        * * **/
        Level.prototype.__defineGetter__('gameMap', function Level_getgameMap() {
            if (!this._gameMap) {
                this._gameMap = new GameMap();
            }
            return this._gameMap;
        });
        /** * *
        * Gets the view property.
        * 
        * @returns {View} view 
        * * **/
        Level.prototype.__defineGetter__('view', function Level_getview() {
            if (!this._view) {
                var view = new View(0,0,512,512);
                view.context.fillRect(0,0,512,512);
                view.addView(this.mapView);
                view.addView(this.actorView);
                this._view = view;
            }
            return this._view;
        });
        /** * *
        * Gets the mapView property.
        * Draws the level's floor map.
        * @returns {MapView} mapView 
        * * **/
        Level.prototype.__defineGetter__('mapView', function Level_getmapView() {
            if (!this._mapView) {
                this._mapView = new MapView(0,0,512,512);
                this._mapView.tag = "mapView";
                for (var i=0; i < this.objects.length; i++) {
                    var obj = this.objects[i];
                    if (obj.tier === 0) {
                        this._mapView.addTile(obj.iconView);
                    }
                }
            }
            return this._mapView;
        });
        /** * *
        * Gets the actorView property.
        * Holds the level's actors.
        * @returns {View} actorView 
        * * **/
        Level.prototype.__defineGetter__('actorView', function Level_getactorView() {
            if (!this._actorView) {
                this._actorView = new View(0,0,512,512);
            }
            return this._actorView;
        });
        /** * *
        * Gets the objects property.
        * 
        * @returns {Array.<GameObject>} objects 
        * * **/
        Level.prototype.__defineGetter__('objects', function Level_getobjects() {
            if (!this._objects) {
                this._objects = new Objects();
            }
            return this._objects;
        });
        return Level;
    }
});    

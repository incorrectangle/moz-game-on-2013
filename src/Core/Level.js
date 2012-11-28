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
    ],
    /** * *
    * Initializes the Level constructor.
    * * **/
    init : function initLevelConstructor(View, MapView, MapPiece, Action, GameMap, Actor, Moonen) {
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
            // Remove the old floor view objects...
            this.mapView.tiles = [];
            var rawToFloorNdx = [];
            var gameObjects = [];
            var constructors = {
                'MapPiece' : MapPiece,
                'Actor' : Actor,
                'Moonen' : Moonen
            };
            for (var i=0; i < levelObject.objects.length; i++) {
                var object = levelObject.objects[i];
                var addition = constructors[object.constructor].fromJSONObject(object);
                if (addition.tier === 0) {
                    // Note where the object goes...
                    rawToFloorNdx[i] = this.mapView.tiles.length;
                    // Add the new floor view objects to the mapView...
                    addition.iconView.reactor.addAction('onSpriteSheetLoad', new Action(function setNeedsDisplay() {
                        this.view.stage.needsDisplay = true;
                    }, this));
                    this.mapView.addTile(addition.iconView);
                } else if (object.constructor === 'Actor') {
                } else if (object.constructor === 'Moonen') {
                }
                gameObjects.push(addition);
            }
            
            for (var i=0; i < levelObject.map.length; i++) {
                var object = levelObject.map[i];
                var gameAddition = false;
                if (object.floor !== -1) {
                    this.mapView.tileNdx[i] = rawToFloorNdx[object.floor];
                }
                if (object.actor !== -1) {

                }
                
            }
            this.view.needsDisplay = true;
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
            return Level;
    }
});    

/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Level.js
 * A level editor for the Moonening.
 * Copyright (c) 12 Schell Scivally. All rights reserved.
 * 
 * @author   Schell Scivally 
 * @since    Sat Nov 17 15:22:14 2012  
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Level',
    dependencies : [ 
        'moon::Game.js',
        'moon::Objects/GameObject.js',
        'moon::Map/GameMap.js',
        'moon::Events/Action.js',
        'bang::View/View.js',
        'moon::Objects/MapPiece.js',
        'bang::Geometry/Rectangle.js',
        'moon::View/MapView.js',
        'bang::View/Stage.js',
        'bang::Geometry/Vector.js'
    ],
    /** * *
    * Initializes the Level constructor.
    * * **/
    init : function initLevelConstructor(Game, GameObject, GameMap, Action, View, MapPiece, Rectangle, MapView, Stage, Vector) {
        /** * *
        * Constructs new Levels.
        * @constructor
        * @nosideeffects
        * @return {Level}
        * * **/ 
        function Level() {
           Game.call(this,1024,512); 
           /** * *
           * The tile width.
           * @type {number}
           * * **/
           this.tileWidth = 32;
           /** * *
           * The tile height.
           * @type {number}
           * * **/
           this.tileHeight = 32;
           /** * *
           * The padding between objects in the object panel.
           * @type {number}
           * * **/
           this.objectPanelPadding = 4;
           /** * *
           * The number of objects layed out horizontally.
           * @type {number}
           * * **/
           this.objectColumns = 13;
        }

        Level.prototype = new Game(); 
        Level.prototype.constructor = Level;
        //-----------------------------
        //  METHODS
        //-----------------------------
        /** * *
        * Initializes the editor.
        * * **/
        Level.prototype.init = function Level_init() {
            Game.prototype.init.call(this);    
            // add our key hooks...
            this.addKeyDownAction(37/* LEFT */, new Action(function selectLeft() {
                this.selectionNdx--;
            }, this));
            this.addKeyDownAction(38/* UP */, new Action(function selectUp() {
                this.selectionNdx -= this.objectColumns;
            }, this));
            this.addKeyDownAction(39/* RIGHT */, new Action(function selectRight() {
                this.selectionNdx++;
            }, this));
            this.addKeyDownAction(40/* DOWN */, new Action(function selectDown() {
                this.selectionNdx += this.objectColumns;
            }, this));
            this.addKeyDownAction(13/* enter */, new Action(function drawObject() {
                // Copy JSON level to clipboard...
                
            }, this));
            this.addKeyDownAction(191 /* / */, new Action(function toggleHelp() {
                if (this.objectStage.canvas.parentNode.contains(this.helpPanel)) {
                    this.objectStage.canvas.parentNode.removeChild(this.helpPanel);
                } else {
                    this.objectStage.canvas.parentNode.insertBefore(this.helpPanel, this.objectStage.canvas);
                }
            }, this));

            var mouseIsDown = false;

            // Add our mouse hooks...
            this.addMouseAction('mouseout', new Action(function mouseOut(e) {
                    mouseIsDown = false;
            },this));
            this.addMouseAction('mousedown', new Action(function mouseDown(e) {
                if (e.offsetX > 512) {
                    // The mousedown happened in the map...
                    mouseIsDown = true;
                }

            },this));
            this.addMouseAction('mousemove', new Action(function mouseMove(e) {
                if (mouseIsDown && e.offsetX > 512) {
                    // Put down a tile!
                    this.putDownTileAt(e.offsetX,e.offsetY);
                }
            }, this));
            this.addMouseAction('mouseup', new Action(function mouseUp(e) {
                if (mouseIsDown && e.offsetX > 512) {
                    // Put down a tile!
                    this.putDownTileAt(e.offsetX,e.offsetY);
                } else {
                    // The mousedown happened in the object panel...
                    for (var i=0; i < this.objects.length; i++) {
                        var view = this.objects[i].view;
                        if (view.vectorToGlobal(view.localBoundary()).containsPoint(new Vector(e.offsetX,e.offsetY))) {
                            this.selectionNdx = i;
                            break;
                        }
                    }
                }
                mouseIsDown = false;
            },this));

            // add our views...
            this.stage.addView(this.objectPanel);
            this.stage.addView(this.mapView);
            this.stage.addView(this.statusBar);
            this.status = 'Select a game object with arrows. Hit / for help.';
            var self = this;
            setTimeout(function updateStatus() {
                self.status = self.selectionStatus;
            }, 3000);
        };
        /** * *
        * Serializes the level.
        * @return {String}
        * * **/
        Level.prototype.toJSON = function Level_toJSON() {
            
        };
        /** * *
        * The position of the game object at the given index.
        * @param {number} ndx
        * @return {Object}
        * * **/
        Level.prototype.positionOfObjectAtNdx = function Level_positionOfObjectAtNdx(ndx) {
            var p = {};
            var w = this.tileWidth + this.objectPanelPadding;
            var h = this.tileHeight + this.objectPanelPadding;
            var c = this.objectColumns;
            p.x = ((ndx%c) * w) + this.objectPanelPadding/2;
            p.y = (Math.floor(ndx/c) * h) + this.objectPanelPadding/2;
            return p;
        };
        /** * *
        * Finds the map index that corresponds to the given point.
        * @param {number} x
        * @param {number} y
        * @return {number}
        * * **/
        Level.prototype.determineMapNdxFromPoint = function Level_determineMapNdxFromPoint(x, y) {
            var mapX = x - this.mapView.x;
            var mapY = y - this.mapView.y;
            var xsIn = Math.floor(mapX/this.mapView.tileWidth);
            var ysIn = Math.floor(mapY/this.mapView.tileHeight);
            var ndx = this.mapView.tilesX*ysIn + xsIn;
            return ndx;
        };
        /** * *
        * Deposits a tile at the spot on the map.
        * @param {number} x
        * @param {number} y
        * * **/
        Level.prototype.putDownTileAt = function Level_putDownTileAt(x, y) {
            var destNdx = this.determineMapNdxFromPoint(x,y);
            this.mapView.tileNdx[destNdx] = this.selectionNdx;
            this.stage.needsDisplay = true;
        };
        //-----------------------------
        //  GETTERS/SETTERS
        //-----------------------------
        /** * *
        * Gets the gameMap property.
        * 
        * @returns {GameMap} gameMap 
        * * **/
        Level.prototype.__defineGetter__('gameMap', function Level_getgameMap() {
            if (!this._gameMap) {
                this._gameMap = new GameMap(16,16);
            }
            return this._gameMap;
        });
        /** * *
        * Gets the helpPanel property.
        * 
        * @returns {HTMLDivElement} helpPanel 
        * * **/
        Level.prototype.__defineGetter__('helpPanel', function Level_gethelpPanel() {
            if (!this._helpPanel) {
                var helpPanel = document.createElement('div');
                helpPanel.id = 'helpPanel';
                helpPanel.innerHTML = '<fieldset><legend>Help</legend><ul>' + [
                    '<li>/ - toggle help</li>',
                    '<li>p - toggle game object panel</li>',
                ].join('') + '</ul></fieldset>';
                helpPanel.style.cssText = [
                    'text-align:left;',
                    'position:absolute;',
                    'width:100%;',
                    'height:100%;',
                    'background-color:#484848;',
                    'color:white;'
                ].join('');
                this._helpPanel = helpPanel;
            }
            return this._helpPanel;
        });
        /** * *
        * Gets the mapView property.
        * 
        * @returns {MapView} mapView 
        * * **/
        Level.prototype.__defineGetter__('mapView', function Level_getmapView() {
            if (!this._mapView) {
                this._mapView = new MapView(512,0,512,512);
            }
            return this._mapView;
        });
        /** * *
        * Gets the mapSelector property. Its creation is deferred.
        * The view for the spot on the map the user is editing.
        * @returns {View} mapSelector 
        * * **/
        Level.prototype.__defineGetter__('mapSelector', function Level_getmapSelector() {
            if (!this._mapSelector) {
                var selector = new View(0,0,this.tileWidth,this.tileHeight);
                selector.context.fillStyle = 'rgba(255,255,255,0.3)';
                selector.context.strokeStyle = 'green';
                selector.context.fillRect(0,0,this.tileWidth,this.tileHeight);
                selector.context.strokeRect(0,0,this.tileWidth,this.tileHeight);
                this._mapSelector = selector;
            }
            return this._mapSelector;
        });
        /** * *
        * Gets the selectionNdx property.
        * The selection index is the index of the selected game object.
        * @returns {number} selectionNdx 
        * * **/
        Level.prototype.__defineGetter__('selectionNdx', function Level_getselectionNdx() {
            if (!this._selectionNdx) {
                this._selectionNdx = 0;
            }
            return this._selectionNdx;
        });
        /** * *
        * Sets the selectionNdx property.
        * Causes the status to be updated.
        * @param {number} 
        * * **/
        Level.prototype.__defineSetter__('selectionNdx', function Level_setselectionNdx(selectionNdx) {
                this._selectionNdx = selectionNdx < 0 ? this.objects.length-1 : selectionNdx%this.objects.length;
                this.status = this.selectionStatus;
                this.objectSelector.x = this.selection.view.x - this.objectPanelPadding/2;
                this.objectSelector.y = this.selection.view.y - this.objectPanelPadding/2;
        });
        /** * *
        * Gets the selectionStatus property. 
        * 
        * @returns {String} selectionStatus 
        * * **/
        Level.prototype.__defineGetter__('selectionStatus', function Level_getselectionStatus() {
            return this.selection.name + this.selection.description; 
        });
        /** * *
        * Gets the selection property. Its creation is deferred.
        * The GameObject that is currently selected.
        * @returns {GameObject} selection 
        * * **/
        Level.prototype.__defineGetter__('selection', function Level_getselection() {
            return this.objects[this.selectionNdx];
        });
        /** * *
        * Gets the objects property. Its creation is deferred.
        * The objects used in the level.
        * @returns {Array.<GameObjects>} objects 
        * * **/
        Level.prototype.__defineGetter__('objects', function Level_getobjects() {
            if (!this._objects) {
                this._objects = [
                    new MapPiece('Floor', ' - A floor tile', 'img/tiles.png', new Rectangle(0,0,32,32)),
                    new MapPiece('Wall (Top)', ' - A top wall tile', 'img/tiles.png', new Rectangle(32,0,32,32)),
                    new MapPiece('Wall (Middle)', ' - A middle wall tile', 'img/tiles.png', new Rectangle(32,32,32,32)),
                    new MapPiece('Wall (Bottom)', ' - A bottom wall tile', 'img/tiles.png', new Rectangle(32,64,32,32)),
                    new MapPiece('Wall to Door (Top)', ' - A top wall to door tile', 'img/tiles.png', new Rectangle(64,0,32,32)),
                    new MapPiece('Wall to Door (Middle)', ' - A middle wall to door tile', 'img/tiles.png', new Rectangle(64,32,32,32)),
                    new MapPiece('Wall to Door (Bottom)', ' - A bottom wall to door tile', 'img/tiles.png', new Rectangle(64,64,32,32)),
                    new MapPiece('Door (Top)', ' - A top door tile', 'img/tiles.png', new Rectangle(96,0,32,32)),
                    new MapPiece('Door (Middle)', ' - A middle door tile', 'img/tiles.png', new Rectangle(96,32,32,32)),
                    new MapPiece('Door (Bottom)', ' - A bottom door tile', 'img/tiles.png', new Rectangle(96,64,32,32)),
                    new MapPiece('Door to Wall (Top)', ' - A top door to wall tile', 'img/tiles.png', new Rectangle(128,0,32,32)),
                    new MapPiece('Door to Wall (Middle)', ' - A middle door to wall tile', 'img/tiles.png', new Rectangle(128,32,32,32)),
                    new MapPiece('Door to Wall (Bottom)', ' - A bottom door to wall tile', 'img/tiles.png', new Rectangle(128,64,32,32)),
                    new MapPiece('Vertical Wall (Top)', ' - A top vertical wall tile', 'img/tiles.png', new Rectangle(160,0,32,32)),
                    new MapPiece('Vertical Wall (Middle)', ' - A middle vertical wall tile', 'img/tiles.png', new Rectangle(160,32,32,32)),
                    new MapPiece('Vertical Wall (Bottom)', ' - A bottom vertical wall tile', 'img/tiles.png', new Rectangle(160,64,32,32)),
                    new MapPiece('Vertical Wall Repeating (Top)', ' - A cap to a repeating vertical wall tile', 'img/tiles.png', new Rectangle(192,0,32,32)),
                    new MapPiece('Vertical Wall Repeating', ' - A repeating vertical wall tile', 'img/tiles.png', new Rectangle(192,32,32,32)),
                ];
                var mv = this.mapView;
                this._objects.map(function(el) {
                    mv.addTile(el.view);
                });
            }
            return this._objects;
        });
        /** * *
        * Gets the objectSelector property.
        * If this is the first time objectSelector has been accessed, it is created and returned.
        * @returns {View} objectSelector 
        * * **/
        Level.prototype.__defineGetter__('objectSelector', function Level_getobjectSelector() {
            if (!this._objectSelector) {
                var w = this.tileWidth+this.objectPanelPadding;
                var h = this.tileHeight+this.objectPanelPadding;
                var objectSelector = new View(0,0,w,h);
                objectSelector.context.fillStyle = 'rgb(175,215,1)';
                objectSelector.context.fillRect(0,0,w,h);
                this._objectSelector = objectSelector;
            }
            return this._objectSelector;
        });
        /** * *
        * Gets the objectsContainer property.
        * If this is the first time objectsContainer has been accessed, it is created and returned.
        * @returns {View} objectsContainer 
        * * **/
        Level.prototype.__defineGetter__('objectsContainer', function Level_getobjectsContainer() {
            if (!this._objectsContainer) {
                var objectsContainer = new View(10,10);
                // Add things to it...
                objectsContainer.addView(this.objectSelector);
                for (var i=0; i < this.objects.length; i++) {
                    var obj = this.objects[i];
                    var p = this.positionOfObjectAtNdx(i);
                    obj.view.x = p.x; 
                    obj.view.y = p.y; 
                    objectsContainer.addView(obj.view);
                }
                this._objectsContainer = objectsContainer;
            }
                return this._objectsContainer;
        });
        /** * *
        * Gets the statusBar property. Its creation is deferred.
        * 
        * @returns {View} statusBar 
        * * **/
        Level.prototype.__defineGetter__('statusBar', function Level_getstatusBar() {
            if (!this._statusBar) {
                var bar = new View(0,512-20,1024,20);
                this._statusBar = bar;
            }
            return this._statusBar;
        });
        /** * *
        * The game object selection panel.
        * @returns {View} objectPanel 
        * * **/
        Level.prototype.__defineGetter__('objectPanel', function Level_getobjectPanel() {
            if (!this._objectPanel) {
                var panel = new View(0, 0, 512, 512);
                panel.context.fillStyle = 'rgb(48,48,48)';
                panel.context.fillRect(0,0,512,512);
                // Add things to it...
                panel.addView(this.objectsContainer);
                this._objectPanel = panel;
            }
            return this._objectPanel;
        });
        /** * *
        * Sets the status property.
        * Draws the status into the status bar.
        * @param {String} 
        * * **/
        Level.prototype.__defineSetter__('status', function Level_setstatus(status) {
            this.statusBar.context.clearRect(0,0,1024,20);
            this.statusBar.context.fillStyle = 'rgba(153,153,153,0.4)';
            this.statusBar.context.fillRect(0,0,1024,20);
            this.statusBar.context.fillStyle = 'white';
            this.statusBar.context.textBaseline = 'top';
            this.statusBar.context.font = 'Bold 12px sans-serif';
            this.statusBar.context.fillText(status,4,3);
        });
        return Level;
    }
});    

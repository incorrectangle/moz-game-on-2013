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
        'moon::Core/Game.js',
        'moon::Objects/GameObject.js',
        'moon::Events/Action.js',
        'bang::View/View.js',
        'moon::Objects/MapPiece.js',
        'bang::Geometry/Rectangle.js',
        'moon::View/MapView.js',
        'bang::View/Stage.js',
        'bang::Geometry/Vector.js',
        'moon::Objects/Actor.js',
        'moon::Objects/Moonen.js',
        'moon::Objects/Astronaut.js',
        'moon::Objects/JoltCola.js',
        'moon::Objects/KeyCartridge.js',
        'moon::Objects/Objects.js',
        'bang::Utils/Utils.js'
    ],
    /** * *
    * Initializes the Level constructor.
    * * **/
    init : function initLevelConstructor(Game, GameObject, Action, 
                                         View, MapPiece, Rectangle, MapView, 
                                         Stage, Vector, Actor, Moonen, 
                                         Astronaut, JoltCola, KeyCartridge, Objects) {
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
           /** * *
           * The name of this level.
           * @type {String}
           * * **/
           this.name = 'unnamed level';
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
                if (this.stage.canvas.parentNode.contains(this.helpPanel)) {
                    this.stage.canvas.parentNode.removeChild(this.helpPanel);
                    this._helpPanel = false;
                } else {
                    this.stage.canvas.parentNode.insertBefore(this.helpPanel, this.stage.canvas);
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
                        var view = this.objects[i].iconView;
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
            this.stage.addView(this.actorView);
            this.stage.addView(this.statusBar);
            this.status = 'Select a game object with arrows. Hit / for help.';
            var self = this;
            setTimeout(function updateStatus() {
                self.status = self.selectionStatus;
            }, 3000);

            // Run through our map and put down default tiles...
            for (var i=0; i < 256; i++) {
                this.updateMapNdxWithObjectAtNdx(i, 0);
            }
        };
        /** * *
        * Serializes the level.
        * @return {String}
        * * **/
        Level.prototype.toJSON = function Level_toJSON() {
           return JSON.stringify(this.JSONObject);
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
            p.x = 10 + ((ndx%c) * w) + this.objectPanelPadding/2;
            p.y = 10 + (Math.floor(ndx/c) * h) + this.objectPanelPadding/2;
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
        * Adds a tile to the appropriate MapView.
        * @param {GameObject} gameObject
        * * **/
        Level.prototype.addTileObject = function Level_addTileObject(gameObject) {
            [this.mapView,this.actorView][gameObject.tier].addTile(gameObject.iconView);
        };
        /** * *
        * Deposits a tile at the spot on the map.
        * @param {number} x
        * @param {number} y
        * * **/
        Level.prototype.putDownTileAt = function Level_putDownTileAt(x, y) {
            var destNdx = this.determineMapNdxFromPoint(x,y);
            var selectedNdx = this.selectionNdx;
            this.updateMapNdxWithObjectAtNdx(destNdx, selectedNdx);
        };
        /** * *
        * Add an object at the given index.
        * @param {GameObject} obj
        * @param {number} ndx
        * * **/
        Level.prototype.updateMapNdxWithObjectAtNdx = function Level_updateMapNdxWithObjectAtNdx(mapNdx,selectedNdx) {
            var obj = this.objects[selectedNdx];
            if (!obj) {
                return;
            }
            switch (obj.tier) {
                case 0: // Floor...
                    var objNdx = this.mapView.tiles.indexOf(obj.iconView);
                    this.mapView.tileNdx[mapNdx] = objNdx;
                break;
                case 1: // Actor...
                    var objNdx = this.actorView.tiles.indexOf(obj.iconView);
                    this.actorView.tileNdx[mapNdx] = objNdx;
                break;
                default:
            }

            this.stage.needsDisplay = true;
        };
        /** * *
        * Prints the level to the JS console.
        * * **/
        Level.prototype.print = function Level_print() {
            document.getElementById('output').innerText = JSON.stringify(this.JSONObject);
        };
        /** * *
        * Saves the current level.
        * * **/
        Level.prototype.store = function Level_store() {
            this.name = window.prompt('Please name this level:', this.name).replace(/ /g, '');
            this.description = window.prompt('And a brief description:', '...');
            var levels = JSON.parse(localStorage.getItem('levels')) || {};
            levels[this.name] = this.JSONObject;
            localStorage.setItem('levels',JSON.stringify(levels));
        };
        /** * *
        * Loads a level from the input textarea.
        * @param {String} name
        * * **/
        Level.prototype.load = function Level_load(name) {
            var object = false;
            if (name) {
                var levels = this.levels;
                for (var i=0; i < levels.length; i++) {
                    var level = levels[i];
                    if (level.name === name) {
                        object = level;
                        break;
                    }
                } 
            } else {
                var json = document.getElementById('input').value;
                object = JSON.parse(json);
            }
            this.fromJSONObject(object);
        };
        /** * *
        * Loads a level from a JSON object.
        * @param {Object}
        * * **/
        Level.prototype.fromJSONObject = function Level_fromJSONObject(obj) {
            this.name = obj.name;
            this.description = obj.description;
            // Now populate them with the new level's values...
            this.mapView.tileNdx = obj.floor;
            this.actorView.tileNdx = obj.actors;
        };
        //-----------------------------
        //  GETTERS/SETTERS
        //-----------------------------
        /** * *
        * Gets the levels property.
        * Levels stored in local storage.
        * @returns {Array} levels 
        * * **/
        Level.prototype.__defineGetter__('levels', function Level_getlevels() {
            var a = [];
            var json = JSON.parse(localStorage.getItem('levels')) || {};
            for (var name in json) {
                a.push(json[name]); 
            };
            return a;
        });
        /** * *
        * Gets the JSONObject property.
        * The JSON representation of this object.
        * @returns {Object} JSONObject 
        * * **/
        Level.prototype.__defineGetter__('JSONObject', function Level_getJSONObject() {
            var self = this;
            return {
                constructor : 'Level',
                name : this.name,
                description : this.description,
                floor : this.mapView.tileNdx,
                actors : this.actorView.tileNdx,
                ceiling : false
            };
        });
        /** * *
        * Gets the map property.
        * The actor's map.
        * @returns {Array.<GameObject>} map 
        * * **/
        Level.prototype.__defineGetter__('map', function Level_getmap() {
            if (!this._map) {
                var map = [];
                for (var i=0; i < 256; i++) {
                   map.push(0); 
                }
                this._map = map;
            }
            return this._map;
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
                helpPanel.innerHTML = [
                    '<fieldset>',
                    '<legend>Help & Options</legend>',
                    '<p>Use the mouse or arrows to select an object, then use the mouse to place the object on the map.</p>',
                    '<a href="#" onclick="editor.print()">Output (print) the current level</a> - reads to output below<br />',
                    '<a href="#" onclick="editor.load()">Input (load) a level into the editor</a> - reads from input below<br />',
                    '<a href="#" onclick="editor.store()">Save (store) the current level in local browser storage</a><br />',
                    '<span>&nbsp;</span>',
                    '<fieldset>',
                    '<legend>Stored Levels</legend>',
                    this.levels.map(function(level) {
                        return '<a style="float:left; margin-right:1em;" href="#" class="'+level.name+'" onclick="editor.load(\''+level.name+'\')">'+level.name+'<br /></a>&nbsp;';
                    }).join(''),
                    '</fieldset>',
                    '<fieldset>',
                    '<legend>Hotkeys</legend>',
                    '<p>/ - toggle help</p>',
                    '</fieldset>',
                    '</fieldset>',
                    '<fieldset>',
                    '<legend>Input & Output</legend>',
                    '<legend>Input</legend>',
                    '<textarea id="input" rows="10" style="width:100%;">',
                    '</textarea>',
                    '<legend>Output</legend>',
                    '<textarea id="output" rows="10" style="width:100%;" onclick="this.focus();this.select()">',
                    '</textarea>',
                ].join('');
                helpPanel.style.cssText = [
                    'text-align:left;',
                    'position:absolute;',
                    'width:100%;',
                    'height:100%;',
                    'color:white;'
                ].join('');
                var images = this.levels.map(function imagefyLevels(level) {
                    var image = Utils.StringToImage(JSON.stringify(level));
                    image.alt = 'A moonening map named '+level.name;
                    image.id = level.name;
                    var els = Array.prototype.slice.call(helpPanel.getElementsByClassName(level.name));
                    var el = els.shift();
                    el.appendChild(image);
                    return image;
                });
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
                this._mapView.tag = "mapView";
            }
            return this._mapView;
        });
        /** * *
        * Gets the actorView property.
        * 
        * @returns {MapView} actorView 
        * * **/
        Level.prototype.__defineGetter__('actorView', function Level_getactorView() {
            if (!this._actorView) {
                this._actorView = new MapView(512,0,512,512);
                this._actorView.tag = "actorView";
            }
            return this._actorView;
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
                this.objectSelector.x = this.selection.iconView.x - this.objectPanelPadding/2;
                this.objectSelector.y = this.selection.iconView.y - this.objectPanelPadding/2;
                this.objectPanel.addViewAt(this.objectSelector, 0);
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
                var self = this;
                var objects = new Objects();
                objects.map(function(object) {
                    self.addTileObject(object);
                });
                this._objects = objects;
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
                for (var i=0; i < this.objects.length; i++) {
                    var obj = this.objects[i];
                    var p = this.positionOfObjectAtNdx(i);
                    obj.iconView.x = p.x; 
                    obj.iconView.y = p.y; 
                    panel.addView(obj.iconView);
                }
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
            this.stage.addView(this.statusBar);
        });
        return Level;
    }
});    

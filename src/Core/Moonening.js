/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Moonening.js
* The moonening.
* Copyright (c) 12 Schell Scivally. All rights reserved.
* 
* @author   Schell Scivally 
* @since    Tue Nov 27 17:44:51 2012  
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Moonening',
    dependencies : [ 
        'moon::Core/Game.js',
        'moon::Events/Action.js',
        'moon::Core/Level.js',
        'bang::Utils/Utils.js'
    ],
    /** * *
    * Initializes the Moonening constructor.
    * * **/
    init : function initMooneningConstructor(Game, Action, Level, Utils) {
        /** * *
        * Constructs new Moonenings.
        * @constructor
        * @nosideeffects
        * @return {Moonening}
        * * **/ 
        function Moonening(levelImagePaths) {
            var self = this;
            function levelCompleteCallback() {
                self.loadNextLevel();
            }
            /** * *
            * The game's current level.
            * @type {Level} level
            * * **/
            this.level = new Level(levelCompleteCallback);
            /** * *
            * A list of levels made with the editor.
            * @type {Array.<Object>}
            * * **/
            this.editorLevels = [];
            var levels = JSON.parse(localStorage.getItem('levels'));
            for (var levelName in levels) {
                this.editorLevels.push(levels[levelName]);
            }
            /** * *
            * Levels to load in succession.
            * @type {Array.<Object>}
            * * **/
            this.levelsToLoad = levelImagePaths; 

            /** * *
            * A logging function!
            * * **/
            var log = document.createElement('div');
            log.id = 'log';
            document.body.appendChild(log);
            window.log = function (msg, color, size, weight) {
                msg = msg || '...';
                color = color || 'charcoal';
                size = size || '1em';
                weight = weight || 'normal';
                var span = [
                    '<span style="color:'+color+'; font-size:'+size+'; font-weight:'+weight+';">',
                    msg,
                    '</span><br>'
                ].join('');
                log.innerHTML = span + log.innerHTML;
            };
        }

        Moonening.prototype = new Game(); 
        Moonening.prototype.constructor = Moonening;
        //-----------------------------
        //  GETTERS/SETTERS
        //-----------------------------
        /** * *
        * Gets the editorLevelsPanel property.
        * 
        * @returns {HTMLDivElement} editorLevelsPanel 
        * * **/
        Moonening.prototype.__defineGetter__('editorLevelsPanel', function Moonening_geteditorLevelsPanel() {
            if (!this._editorLevelsPanel) {
                var self = this;
                var panel = document.createElement('fieldset');
                panel.className = 'right-panel';
                panel.innerHTML = [
                    '<legend>Controls</legend>',
                    '<fieldset>',
                    '<legend>Keys</legend>',
                    'Use Up,Down,Left,Right to move<br>',
                    'Click a saved level to load<br>',
                    '</fieldset>',
                ].join('');
                var savedLevels = document.createElement('fieldset');
                savedLevels.innerHTML = '<legend>Saved Editor Levels</legend>';
                panel.appendChild(savedLevels);
                var levels = this.editorLevels.map(function mapLevelImages(level) {
                    var a = document.createElement('a');
                    a.href = '#';
                    a.onclick = function clickedToLoadLevel() {
                        var levels = JSON.parse(localStorage.getItem('levels'));
                        var level = levels[this.id];
                        self.loadLevel(level);
                    };
                    a.innerHTML = level.name + '<br />';
                    a.className = 'level-link';
                    a.id = level.name;
                    var img = Utils.StringToImage(JSON.stringify(level));
                    a.appendChild(img);
                    savedLevels.appendChild(a);
                    savedLevels.appendChild(document.createElement('br'));
                    return a;
                });
                this._editorLevelsPanel = panel;
            }
            return this._editorLevelsPanel;
        });
        //-----------------------------
        //  METHODS
        //-----------------------------
        /** * *
        * Initializes the game.
        * * **/
        Moonening.prototype.init = function Moonening_init() {
            Game.prototype.init.call(this);    
            this.stage.canvas.id = 'moonening';
            // add our key hooks...
            this.addKeyDownAction(37/* LEFT */, new Action(function left() {
                this.level.reactor.react('left');
            }, this));
            this.addKeyDownAction(38/* UP */, new Action(function up() {
                this.level.reactor.react('up');
            }, this));
            this.addKeyDownAction(39/* RIGHT */, new Action(function right() {
                this.level.reactor.react('right');
            }, this));
            this.addKeyDownAction(40/* DOWN */, new Action(function down() {
                this.level.reactor.react('down');
            }, this));
            // Paint it black...
            this.stage.context.fillRect(0,0,512,512);
            // Add the level to the stage...
            this.stage.addView(this.level.view);
            // Add the saved editor levels...
            document.body.insertBefore(this.editorLevelsPanel, this.stage.canvas);
            // Load the first level!
            var levelImagePath = this.levelsToLoad.shift();
            this.loadLevelImage(levelImagePath);
        };
        /** * *
        * Loads a level image, given a path to that image.
        * @param {String}
        * * **/
        Moonening.prototype.loadLevelImage = function Moonening_loadLevelImage(imagePath) {
            var img = new Image();
            var self = this;
            img.onload = function serializeAndPlayLevel() {
                try {
                    var level = JSON.parse(Utils.ImageToString(img));
                    self.loadLevel(level);
                } catch (e) {
                    console.log(e.stack);
                    alert('Loading the level '+imagePath+' failed...bummer!');
                }
            };
            img.onerror = function badPath() {
                alert('Could not download the level '+imagePath);
            };
            img.src = imagePath;
        };
        /** * *
        * Loads a new level.
        * @param {Object} levelObject
        * * **/
        Moonening.prototype.loadLevel = function Moonening_loadLevel(levelObject) {
            this.level.load(levelObject);
        };
        /** * *
        * Loads the next level.
        * * **/
        Moonening.prototype.loadNextLevel = function Moonening_loadNextLevel() {
            var imagePath = this.levelsToLoad.shift();
            if (imagePath) {
                this.loadLevelImage(imagePath);
            } else {
                window.location.href = 'editor.html';
            }
        };
        return Moonening;
    }
});    

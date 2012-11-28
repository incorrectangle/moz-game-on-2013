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
        'moon::Game.js',
        'moon::Events/Action.js',
        'moon::Core/Level.js'
    ],
    /** * *
    * Initializes the Moonening constructor.
    * * **/
    init : function initMooneningConstructor(Game, Action, Level) {
        /** * *
        * Constructs new Moonenings.
        * @constructor
        * @nosideeffects
        * @return {Moonening}
        * * **/ 
        function Moonening() {
            /** * *
            * The game's current level.
            * @type {Level} level
            * * **/
            this.level = new Level();
        }

        Moonening.prototype = new Game(); 
        Moonening.prototype.constructor = Moonening;
        //-----------------------------
        //  METHODS
        //-----------------------------
        /** * *
        * Initializes the game.
        * * **/
        Moonening.prototype.init = function Moonening_init() {
             Game.prototype.init.call(this);    
            // add our key hooks...
            this.addKeyDownAction(37/* LEFT */, new Action(function left() {
            }, this));
            this.addKeyDownAction(38/* UP */, new Action(function up() {
            }, this));
            this.addKeyDownAction(39/* RIGHT */, new Action(function right() {
            }, this));
            this.addKeyDownAction(40/* DOWN */, new Action(function down() {
            }, this));
            // Add the level to the stage...
            this.stage.addView(this.level.view);
        };
        /** * *
        * Loads a new level.
        * @param {Object} levelObject
        * * **/
        Moonening.prototype.loadLevel = function Moonening_loadLevel(levelObject) {
            this.level.load(levelObject);
        };

        return Moonening;
    }
});    

/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Game.js
 * The game.
 * Copyright (c) 12 Schell Scivally. All rights reserved.
 * 
 * @author   Schell Scivally 
 * @since    Sat Nov 17 14:32:38 2012  
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Game',
    dependencies : [ 
        'moon::GameObject.js',
        'moon::Events/Action.js',
        'bang::View/Stage.js'
    ],
    /** * *
    * Initializes the Game constructor.
    * * **/
    init : function initGameConstructor(GameObject, Action, Stage) {
        /** * *
        * Constructs new Games.
        * @constructor
        * @nosideeffects
        * @return {Game}
        * * **/ 
        function Game() {
            /** * *
            * The game's stage.
            * @type {Stage}
            * * **/
            this.stage = new Stage(512,512);
            /** * *
            * A layering of game object maps.
            * @type {Array.<Array.<GameObject>>}
            * * **/
            this.objectMaps = this.objectMaps || [];
            /** * *
            * Key down actions.
            * @type {Array.<Array.<function>>}
            * * **/
            this.keyDownActions = [];
        }

        Game.prototype = {}; 
        Game.prototype.constructor = Game;
        //-----------------------------
        //  METHODS
        //-----------------------------
        /** * *
        * Initializes the game.
        * * **/
        Game.prototype.init = function Game_init() {
            document.body.appendChild(this.stage.canvas);

            var self = this;
            document.body.addEventListener('keydown', function(e) {
                console.log(e.keyCode);
                var actions = self.keyDownActions[e.keyCode];
                if (actions) {
                    for (var i=0; i < actions.length; i++) {
                        var action = actions[i].respond();
                    }
                }
            });
        };
        /** * *
        * Adds an action to the keydown actions.
        * @param {number} keyCode The code of the key that triggers the action.
        * @param {Action} action The action to trigger.
        * * **/
        Game.prototype.addKeyDownAction = function Game_addKeyDownAction(keyCode, action) {
            if (typeof this.keyDownActions[keyCode] === 'object') {
                this.keyDownActions[keyCode].push(action);
            } else {
                this.keyDownActions[keyCode] = [action];
            }
        };
        /** * *
        * Adds a new layer to the game.
        * @param {Array.<GameObject>}
        * * **/
        Game.prototype.addObjectMap = function Game_addObjectMap(map) {
                        
        };
        return Game;
    }
});    

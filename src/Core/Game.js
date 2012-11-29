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
        'moon::Objects/GameObject.js',
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
        function Game(w,h) {
            w = w || 512;
            h = h || 512;
            /** * *
            * The game's stage.
            * @type {Stage}
            * * **/
            this.stage = new Stage(w,h);
            /** * *
            * Key down actions.
            * @type {Array.<Array.<Action>>}
            * * **/
            this.keyDownActions = [];
            /** * *
            * Mouse actions.
            * @type {Array.<Array.<Action>>}
            * * **/
            this.mouseActions = [];
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
            window.onresize = function windowResize() {
            };
            document.body.addEventListener('keydown', function(e) {
                var actions = self.keyDownActions[e.keyCode];
                if (actions) {
                    for (var i=0; i < actions.length; i++) {
                        var action = actions[i].respond(e);
                    }
                }
            });
            function makeMouseResponder(eventName) {
                return function(e) {
                    var actions = self.mouseActions[eventName];
                    if (actions) {
                        for (var i=0; i < actions.length; i++) {
                            var action = actions[i].respond(e);
                        } 
                    }
                }
            }
            this.stage.canvas.addEventListener('mousedown', makeMouseResponder('mousedown'));
            this.stage.canvas.addEventListener('mousemove', makeMouseResponder('mousemove'));
            this.stage.canvas.addEventListener('mouseup', makeMouseResponder('mouseup'));
            this.stage.canvas.addEventListener('mouseover', makeMouseResponder('mouseover'));
            this.stage.canvas.addEventListener('mouseout', makeMouseResponder('mouseout'));
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
        * Adds an action to a mouse event.
        * @param {String} eventName
        * @param {Action} action
        * * **/
        Game.prototype.addMouseAction = function Game_addMouseAction(eventName, action) {
            if (typeof this.mouseActions[eventName] === 'object') {
                this.mouseActions[eventName].push(action);
            } else {
                this.mouseActions[eventName] = [action];
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

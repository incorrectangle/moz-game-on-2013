/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* GameObject.js
* A general game object.
* Copyright (c) 12 Schell Scivally. All rights reserved.
* 
* @author   Schell Scivally 
* @since    Sat Nov 17 12:02:53 2012  
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'GameObject',
    dependencies : [ 
        'moon::Events/Reactor.js',
        'moon::Events/Action.js',
        'moon::Events/ActionsDefault.js'
    ],
    /** * *
    * Initializes the GameObject constructor.
    * * **/
    init : function initGameObjectConstructor(Reactor, Action, ActionsDefault) {
        /** * *
        * Constructs new GameObjects.
        * @constructor
        * @nosideeffects
        * @return {GameObject}
        * * **/ 
        function GameObject() {
            /** * *
            * The name of this game object.
            * @type {String}
            * * **/
            this.name = "Game Object";
            /** * *
            * The description of this game object.
            * @type {String}
            * * **/
            this.description = " - a description of a game object.";
            /** * *
            * The tier that this game object lives on.
            * This will be a number from [0,2] 0 = floor, 1 = actor, 2 = ceiling.
            * @type {number}
            * * **/
            this.tier = 0;
            /** * *
            * Whether or not this object currently has focus.
            * @type {boolean}
            * * **/
            this.hasFocus = false;
            /** * *
            * The level that the actor is in.
            * @type {Object}
            * * **/
            this.level = false;
        }

        GameObject.prototype = {}; 
        GameObject.prototype.constructor = GameObject;
        //-----------------------------
        //  METHODS
        //-----------------------------
        /** * *
        * Forwards to reactor.react.
        * * **/
        GameObject.prototype.react = function GameObject_react() {
            this.reactor.react.apply(this.reactor, arguments);
        };
        //-----------------------------
        //  GETTERS/SETTERS
        //-----------------------------
        /** * *
        * Gets the view property.
        * If this is the first time view has been accessed, it is created and returned.
        * @returns {View} view 
        * * **/
        GameObject.prototype.__defineGetter__('iconView', function GameObject_geticonView() {
            if (!this._iconView) {
                this._iconView = new View();
            }
                return this._iconView;
        });
        /** * *
        * Gets the actions property.
        * This is used to populate the reactor's actions with.
        * @returns {Object.<String, Actions>} actions 
        * * **/
        GameObject.prototype.__defineGetter__('actions', function GameObject_getactions() {
            if (!this._actions) {
                this._actions = new ActionsDefault(this); 
            }
            return this._actions;
        });
        /** * *
        * Gets the reactor property.
        * Manages object events.
        * @returns {Reactor} reactor 
        * * **/
        GameObject.prototype.__defineGetter__('reactor', function GameObject_getreactor() {
            if (!this._reactor) {
                this._reactor = new Reactor(this.actions);
            }
            return this._reactor;
        });
        return GameObject;
    }
});    

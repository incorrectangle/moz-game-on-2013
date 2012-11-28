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
        
    ],
    /** * *
    * Initializes the GameObject constructor.
    * * **/
    init : function initGameObjectConstructor() {
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
        }

        GameObject.prototype = {}; 
        GameObject.prototype.constructor = GameObject;
        //-----------------------------
        //  METHODS
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
        * Gets the actions property. Its creation is deferred.
        * The actions this game object is capable of.
        * @returns {Object.<string, Action>} actions 
        * * **/
        GameObject.prototype.__defineGetter__('actions', function GameObject_getactions() {
            if (!this._actions) {
                this._actions = {}; 
            }
            return this._actions;
        });
        return GameObject;
    }
});    

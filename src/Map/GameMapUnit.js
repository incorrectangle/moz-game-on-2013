/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* GameMapUnit.js
* A three-tiered map unit used as thi canonical map piece.
* Copyright (c) 12 Schell Scivally. All rights reserved.
* 
* @author   Schell Scivally 
* @since    Sun Nov 18 13:28:30 2012  
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'GameMapUnit',
    dependencies : [ 
        'moon::Objects/GameObject.js'
    ],
    /** * *
    * Initializes the GameMapUnit constructor.
    * * **/
    init : function initGameMapUnitConstructor(GameObject) {
        /** * *
        * Constructs new GameMapUnits.
        * @constructor
        * @nosideeffects
        * @return {GameMapUnit}
        * * **/ 
        function GameMapUnit() {
        }

        GameMapUnit.prototype = {}; 
        GameMapUnit.prototype.constructor = GameMapUnit;
        //-----------------------------
        //  METHODS
        //-----------------------------
        /** * *
        * De-serializes this unit.
        * @return {GameMapUnit}
        * * **/
        //GameMapUnit.fromJSON = function GameMapUnit_fromJSON(jsonObject) {
        //    var unit = new GameMapUnit();
        //    
        //};
        //-----------------------------
        //  GETTERS/SETTERS
        //-----------------------------
        /** * *
        * Gets the JSONObject property.
        * The JSON representation of this object.
        * @returns {Object} JSONObject 
        * * **/
        GameMapUnit.prototype.__defineGetter__('JSONObject', function GameMapUnit_getJSONObject() {
            return {
                constructor : 'GameMapUnit',
                floor : this.floor.JSONObject,
                actor : this.actor.JSONObject,
                ceiling : this.ceiling.JSONObject
            };
        });
        /** * *
        * Gets the floor property. Its creation is deferred.
        * The floor represents the bottom tier.
        * @returns {GameObject} floor 
        * * **/
        GameMapUnit.prototype.__defineGetter__('floor', function GameMapUnit_getfloor() {
            if (!this._floor) {
                this._floor = new GameObject();
            }
            return this._floor;
        });
        /** * *
        * Sets the floor property.
        * 
        * @param {GameObject} 
        * * **/
        GameMapUnit.prototype.__defineSetter__('floor', function GameMapUnit_setfloor(floor) {
            this._floor = floor;
        });
        /** * *
        * Gets the actor property. Its creation is deferred.
        * The actor represents the middle tier.
        * @returns {GameObject} actor 
        * * **/
        GameMapUnit.prototype.__defineGetter__('actor', function GameMapUnit_getactor() {
            if (!this._actor) {
                this._actor = new GameObject();
            }
            return this._actor;
        });
        /** * *
         * Sets the actor property.
         * 
         * @param {GameObject} 
         * * **/
        GameMapUnit.prototype.__defineSetter__('actor', function GameMapUnit_setactor(actor) {
            this._actor = actor;
        });
        /** * *
         * Gets the ceiling property. Its creation is deferred.
         * The ceiling represents the top tier.
         * @returns {GameObject} ceiling 
         * * **/
        GameMapUnit.prototype.__defineGetter__('ceiling', function GameMapUnit_getceiling() {
            if (!this._ceiling) {
                this._ceiling = new GameObject();
            }
            return this._ceiling;
        });
        return GameMapUnit;
    }
});    

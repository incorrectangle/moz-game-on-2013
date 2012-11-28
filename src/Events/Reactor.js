/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Reactor.js
* Handles registering and dispatching actions, the latter which causes a
* 'reaction'. This is a fun little event pattern.
* Copyright (c) 12 Schell Scivally. All rights reserved.
* 
* @author   Schell Scivally 
* @since    Mon Nov 26 17:15:05 2012  
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Reactor',
    dependencies : [ 'moon::Events/Action.js' ],
    /** * *
    * Initializes the Reactor constructor.
    * * **/
    init : function initReactorConstructor(Actor) {
        /** * *
        * Constructs new Reactors.
        * @constructor
        * @nosideeffects
        * @return {Reactor}
        * * **/ 
        function Reactor() {
            
        }

        Reactor.prototype = {}; 
        Reactor.prototype.constructor = Reactor;
        //-----------------------------
        //  METHODS
        //-----------------------------
        /** * *
        * Adds an action to the actions list.
        * TODO: Have this return an id that can be used to remove the action, so
        * users don't have to hold a reference to the Action.
        * @param {String} eventName The name of the event that triggers the reaction.
        * @param {Action} action The action to react with.
        * * **/
        Reactor.prototype.addAction = function Reactor_addAction(eventName, action) {
            if (typeof this.actions[eventName] === 'object') {
                this.actions[eventName].push(action);
            } else {
                this.actions[eventName] = [action];
            }
        };
        /** * *
        * Removes an action from the actions list.
        * @param {String} eventName
        * @param {Action} action
        * * **/
        Reactor.prototype.removeAction = function Reactor_removeAction(eventName, action) {
            if (eventName in this.actions) {
                for (var i=0; i < this.actions[eventName].length; i++) {
                    var possibleMatchAction = this.actions[eventName][i];
                    if (possibleMatchAction === action) {
                        this.actions[eventName].splice(i, 1);
                        break;
                    }
                }
            }
        };
        /** * *
        * Executes the actions for a given event name.
        * @param {String} eventName The name of the event to trigger the actions of.
        * @param {*} payload Whatever the payload of the event is.
        * * **/
        Reactor.prototype.react = function Reactor_react(eventName, payload) {
            if (eventName in this.actions) {
                for (var i=0; i < this.actions[eventName].length; i++) {
                    var action = this.actions[eventName][i];
                    action.respond(payload);
                }
            }
        };
        //-----------------------------
        //  GETTERS/SETTERS
        //-----------------------------
        /** * *
        * Gets the actions property.
        * A list of action lists, keyed by event names.
        * @returns {Object.<String, Array.<Action>>} actions 
        * * **/
        Reactor.prototype.__defineGetter__('actions', function Reactor_getactions() {
            if (!this._actions) {
                this._actions = {};
            }
                return this._actions;
        });
        return Reactor;
    }
});    
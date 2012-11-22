/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Action.js
 * A game action. An action is something that happens in response to an
 * event. An action is bound to some kind of actor.
 * Copyright (c) 12 Schell Scivally. All rights reserved.
 * 
 * @author   Schell Scivally 
 * @since    Sat Nov 17 14:53:23 2012  
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Action',
    dependencies : [],
    /** * *
    * Initializes the Action constructor.
    * * **/
    init : function initActionConstructor() {
        /** * *
        * Constructs new Actions.
        * @constructor
        * @nosideeffects
        * @return {Action}
        * * **/ 
        function Action(response, actor) {
            /** * *
            * The action's response.
            * @type {function} 
            * * **/
            this.response = response || this.response || function emptyResponse() {
                console.log('This action response is empty',this);
            };
            /** * *
            * The action's actor.
            * @type {Object}
            * * **/
            this.actor = actor || this.actor || {};
        }

        Action.prototype = {}; 
        Action.prototype.constructor = Action;
        //-----------------------------
        //  METHODS
        //-----------------------------
        /** * *
        * Executes the response as the actor.
        * * **/
        Action.prototype.respond = function Action_respond() {
            this.response.apply(this.actor, arguments);
        };

        return Action;
    }
});    

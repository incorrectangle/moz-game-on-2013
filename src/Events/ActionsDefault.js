/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* ActionsDefault.js
* A set of default actions.
* Copyright (c) 12 Schell Scivally. All rights reserved.
* 
* @author   Schell Scivally 
* @since    Wed Nov 28 23:15:44 2012  
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'ActionsDefault',
    dependencies : [ 
        
    ],
    /** * *
    * Initializes the ActionsDefault constructor.
    * * **/
    init : function initActionsDefaultConstructor() {
        /** * *
        * Constructs new ActionsDefaults.
        * @constructor
        * @param {Object} actionOwner The owner of this set of actions.
        * @nosideeffects
        * @return {ActionsDefault}
        * * **/ 
        function ActionsDefault(actionOwner) {
            this.turn = new Action(function skipTurn() {
                // Call back async...
                var self = this;
                setTimeout(function () {
                    self.level.turnOver();
                }, 1);
            }, actionOwner);
            this.interact = new Action(function mingleIdly(actor) {
                console.log('The',this.name,'mingled idly with the',actor.name);
                this.level.turnOver();
            }, actionOwner);
        }

        ActionsDefault.prototype = {}; 
        ActionsDefault.prototype.constructor = ActionsDefault;
        //-----------------------------
        //  METHODS
        //-----------------------------

        return ActionsDefault;
    }
});    

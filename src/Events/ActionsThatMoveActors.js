/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* ActionsThatMoveActors.js
* A bundle of actions that move Actors.
* Copyright (c) 12 Schell Scivally. All rights reserved.
* 
* @author   Schell Scivally 
* @since    Thu Nov 29 15:38:00 2012  
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'ActionsThatMoveActors',
    dependencies : [ 
        'moon::Events/Action.js',
        'moon::Events/Reactor.js'
    ],
    /** * *
    * Initializes the ActionsThatMoveActors constructor.
    * * **/
    init : function initActionsThatMoveActorsConstructor(Action, Reactor) {
        /** * *
        * Constructs new ActionsThatMoveActorss.
        * @constructor
        * @nosideeffects
        * @return {ActionsThatMoveActors}
        * * **/ 
        function ActionsThatMoveActors(actor) {
            this.left = new Action(function moveLeft() {
                this.react('move','left');
            }, actor);
            this.right = new Action(function moveRight() {
                this.react('move','right');
            }, actor);
            this.up = new Action(function moveUp() {
                this.react('move','up');
            }, actor);
            this.down = new Action(function moveDown() {
                this.react('move','down');
            }, actor);
            this.move = new Action(function moveActor(direction) {
                var from = this.level.actorMap.indexOf(this);
                var moves = {
                    left : from - 1,
                    right : from + 1,
                    down : from + 16,
                    up : from - 16
                };

                var to = moves[direction];
                if (direction === 'right' && to%16 === 0) {
                    return;
                }
                if (direction === 'left' && to%16 === 15) {
                    return;
                }
                if (to < 0) {
                    return;
                }
                if (to > 255) {
                    return;
                }
                if (this.steps.length === 0) {
                    this.steps.push(from);
                }
                var interactionSuccess = false;
                var actorAtNewSpot = this.level.actorMap[to];
                if (actorAtNewSpot) {
                    actorAtNewSpot.react('interact',this);
                } else {
                    this.react('setNdx',from,to);
                }
            }, actor);
            this.setNdx = new Action(function setNdxFromTo(from, to) {
                this.steps.push(to);
                this.level.actorMap[from] = false;
                this.level.actorMap[to] = this;

                var nextPos = this.level.positionOfActorWithIndex(to);
                this.view.x = nextPos[0];
                this.view.y = nextPos[1];

                this.level.turnOver();
            }, actor);
        }
        ActionsThatMoveActors.prototype = {};         
        //-----------------------------
        //  METHODS
        //-----------------------------

        return ActionsThatMoveActors;
    }
});    

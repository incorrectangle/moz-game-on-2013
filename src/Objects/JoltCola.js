/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* JoltCola.js
* The astronaut game object.
* Copyright (c) 12 Schell Scivally. All rights reserved.
* 
* @author   Schell Scivally 
* @since    Tue Nov 27 20:41:09 2012  
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'JoltCola',
    dependencies : [ 
        'moon::Objects/Actor.js',
        'bang::Geometry/Rectangle.js',
        'moon::Objects/Astronaut.js',
        'moon::Objects/Moonen.js',
        'bang::Utils/Ease.js'
    ],
    /** * *
    * Initializes the JoltCola constructor.
    * * **/
    init : function initJoltColaConstructor(Actor, Rectangle) {
        /** * *
        * Constructs new JoltColas.
        * @constructor
        * @nosideeffects
        * @return {JoltCola}
        * * **/ 
        function JoltCola() {
            Actor.call(this,'Jolt Cola', ' - All the sugar and twice the caffeine. Oh, and twice the astronaut...', 'img/tiles.png', new Rectangle(192,64,32,32));
            this.constructor = 'JoltCola';
        }

        JoltCola.prototype = new Actor(); 
        JoltCola.prototype.constructor = JoltCola;
        //-----------------------------
        //  STATIC METHODS
        //-----------------------------
        /** * *
        * Returns a new JoltCola using a config object.
        * @return {JoltCola}
        * * **/
        JoltCola.fromJSONObject = function JoltCola_fromJSONObject() {
            return new JoltCola();
        };
        //-----------------------------
        //  GETTERS/SETTERS
        //-----------------------------
        /** * *
        * Gets the duplicateActor property.
        * 
        * @returns {Action} duplicateActor 
        * * **/
        JoltCola.prototype.__defineGetter__('duplicateActor', function JoltCola_getduplicateActor() {
            if (!this._duplicateActor) {
                var constructors = {
                    'Astronaut' : Astronaut,
                    'Moonen' : Moonen
                };
                this._duplicateActor = new Action(function duplicateByWayOfJoltCola(actor) {
                    console.log('The',actor.name,'drank Jolt Cola! Twice the caffeine!!!');
                    var selfNdx = this.level.actorMap.indexOf(this);
                    var obj = actor.JSONObject;
                    var newActor = constructors[obj.constructor].fromJSONObject(obj);
                    var pos = this.level.positionOfActorWithIndex(selfNdx);
                    newActor.view.x = pos[0];
                    newActor.view.y = pos[1];
                    newActor.view.alpha = 0;
                    newActor.level = this.level;
                    this.level.actorMap[selfNdx] = newActor;
                    var turnNdx = this.level.actorsWithATurn.indexOf(this);
                    if (turnNdx !== -1) {
                        this.level.actorsWithATurn[turnNdx] = newActor;
                    }
                    this.view.parent.removeView(this.view);
                    new Ease({
                        target : newActor.view,
                        properties : {
                            alpha : 1
                        },
                        duration : 500
                    }).interpolate();
                    this.level.turnOver();
                }, this);
            }
            return this._duplicateActor;
        });
        /** * *
        * Gets the reactor property.
        * 
        * @returns {Reactor} reactor 
        * * **/
        JoltCola.prototype.__defineGetter__('reactor', function JoltCola_getreactor() {
            if (!this._reactor) {
                this._reactor = new Reactor();
                var actions = this.actions;
                delete actions['interact'];
                this._reactor.addActionBundle(actions);
                this._reactor.addAction('interact', this.duplicateActor);
            }
            return this._reactor;
        });
        /** * *
        * Gets the JSONObject property.
        * 
        * @returns {Object} JSONObject 
        * * **/
        JoltCola.prototype.__defineGetter__('JSONObject', function JoltCola_getJSONObject() {
            return {
                constructor : 'JoltCola',
            };
        });
        //-----------------------------
        //  METHODS
        //-----------------------------

        return JoltCola;
    }
});

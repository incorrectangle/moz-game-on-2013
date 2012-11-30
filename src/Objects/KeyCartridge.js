/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* KeyCartridge.js
* The astronaut game object.
* Copyright (c) 12 Schell Scivally. All rights reserved.
* 
* @author   Schell Scivally 
* @since    Tue Nov 27 20:41:09 2012  
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'KeyCartridge',
    dependencies : [ 
        'moon::Objects/Actor.js',
        'bang::Geometry/Rectangle.js',
        'moon::Events/Reactor.js',
        'bang::Utils/Ease.js',
        'moon::Events/Action.js'
    ],
    /** * *
    * Initializes the KeyCartridge constructor.
    * * **/
    init : function initKeyCartridgeConstructor(Actor, Rectangle, Reactor, Ease, Action) {
        /** * *
        * Constructs new KeyCartridges.
        * @constructor
        * @nosideeffects
        * @return {KeyCartridge}
        * * **/ 
        function KeyCartridge() {
            Actor.call(this,'Key Cartridge', ' - 16 bits of door opening mayhem...', 'img/tiles.png', new Rectangle(192,96,32,32));
            this.constructor = 'KeyCartridge';

            this.reactor.removeAction('interact', this.actions.interact);
            this.reactor.addAction('interact', this.interact);
        }

        KeyCartridge.prototype = new Actor(); 
        KeyCartridge.prototype.constructor = KeyCartridge;
        //-----------------------------
        //  STATIC METHODS
        //-----------------------------
        /** * *
        * Creates a new KeyCartridge from a config object.
        * @param {Object} object
        * * **/
        KeyCartridge.fromJSONObject = function KeyCartridge_fname(object) {
            return new KeyCartridge();
        };
        //-----------------------------
        //  GETTERS/SETTERS
        //-----------------------------
        /** * *
        * Gets the interact property.
        * 
        * @returns {Action} interact 
        * * **/
        KeyCartridge.prototype.__defineGetter__('interact', function KeyCartridge_getinteract() {
            if (!this._interact) {
                this._interact = new Action(function theKeyToMyHeart(whoGetsIt) {
                    // The key is taken, but there can only be one highlander!
                    var selfNdx = this.level.actorMap.indexOf(this);
                    var whosNdx = this.level.actorMap.indexOf(whoGetsIt);
                    whoGetsIt.react('setNdx',whosNdx, selfNdx);
                    this.level.removeActor(this);

                    var self = this;
                    new Ease({
                        delay : 500,
                        target : self.view,
                        properties : {
                            scaleX : 2,
                            scaleY : 2,
                            y : self.view.y + 50,
                            x : self.view.x - self.view.width
                        },
                        onComplete : function removeBigAssKeyRightDurrr() {
                            self.view.parent.removeView(self.view);
                        }
                    }).interpolate();
                });
            }
            return this._interact;
        });
        /** * *
        * Gets the JSONObject property.
        * 
        * @returns {Object} JSONObject 
        * * **/
        KeyCartridge.prototype.__defineGetter__('JSONObject', function KeyCartridge_getJSONObject() {
            return {
                constructor : 'KeyCartridge',
            };
        });
        //-----------------------------
        //  METHODS
        //-----------------------------

        return KeyCartridge;
    }
});

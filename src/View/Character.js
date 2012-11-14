/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Character.js
 * A character, player or otherwise.
 * Copyright (c) 12 Schell Scivally. All rights reserved.
 * 
 * @author   Schell Scivally 
 * @since    Tue Nov 13 20:44:47 2012  
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Character',
    dependencies : [ 
        'bang::View/View.js',
        'moon::View/Toon.js',
        'bang::Geometry/Vector.js'
    ],
    /** * *
     * Initializes the Character constructor.
     * * **/
    init : function initCharacterConstructor(View, Toon, Vector) {
        /** * *
        * Constructs new Characters.
        * @constructor
        * @nosideeffects
        * @return {Character}
        * * **/ 
        function Character() {
           View.apply(this, arguments);
           /** * *
           * A toon to hold all our animations.
           * @type {Toon}
           * * **/
           this.toon = new Toon();
           /** * *
           * A point vector to hold the character's position (on the map). 
           * Take note that this is not the x,y position in the parent view.
           * @type {Vector}
           * * **/
           this.position = new Vector(0,0);

           this.addView(this.toon);
        }

        Character.prototype = new View();
        Character.prototype.constructor = Character;
        //-----------------------------
        //  METHODS
        //-----------------------------

        return Character;
    }
});    

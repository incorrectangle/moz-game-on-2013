/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* Objects.js
* A list of the used game objects.
* Copyright (c) 12 Schell Scivally. All rights reserved.
* 
* @author   Schell Scivally 
* @since    Wed Nov 28 09:39:41 2012  
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'Objects',
    dependencies : [ 
        'moon::Objects/MapPiece.js',
        'moon::Objects/Actor.js',
        'moon::Objects/Astronaut.js',
        'moon::Objects/KeyCartridge.js',
        'moon::Objects/JoltCola.js',
        'moon::Objects/Moonen.js',
        'bang::Geometry/Rectangle.js',
        'moon::Objects/Crate.js'
    ],
    /** * *
    * Initializes the Objects constructor.
    * * **/
    init : function initObjectsConstructor(MapPiece, Actor, Astronaut, KeyCartridge, JoltCola, Moonen, Rectangle, Crate) {
        /** * *
        * Constructs new Objectss.
        * @constructor
        * @nosideeffects
        * @return {Objects}
        * * **/ 
        function Objects() {
             var objects = [
                new MapPiece('Floor', ' - A floor tile', 'img/tiles.png', new Rectangle(0,0,32,32)),
                new Actor('Nothing', ' - Exactly what you think it is.', 'img/tiles.png', new Rectangle(511,511,1,1)),
                new Crate(),
                new Astronaut(),
                new KeyCartridge(),
                new JoltCola(),
                new Moonen('red'),
                new Moonen('green'),
                new Moonen('blue'),
                new Moonen('black'),
                new Moonen('orange'),
                new Moonen('pink')
            ];
            for (var i=0; i < objects.length; i++) {
                this.push(objects[i]);
            }
        }

        Objects.prototype = []; 
        Objects.prototype.constructor = Objects;
        //-----------------------------
        //  METHODS
        //-----------------------------

        return Objects;
    }
});    

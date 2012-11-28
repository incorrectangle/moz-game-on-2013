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
        'bang::Geometry/Rectangle.js'
    ],
    /** * *
    * Initializes the Objects constructor.
    * * **/
    init : function initObjectsConstructor(MapPiece, Actor, Astronaut, KeyCartridge, JoltCola, Moonen, Rectangle) {
        /** * *
        * Constructs new Objectss.
        * @constructor
        * @nosideeffects
        * @return {Objects}
        * * **/ 
        function Objects() {
             var objects = [
                new MapPiece('Floor', ' - A floor tile', 'img/tiles.png', new Rectangle(0,0,32,32)),
                new MapPiece('Wall (Top)', ' - A top wall tile', 'img/tiles.png', new Rectangle(32,0,32,32)),
                new MapPiece('Wall (Middle)', ' - A middle wall tile', 'img/tiles.png', new Rectangle(32,32,32,32)),
                new MapPiece('Wall (Bottom)', ' - A bottom wall tile', 'img/tiles.png', new Rectangle(32,64,32,32)),
                new MapPiece('Wall to Door (Top)', ' - A top wall to door tile', 'img/tiles.png', new Rectangle(64,0,32,32)),
                new MapPiece('Wall to Door (Middle)', ' - A middle wall to door tile', 'img/tiles.png', new Rectangle(64,32,32,32)),
                new MapPiece('Wall to Door (Bottom)', ' - A bottom wall to door tile', 'img/tiles.png', new Rectangle(64,64,32,32)),
                new MapPiece('Door (Top)', ' - A top door tile', 'img/tiles.png', new Rectangle(96,0,32,32)),
                new MapPiece('Door (Middle)', ' - A middle door tile', 'img/tiles.png', new Rectangle(96,32,32,32)),
                new MapPiece('Door (Bottom)', ' - A bottom door tile', 'img/tiles.png', new Rectangle(96,64,32,32)),
                new MapPiece('Door to Wall (Top)', ' - A top door to wall tile', 'img/tiles.png', new Rectangle(128,0,32,32)),
                new MapPiece('Door to Wall (Middle)', ' - A middle door to wall tile', 'img/tiles.png', new Rectangle(128,32,32,32)),
                new MapPiece('Door to Wall (Bottom)', ' - A bottom door to wall tile', 'img/tiles.png', new Rectangle(128,64,32,32)),
                new MapPiece('Vertical Wall (Top)', ' - A top vertical wall tile', 'img/tiles.png', new Rectangle(160,0,32,32)),
                new MapPiece('Vertical Wall (Middle)', ' - A middle vertical wall tile', 'img/tiles.png', new Rectangle(160,32,32,32)),
                new MapPiece('Vertical Wall (Bottom)', ' - A bottom vertical wall tile', 'img/tiles.png', new Rectangle(160,64,32,32)),
                new MapPiece('Vertical Wall Repeating (Top)', ' - A cap to a repeating vertical wall tile', 'img/tiles.png', new Rectangle(192,0,32,32)),
                new MapPiece('Vertical Wall Repeating', ' - A repeating vertical wall tile', 'img/tiles.png', new Rectangle(192,32,32,32)),
                new Actor('Nothing', ' - Exactly what you think it is.', 'img/tiles.png', new Rectangle(511,511,1,1)),
                new Astronaut(),
                new KeyCartridge(),
                new JoltCola(),
                new Moonen('red'),
                new Moonen('green'),
                new Moonen('blue'),
                new Moonen('black')
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

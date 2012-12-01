/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* MoonenView.js
* A view for the moonen.
* Copyright (c) 12 Schell Scivally. All rights reserved.
* 
* @author   Schell Scivally 
* @since    Sat Dec  1 10:44:21 2012  
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'MoonenView',
    dependencies : [ 
        'moon::View/Sprite.js',
        'bang::Geometry/Rectangle.js'
    ],
    /** * *
    * Initializes the MoonenView constructor.
    * * **/
    init : function initMoonenViewConstructor(Sprite, Rectangle) {
    /** * *
    * Constructs new MoonenViews.
    * @constructor
    * @nosideeffects
    * @return {MoonenView}
    * * **/ 
    function MoonenView() {
        Sprite.call(this,0,0,32,32,'img/tiles.png',[
            new Rectangle(3*32,5*32,32,32), // 0 - front tall
            new Rectangle(4*32,5*32,32,32), // 1 - front squat
            new Rectangle(3*32,6*32,32,32), // 2 - back tall
            new Rectangle(4*32,6*32,32,32), // 3 - back squat
            new Rectangle(5*32,5*32,32,32), // 4 - jump forward
            new Rectangle(5*32,6*32,32,32), // 5 - jump back
            new Rectangle(6*32,5*32,32,32), // 6 - die 1
            new Rectangle(7*32,5*32,32,32), // 7 - die 2
            new Rectangle(8*32,5*32,32,32), // 8 - die 3
        ]);
    }

    MoonenView.prototype = new Sprite(); 
    MoonenView.prototype.constructor = MoonenView;
    //-----------------------------
    //  METHODS
    //-----------------------------
    /** * *
    * Kills and removes tho moonen view.
    * * **/
    MoonenView.prototype.die = function MoonenView_die() {
        this.framesPerSecond = 2;
        this.firstFrame = 6;
        this.lastFrame = 8;
        this.framesToPlay = 3;
        this.isPlaying = true;
        this.onComplete = function () {
            if (this.parent && this.parent.displayList.indexOf(this) !== -1) {
                this.parent.removeView(this);
                this.isPlaying = false;
                this.onComplete = false;
            }
        };
    };
    return MoonenView;
    }
});    

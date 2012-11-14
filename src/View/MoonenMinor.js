/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * MoonenMinor.js
 * The minor moonen.
 * Copyright (c) 12 Schell Scivally. All rights reserved.
 * 
 * @author   Schell Scivally 
 * @since    Tue Nov 13 20:39:49 2012  
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/
mod({
    name : 'MoonenMinor',
    dependencies : [ 
        'bang::View/View.js',
        'moon::View/Character.js'
    ],
    /** * *
    * Initializes the MoonenMinor constructor.
    * * **/
    init : function initMoonenMinorConstructor(View, Character) {
        /** * *
        * Constructs new MoonenMinors.
        * @constructor
        * @nosideeffects
        * @return {MoonenMinor}
        * * **/ 
        function MoonenMinor() {

        }

        MoonenMinor.prototype = new Character(); 
        MoonenMinor.prototype.constructor = MoonenMinor;
        //-----------------------------
        //  METHODS
        //-----------------------------

        return MoonenMinor;
    }
});    

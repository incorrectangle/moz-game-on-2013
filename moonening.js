function initMoonening() {
    (function initModCompilation(window) {
        var modules = {};/// Vector from bang::Geometry/Vector.js
        modules.Vector = (function initVector() {
            /** * *
            * Creates a new instance of vector.
            * * **/
            function Vector() {
                this.length = arguments.length;
                for (var i=0; i < arguments.length; i++) {
                    this[i] = arguments[i];
                }
            }
            
            Vector.prototype = [];
            
            Vector.prototype.constructor = Vector;
            //--------------------------------------
            //  METHODS
            //--------------------------------------
            /** * *
            * Returns the string representation of the Vector.
            * @return {string}
            * * **/
            Vector.prototype.toString = function Vector_toString() {
                return 'Vector['+Array.prototype.toString.call(this)+']';
            };
            /** * *
            * Folds left (starting at zero) along the vector using function f, 
            * which takes an accumulator and an element and returns
            * a new accumulator value - acc is the initial accumulator
            * value. Returns the resulting accumulator.
            * @param function (accumulator, element)
            * @param object
            * @nosideeffects
            * * **/
            Vector.prototype.foldl = function Vector_foldl(f, acc) {
                for (var i=0; i < this.length; i++) {
                    acc = f(acc, this[i]);
                }
                return acc;
            };
            /** * *
            * Folds right (starting at this.length) along the vector 
            * using function f, which takes an element and an accumulator
            * and returns a new accumulator value - acc is the initial accumulator
            * value. Returns the resulting accumulator.
            * @param function (element, accumulator)
            * @param object
            * @nosideeffects
            * * **/
            Vector.prototype.foldr = function Vector_foldr(f, acc) {
                for (var i = this.length - 1; i >= 0; i--){
                    acc = f(this[i], acc);
                }
                return acc;
            };
            /** * *
            * Maps a function over the vector, creating a new vector
            * with the return values.
            * @param {function(*, number, Array.<*>)}
            * @return {Vector}
            * @nosideeffects
            * * **/
            Vector.prototype.map = function Vector_map(f) {
                var copy = new this.constructor();
                for (var i = this.length - 1; i >= 0; i--){
                    copy[i] = f(this[i],i,this);
                }
                copy.length = this.length;
                return copy;
            };
            /** * *
            * Maps function f over all elements, collecting elements
            * in a new array that return true when fed to f, until f returns false.
            * @param {function(*, number): *}
            * @return {Vector}
            * @nosideeffects
            * * **/
            Vector.prototype.takeWhile = function Vector_takeWhile(f) {
                var a = new this.constructor();
                var i = 0;
                for (i; i < this.length; i++) {
                    var element = this[i];
                    if (f(element, i)) {
                        a[i] = this[i];
                    } else {
                        break;
                    }
                }
                a.length = i;
                return a;
            };
            /** * *
            * Returns whether or not array a is equal to this.
            * @param {Vector}
            * @return {boolean}
            * @nosideeffects
            * * **/
            Vector.prototype.isEqualTo = function Vector_isEqualTo(a) {
                if (this.length !== a.length) {
                    return false;
                }
                var b = this.takeWhile(function (el, ndx) {
                    return el === a[ndx];
                });
                return this.length === b.length;
            };
            /** * *
            * Returns a copy of this vector.
            * @return {Vector}
            * @nosideeffects
            * * **/
            Vector.prototype.copy = function Vector_copy() {
                return this.takeWhile(function (el) {
                    return true;
                });
            };
            /** * *
            * Returns the addition of Vector v and this.
            * @param {Vector}
            * @return {Vector}
            * @nosideeffects
            * * **/
            Vector.prototype.add = function Vector_add(v) {
                return this.foldl(function (acc, element) {
                    acc.push(element + v[acc.length]);
                    return acc;
                }, new this.constructor());
            };
            /** * *
            * Returns the subtraction of Vector v from this.
            * @param {Vector}
            * @return {Vector}
            * @nosideeffects
            * * **/
            Vector.prototype.subtract = function Vector_subtract(v) {
                return this.foldl(function (acc, element) {
                    acc.push(element - v[acc.length]);
                    return acc;
                }, new this.constructor());
            };
            /** * *
            * Gets and sets the x value.
            * @param {number}
            * @return {number}
            * * **/
            Vector.prototype.x = function Vector_x(x) {
                if (arguments.length) {
                    this[0] = x;
                }
                return this[0];
            };
            /** * *
            * Gets and sets the y value.
            * @param {number}
            * @return {number}
            * * **/
            Vector.prototype.y = function Vector_y(y) {
                if (arguments.length) {
                    this[1] = y;
                }
                return this[1];
            };
            /** * *
            * Returns the magnitude of this vector.
            * @return {number}
            * @nosideeffects
            * * **/
            Vector.prototype.magnitude = function Vector_magnitude() {
                var total = this.foldr(function (element, acc) {
                    return element*element+acc;
                }, 0);
                return Math.sqrt(total);
            };
            /** * *
            * Returns the unit vector of this vector.
            * @return {Vector}
            * @nosideeffects
            * * **/
            Vector.prototype.normalize = function Vector_normalize() {
                var magnitude = this.magnitude();
                return this.foldr(function (element, acc) {
                    acc.unshift(element/magnitude);
                    return acc;
                }, new this.constructor());
            };
            /** * *
            * Returns the point at a given index. Zero indexed.
            * For example, pointAt(1) would return the second point.
            * @param {number}
            * @return {Vector}
            * * **/
            Vector.prototype.pointAt = function Vector_pointAt(n) {
                var ndx = 2*n;
                return new Vector(this[ndx], this[ndx+1]);
            };
            
            /** * *
            * Returns the intersection point of two lines or false
            * if they do not intersect.
            * @param {Vector}
            * @param {Vector}
            * @return {Vector|false}
            * * **/
            Vector.lineIntersection = function Vector_lineIntersection(vec1, vec2) {
                var p1 = vec1.pointAt(0);
                var p2 = vec1.pointAt(1);
                var p3 = vec2.pointAt(0);
                var p4 = vec2.pointAt(1);
                /** * *
                * Returns the equation of a line segment formed by p1->p2.
                * @return {Object}
                * * **/
                function getLineEquation(p1, p2) {
                    // y = mx + b
                    // b = y - mx
                    // x = (y - b) / m
                    var m = (p2.y() - p1.y()) / (p2.x() - p1.x());
                    var b = p2.y() - m*p2.x();
                    return {
                        // slope, rise over run...
                        m : m,
                        b : b,
                        xAty : function(y) {
                            return (y - b) / m;
                        },
                        yAtx : function(x) {
                            return m*x + b;
                        }
                    };
                }
                    
                var e1,e2,x,y;
                e1 = getLineEquation(p1, p2);
                e2 = getLineEquation(p3, p4);
                    
                if (e1.m === e2.m) {
                    // These lines are co-linear and do not intersect...
                    return false;
                } else if (Math.abs(e1.m) === Number.POSITIVE_INFINITY) {
                    x = p2.x();
                    y = e2.yAtx(x);
                } else if (Math.abs(e2.m) === Number.POSITIVE_INFINITY) {
                    x = p4.x();
                    y = e1.yAtx(x);
                } else {
                    x = e2.b / (e1.m + e1.b - e2.m);
                    y = e2.yAtx(x);
                }
                return new Vector(x, y);
            };
            
            return Vector;
        })();
    /// Polygon from bang::Geometry/Polygon.js
        modules.Polygon = (function initPolygon(Vector) {
            /** * *
            * Creates a new polygon
            * @param ...
            * @return {Polygon}
            * @constructor
            * * **/
            function Polygon() {
               Vector.apply(this, Array.prototype.slice.call(arguments));
            }
            
            Polygon.prototype = new Vector();
            
            Polygon.prototype.constructor = Polygon;
            //--------------------------------------
            //  METHODS
            //--------------------------------------
            /** * *
            * Returns the string representation of the polygon.
            * @return {string}
            * * **/
            Polygon.prototype.toString = function() {
                return 'Polygon['+Array.prototype.toString.call(this)+']';
            };
            /** * *
            * Returns whether or not the polygon contains the point p.
            * @param {Vector}
            * @returns {boolean}
            * @nosideeffects
            * * **/
            Polygon.prototype.containsPoint = function Polygon_containsPoint(p) {
                var x = p[0];
                var y = p[1];
                var xp = [];
                var yp = [];
                var ncomp = this.length;
                var npol = ncomp/2;
                    
                for (var i = 0; i < ncomp; i+=2) {
                    xp.push(this[i]);
                    yp.push(this[i+1]);
                }
        
                var j = npol - 1;
                var c = false;
                for (i = 0; i < npol; j = i++) {
                    if ((((yp[i] <= y) && (y < yp[j])) ||
                         ((yp[j] <= y) && (y < yp[i]))) &&
                        (x < (xp[j] - xp[i]) * (y - yp[i]) / (yp[j] - yp[i]) + xp[i])) {
                            c = !c;
                    }
                }
                return c;
            };
            
            return Polygon;
        })(modules.Vector);
    /// Rectangle from bang::Geometry/Rectangle.js
        modules.Rectangle = (function initRectangle(Vector, Polygon) {
            /** * *
            * Creates a new rectangle at (x,y) with width w and height h.
            * @param {number}
            * @param {number}
            * @param {number}
            * @param {number}
            * @return Rectangle
            * @nosideeffects
            * @constructor
            * * **/
            function Rectangle(x,y,w,h) {
                x = x || 0;
                y = y || 0;
                w = w || 0;
                h = h || 0;
                
                this.left(x);
                this.top(y);
                this.width(w);
                this.height(h);
                this.length = 8;
            }
            
            Rectangle.prototype = new Polygon();
            
            Rectangle.prototype.constructor = Rectangle;
            
            //--------------------------------------
            //  METHODS
            //--------------------------------------
            /** * *
            * Returns the string representation of this Rectangle.
            * @return {string}
            * * **/
            Rectangle.prototype.toString = function Rectangle_toString() {
                return 'Rectangle['+this.left()+','+this.top()+','+this.width()+','+this.height()+']';
            };
            /** * *
            * Gets and sets the left edge x value.
            * @param {number}
            * @return {number}
            ** * */
            Rectangle.prototype.left = function Rectangle_left(l) {
                if (typeof l === 'number') {
                    this[0] = l;
                    this[6] = l;
                }
                return this[0];
            };
            /** * *
            * Gets and sets the top edge y value.
            * @param {number}
            * @return {number}
            ** * */
            Rectangle.prototype.top = function Rectangle_top(t) {
                if (typeof t === 'number') {
                    this[1] = t;
                    this[3] = t;
                }
                return this[1];
            };
            /** * *
            * Gets and sets the right edge x value.
            * @param {number}
            * @return {number}
            * * **/
            Rectangle.prototype.right = function Rectangle_right(r) {
                if (typeof r === 'number') {
                    this[2] = r;
                    this[4] = r;
                }
                return this.left() + this.width();
            };
            /** * *
            * Gets and sets the bottom edge y value.
            * @param {number}
            * @return {number}
            * * **/
            Rectangle.prototype.bottom = function Rectangle_bottom(b) {
                if (typeof b === 'number') {
                    this[5] = b;
                    this[7] = b;
                }
                return this.top() + this.height();
            };
            /** * *
            * Gets and sets the width of this Rectangle.
            * @param {number}
            * @return {number}
            * * **/
            Rectangle.prototype.width = function Rectangle_width(w) {
                if (typeof w === 'number') {
                    var x = this.left() + w;
                    this[2] = x;
                    this[4] = x;
                }
                return this[2] - this[0];
            };
            /** * *
            * Returns the height of this Rectangle
            * @param {number}
            * @return {number}
            * * **/
            Rectangle.prototype.height = function Rectangle_height(h) {
                if (typeof h === 'number') {
                    var y = this.top() + h;
                    this[5] = y;
                    this[7] = y;
                }
                return this[5] - this[1];
            };
            /** * *
            * Returns the area (in pixels^2) of this rectangle
            * @return {number}
            * @nosideeffects
            * * **/
            Rectangle.prototype.area = function Rectangle_area () {
                return this.width() * this.height();
            };
            /** * *
            * Returns whether or not this rectangle intersects rectangle r.
            * Rectangles that share the same edge are considerend NOT intersecting.
            * @param {Rectangle}
            * @return {boolean}
            * @nosideeffects
            * * **/
            Rectangle.prototype.intersectsRectangle = function Rectangle_intersectsRectangle(r) {
                return !(this.left() >= r.right() || 
                         r.left() >= this.right() || 
                         this.top() >= r.bottom() || 
                         r.top() >= this.bottom());
            };
            /** * *
            * Returns whether or not this rectangle contains rectangle r.
            * If rectangle r is equal it is considered contained within this rectangle (and visa versa).
            * @param {Rectangle}
            * @return {boolean}
            * @nosideeffects
            * * **/
            Rectangle.prototype.containsRectangle = function Rectangle_contains(r) {
                return this.left() <= r.left() && this.top() <= r.top() && this.right() >= r.right() && this.bottom() >= r.bottom();
            };
            /** * *
            * Returns the intersection of this rectangle with rectangle r. If the rectangles
            * Returns false if r does not intersect.
            * @param {Rectangle}
            * @return {Rectangle|false}
            * * **/
            Rectangle.prototype.intersectionWith = function Rectangle_intersectionWith(r) {
                if (this.intersectsRectangle(r)) {
                    return new Rectangle();
                }
                return false;
            };
            /** * *
            * Returns whether or not this rectangle contains point.
            * @param {Vector}
            * @return {boolean}
            * * **/
            Rectangle.prototype.containsPoint = function Rectangle_containsPoint(point) {
                return (this.left() <= point.x() && this.right() >= point.x() &&
                    this.top() <= point.y() && this.bottom() >= point.y());
            };
            /** * *
            * Returns a polygon clipped by this rectangle using a Sutherland-Hodgeman Algorithm.
            * https://en.wikipedia.org/wiki/Sutherland%E2%80%93Hodgman_algorithm
            * http://www.aftermath.net/articles/clippoly/index.html
            * @param {Polygon}
            * @return {Polygon}
            * * **/
            Rectangle.prototype.clipPolygon = function Rectangle_clipPolygon(polygon) {
                var CP_LEFT = 0;
                var CP_RIGHT = 1;
                var CP_TOP = 2;
                var CP_BOTTOM = 3;
                
                function cp_inside(p, r, side) {
                    switch(side) {
                        case CP_LEFT:
                            return p.x() >= r.left();
                        case CP_RIGHT:
                            return p.x() <= r.right();
                        case CP_TOP:
                            return p.y() >= r.top();
                        case CP_BOTTOM:
                            return p.y() <= r.bottom();
                    }
                }
                
                function cp_intersect(p, q, r, side) {
                    function isfinite(n) {
                        return Math.abs(n) !== Number.POSITIVE_INFINITY;
                    }
                    
                    var t = new Vector(0, 0);
                    var a, b;

                    /* find slope and intercept of segment pq */
                    a = ( q.y() - p.y() ) / ( q.x() - p.x() );
                    b = p.y() - p.x() * a;

                    switch(side) {
                        case CP_LEFT:
                            t.x(r.left());
                            t.y(t.x() * a + b);
                            break;
                        case CP_RIGHT:
                            t.x(r.right());
                            t.y(t.x() * a + b);
                            break;
                        case CP_TOP:
                            t.y(r.top());
                            t.x(isfinite(a) ? ( t.y() - b ) / a : p.x());
                            break;
                        case CP_BOTTOM:
                            t.y(r.bottom());
                            t.x(isfinite(a) ? ( t.y() - b ) / a : p.x());
                            break;
                    }

                    return t;
                }
                
                function cp_clipplane(vec, r, side) {
                    var n, i, j=0, s, p, out, intersection;
                    
                    n = vec.length/2;
                    out = new Polygon();
                    s = vec.pointAt(n-1);
                    
                    for(i = 0 ; i < n; i++ ) {
                        p = vec.pointAt(i);

                        if( cp_inside( p, r, side ) ) {
                            // Point p is inside...
                            if( !cp_inside( s, r, side ) ) {
                                // p is inside and s is outside
                                intersection = cp_intersect( p, s, r, side );
                                if (!intersection.isEqualTo(p)) {
                                    // We don't want doubles in our output set...
                                    out.push(intersection[0]);
                                    out.push(intersection[1]);
                                }
                            }
                            out.push(p[0]);
                            out.push(p[1]);
                        } else if( cp_inside( s, r, side ) ) {
                            // s is inside and p is outside
                            intersection = cp_intersect( p, s, r, side );
                            out.push(intersection[0]);
                            out.push(intersection[1]);
                        }
                        s = p;
                    }
                    return out;
                }
                
                function clippoly(poly, r) {
                    poly = cp_clipplane(poly, r, CP_LEFT);
                    poly = cp_clipplane(poly, r, CP_RIGHT);
                    poly = cp_clipplane(poly, r, CP_TOP);
                    poly = cp_clipplane(poly, r, CP_BOTTOM);
                    return poly;
                }
                
                return clippoly(polygon, this);
            };
            /** * *
            * Returns a new set of rectangles that do not intersect, that occupy the
            * same space as the original.
            * @param {Array}
            * @return {Array}
            * @nosideeffects
            * * **/
            Rectangle.reduceRectangles = function Rectangle_reduceRectangles(rectangles) {
                /** * *
                * Bundles and sorts rectangles by vertical edges.
                * @param {Array}
                * @nosideeffects
                * * **/
                function bundleRectangles(rectangles) {
                    var output = [];
                    for (var i=0; i < rectangles.length; i++) {
                        var rect = rectangles[i];
                        output.push({
                            id : i,
                            type : 's',
                            x : rect.left(),
                            intersections : [],
                            rectangle : rect
                        });
                        output.push({
                            id : i,
                            type : 'e',
                            x : rect.right(),
                            intersections : [],
                            rectangle : rect
                        });
                    }
                    function compareX(n1, n2) {
                        var diff = n1.x - n2.x;
                        if (diff === 0) {
                            return n1.top - n2.top;
                        }
                        return diff;
                    }
                    output.sort(compareX);
                    return output;
                }
                        
                // We're going to need this function during end events...
                function mapIntersectionToScan(el) {
                    var newScan = new Rectangle(e.x, el.top(), 0, el.height());
                    newScan.intersects = [el];
                    return newScan;
                }
                            
                var input = rectangles.slice();
                var events = bundleRectangles(input);
                var current = [];
                var scans = [];
                var output = [];
                var i,j,k,l,scan,currentRect;
                            
                for (i=0; i < events.length; i++) {
                    var e = events[i];
                                
                    // Update the current scans...
                    for (j=0; j < scans.length; j++) {
                        scan = scans[j];
                        scan.right(e.x);
                    }
                                
                    if (e.type === 's') {
                        var contained = false;
                        for (j=0; j < current.length; j++) {
                            currentRect = current[j];
                            if (currentRect.containsRectangle(e.rectangle)) {
                                contained = true;
                                break;
                            }
                        }
                        if (!contained) {
                            // This event should start a new rectangle (at some point)...
                            current.push(e.rectangle);
                            var intersected = false;
                            for (j=0; j < scans.length; j++) {
                                scan = scans[j];
                                if (!(e.rectangle.top() >= scan.bottom() || scan.top() >= e.rectangle.bottom())) {
                                    // The scan and event intersect in y...
                                    if ((e.rectangle.top() >= scan.top() && e.rectangle.bottom() <= scan.bottom())) {
                                        // This scan contains the event's rectangle, so we don't need to make a new scan
                                        // but we will need to know that it intersects...
                                        scan.intersects.push(e.rectangle);
                                        contained = true;
                                        continue;
                                    }
                                    // We have to check if it has a width, if not, it was added by an earlier intersection
                                    // during this event...
                                    if (scan.width()) {
                                        // This scan was from an earlier event, so output a rectangle...
                                        output.push(scan);
                                    }
                                    // Replace this scan with a scan that represents the intersection...
                                    var t = Math.min(e.rectangle.top(), scan.top());
                                    var b = Math.max(e.rectangle.bottom(), scan.bottom());
                                    if (intersected) {
                                        // We've already created one intersection, so group it with this one...
                                        intersected.top(Math.min(intersected.top(), t));
                                        intersected.bottom(Math.max(intersected.bottom(), b));
                                        intersected.intersects = intersected.intersects.concat(scan.intersects);
                                    } else {
                                        intersected = new Rectangle(e.x, t, 0, b - t);
                                        intersected.intersects = scan.intersects.concat([e.rectangle]);
                                    }
                                    // Get rid of the current scan...
                                    scans.splice(j--, 1);
                                }
                            }
                            if (!contained) {
                                // This rectangle is not contained by a current scan either...
                                if (!intersected) {
                                    // This event starts a new non-overlapping rectangle...
                                    var r = e.rectangle.copy();
                                    r.intersects = [e.rectangle];
                                    scans.push(r);
                                } else {
                                    scans.push(intersected);
                                }
                            }
                        }
                    } else {
                        // This is an end event...
                        for (j=0; j < current.length; j++) {
                            currentRect = current[j];
                            if (currentRect.isEqualTo(e.rectangle)) {
                                current.splice(j, 1);
                                break;
                            }
                        }
                        
                        for (j=0; j < scans.length; j++) {
                            scan = scans[j];
                            // Find the scan that intersects this end event...
                            if (scan.intersects.length === 1 && scan.top() === e.rectangle.top() && scan.bottom() === e.rectangle.bottom()) {
                                // This end event corresponds specifically to this scan, so output it...
                                output.push(scan);
                                scans.splice(j--, 1);
                            } else {
                                // We're going to have to break this scan up into subscans...
                                var ndx = scan.intersects.indexOf(e.rectangle);
                                if (ndx !== -1) {
                                    // Output the scan, because we have to change it...
                                    output.push(scan);
                                    // Remove this rectangle from the intersecting scan...
                                    scan.intersects.splice(ndx, 1);
                                    // Remove the scan from our scans...
                                    scans.splice(j, 1);
                                    if (scan.intersects.length) {
                                        // Make some new scans to replace the old one...
                                        var newScans = scan.intersects.map(mapIntersectionToScan);
                                        // Iterate through the new scans and collect them together if they overlap...
                                        var newScanNdx = 0;
                                        while (newScans.length > 1 && newScanNdx < newScans.length) {
                                            var intersection = newScans[newScanNdx++];
                                            for (l=0; l < newScans.length; l++) {
                                                if (l === newScanNdx-1) {
                                                    // We don't want to compare a scan to itthis...
                                                    continue;
                                                }
                                                var newScan = newScans[l];
                                                if (!(newScan.top() > intersection.bottom() || intersection.top() > newScan.bottom())) {
                                                    // The two overlap, so absorb the intersection scan into this scan...
                                                    intersection.top(Math.min(newScan.top(), intersection.top()));
                                                    intersection.bottom(Math.max(newScan.bottom(), intersection.bottom()));
                                                    intersection.intersects = newScan.intersects.concat(intersection.intersects);
                                                    // Now we have to test this scan against the others again, since it has changed...
                                                    newScans.splice(l, 1);
                                                    newScanNdx = 0;
                                                    break;
                                                }
                                            }
                                        }
                                        // Add the new scans to scans...
                                        scans = scans.concat(newScans);
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
                // Concat the remaining scans in there...
                return output.concat(scans);
            };
            
            return Rectangle;
        })(modules.Vector,modules.Polygon);
    /// Matrix from bang::Geometry/Matrix.js
        modules.Matrix = (function initMatrix(Vector) {
            /** * *
            * Creates a new Matrix object. You can optionally provide the number 
            * of rows and columns as an array, and the elements as numbers.
            * @type {Array=} rowsAndColumns The number of rows and columns. (optional)
            * @type {...number=} elements The matrix elements. (optional)
            * * **/
            function Matrix() {
                var args = Array.prototype.slice.call(arguments);
                var numberOfRowsAndColumns = [0,0];
                if (typeof args[0] === 'object') {
                    numberOfRowsAndColumns = args.shift();
                } else if (args.length) {
                    var sqrtLen = Math.sqrt(args.length);
                    numberOfRowsAndColumns = [sqrtLen, sqrtLen];
                }
                /** * *
                * The number of columns.
                * @type {number}
                * * **/
                this.numColumns = numberOfRowsAndColumns[0];
                /** * *
                * The number of rows.
                * @type {number}
                * * **/
                this.numRows = numberOfRowsAndColumns[1];

                this.length = this.numRows*this.numColumns;
                
                if (args.length) {
                    this.length = 0;
                    for (var i=0; i < args.length; i++) {
                        this.push(args[i]);
                    }
                } else if (this.length === 0) {
                    this.length = 9;
                    this.numColumns = 3;
                    this.numRows = 3;
                    this.loadIdentity();
                } else {
                    this.loadIdentity();
                }
            }
            
            Matrix.prototype = new Vector();
            
            Matrix.prototype.constructor = Matrix;
            //--------------------------------------
            //  CLASS METHODS
            //--------------------------------------
            /** * *
            * Returns the determinant of a given 2x2 matrix.
            * @param {Vector}
            * @return {number}
            * @nosideeffects
            * * **/
            Matrix.det2x2 = function Matrix_det2x2(matrix) {
                if (matrix.length !== 4) {
                    throw new Error('Matrix must be 2x2.');
                }
                var a = matrix[0];
                var b = matrix[1];
                var c = matrix[2];
                var d = matrix[3];
                return a*d - b*c;
            };
            //--------------------------------------
            //  METHODS
            //--------------------------------------
            /** * *
            * Returns the string representation of this Matrix.
            * @return {string}
            * * **/
            Matrix.prototype.toString = function Matrix_toString() {
                return 'Matrix['+Array.prototype.toString.call(this)+']';
            };
            /** * *
            * Returns a pretty string value.
            * @return string
            * @nosideeffects
            * * **/
            Matrix.prototype.toPrettyString = function Matrix_toPrettyString() {
                function fixed(el) {
                    var s = el.toFixed(3);
                    if (el >= 0) {
                        s = ' '+s;
                    }
                    return s;
                }
                var s = '\n' + fixed(this[0]) + ' ' + fixed(this[1]) + ' ' + fixed(this[2]) + '\n';
                    s += fixed(this[3]) + ' ' + fixed(this[4]) + ' ' + fixed(this[5]) + '\n';
                    s += fixed(this[6]) + ' ' + fixed(this[7]) + ' ' + fixed(this[8]);
                return s;
            };
            /** * *
            * Returns a copy of this matrix.
            * @return {Matrix}
            * @nosideeffects
            * * **/
            Matrix.prototype.copy = function Matrix_copy() {
                var copy = Vector.prototype.copy.call(this);
                copy.numRows = this.numRows;
                copy.numColumns = this.numColumns;
                return copy;
            };
            /** * *
            * Returns row n of this matrix.
            * @return Vector
            * @nosideeffects
            * * **/
            Matrix.prototype.row = function Matrix_row(n) {
                var elementsInRow = this.numColumns;
                var start = n*elementsInRow;
                var row = new Vector();
                for (var i=0; i < elementsInRow; i++) {
                    row.push(this[start+i]);
                }
                return row;
            };
            /** * *
            * Returns column n of this matrix.
            * @return {Vector}
            * @nosideeffects
            * * **/
            Matrix.prototype.column = function Matrix_column(n) {
                var elementsInColumn = this.numRows;
                var start = n;
                var column = new Vector();
                for (var i=0; i < elementsInColumn; i++) {
                    column.push(this[start+this.numRows*i]);
                }
                return column;
            };
            /** * *
            * Returns the identity matrix.
            * @return Matrix
            * @nosideeffects
            * * **/
            Matrix.prototype.identity = function Matrix_identity() {
                var m = new this.constructor().loadIdentity();
                return m;
            };
            /** * *
            * Loads the elements of the identity matrix. Returns itself.
            * @return {Matrix}
            * * **/
            Matrix.prototype.loadIdentity = function Matrix_loadIdentity() {
                if (this.numColumns !== this.numRows) {
                    // This is not a square matrix and does not have an identity...
                    throw new Error('Matrix must be square (nxn) to have an identity.');
                }
                this.length = this.numColumns*this.numRows;
                
                for (var i=0; i < this.length; i++) {
                    this[i] = (i%(this.numRows+1)) === 0 ? 1 : 0;
                }
                
                return this;
            };
            /** * *
            * Returns a new matrix with row x and column y deleted.
            * Calling this on a 4x4 matrix will return a 3x3 matrix.
            * @param {number} c The column to delete
            * @param {number} r The row to delete
            * @return {Matrix}
            * @nosideeffects
            * * **/
            Matrix.prototype.deleteRowAndColumnAt = function Matrix_deleteRowAndColumnAt(c, r) {
                var alias = this;
                /** * *
                * Returns whether the given index is in a given row.
                * @param {number} ndx The index.
                * @param {number} row The row.
                * @return {boolean}
                * @nosideeffects
                * * **/
                function isIndexInRow(ndx, row) {
                    var startNdx = alias.numColumns*row;
                    var endNdx = startNdx + alias.numColumns;
                    return startNdx <= ndx && ndx < endNdx;
                }
                /** * *
                * Returns whether the given index is in a given column.
                * @param {number} ndx The index.
                * @param {number} col The column.
                * @return {boolean}
                * @nosideeffects
                * * **/
                function isIndexInColumn(ndx, col) {
                    return (ndx - col)%alias.numColumns === 0;
                }
                var matrix = new Matrix([this.numRows-1, this.numColumns-1]);
                for (var ndx=0,i=0; ndx < this.length; ndx++) {
                    if (isIndexInRow(ndx, r) || isIndexInColumn(ndx, c)) {
                        continue;
                    }
                    matrix[i++] = this[ndx];
                }
                return matrix;
            };
            /** * *
            * Returns the minor for an element at row x and column y.
            * @param {number} x The row.
            * @param {number} y The column.
            * @return {number} The minor for the element.
            * * **/
            Matrix.prototype.minorAt = function Matrix_minorAt(x, y) {
                var ndx = y*this.numColumns + x;
                
                var minorMatrix = this.deleteRowAndColumnAt(x, y);
                return minorMatrix.determinant();
            };
            /** * *
            * Returns the cofactor for an element at row x and column y.
            * @param {number} x The row.
            * @param {number} y The column.
            * @return {number} The cofactor for the element.
            * * **/
            Matrix.prototype.cofactorAt = function Matrix_cofactorAt(x, y) {
                var ndx = y*this.numColumns + x;
                var sign = ((ndx%2) ? -1 : 1);
                if (this.numColumns%2 === 0) {
                    sign *= (y%2 ? -1 : 1);
                }
                return this.minorAt(x, y)*sign;
            };
            /** * *
            * Returns the determinant of the matrix.
            * @return {number}
            * @nosideeffects
            * * **/
            Matrix.prototype.determinant = function Matrix_determinate() {
                if (this.length === 1) {
                    return this[0];
                }
                if (this.numColumns === 2 && this.numRows === 2) {
                    return Matrix.det2x2(this);
                }
                
                var alias = this;
                var ndx = 0;
                return this.row(0).foldl(function(acc,el) {
                    // Accumulate the product of the element and its cofactor...
                    return acc + (el*alias.cofactorAt(ndx++, 0));
                }, 0);
            };
            /** * *
            * Returns the transpose of the matrix.
            * @return {Matrix}
            * * **/
            Matrix.prototype.transpose = function Matrix_transpose() {
                var transpose = this.copy();
                for (var i=0; i < this.numColumns; i++) {
                    for (var j=0; j < this.numRows; j++) {
                        var thisNdx = i*this.numColumns + j;
                        var transNdx = j*this.numColumns + i;
                        transpose[transNdx] = this[thisNdx];
                    }
                }
                return transpose;
            };
            /** * *
            * Returns the matrix of cofactors.
            * @return {Matrix}
            * * **/
            Matrix.prototype.cofactors = function Matrix_cofactors() {
                var cofactors = this.copy();
                for (var i=0; i < this.numColumns; i++) {
                    for (var j=0; j < this.numRows; j++) {
                        var ndx = j*this.numColumns + i;
                        cofactors[ndx] = this.cofactorAt(i, j);
                    }
                }
                return cofactors;
            };
            /** * *
            * Returns the inverse of this matrix or false if no inverse exists.
            * @return {Matrix}
            * @nosideeffects
            * * **/
            Matrix.prototype.inverse = function Matrix_inverse() {
                var detM = this.determinant();
                if (detM === 0) {
                    // This matrix is singular and has no inverse...
                    return false;
                }
                var oneOverDet = 1 / detM;
                // Get the matrix of cofactors...
                var cofactors = this.cofactors();
                // Get the adjoint matrix by transposing the matrix of cofactors...
                var adjoint = cofactors.transpose();
                // Divide the adjoint by the determinant...
                for (var i=0; i < adjoint.length; i++) {
                    adjoint[i] *= oneOverDet;
                }
                return adjoint;
            };
            /** * *
            * Multiplies this matrix by matrix.
            * @param Array
            * @return Matrix
            * @nosideeffects
            * * **/
            Matrix.prototype.multiply = function Matrix_multiply(matrix) {   
                if (this.numColumns !== matrix.numRows) {
                    throw new Error('The number of columns in first matrix must equal the number of rows in the second.');
                }         
                /** * *
                * Adds a matrix element *row* and *column*.
                * @param Array
                * @param Array
                * @return number
                * @nosideeffects
                * * **/
                function addRowAndColumn(row, column) {
                    var combo = 0;
                    for (var i=0; i < row.length && i < column.length; i++) {
                        combo += row[i]*column[i];
                    }
                    return combo;
                }
                
                var elements = new this.constructor();
                elements.length = 0;
                    
                var resultRows = this.numRows;
                var resultCols = matrix.numColumns;
                for (var i=0; i < resultRows; i++) {
                    for (var j=0; j < resultCols; j++) {
                        var row = this.row(i);
                        var column;
                        if (resultCols === 1) {
                            // This is a vector we are multiplying...
                            column = matrix;
                        } else {
                            column = matrix.column(j);
                        }
                        elements.push(addRowAndColumn(row, column));
                    }
                }
                elements.numRows = resultRows;
                elements.numColumns = resultCols;
                elements.length = resultRows*resultCols;
                
                return elements;
            };
            
            return Matrix;
        })(modules.Vector);
    /// View from bang::View/View.js
        modules.View = (function initView(Rectangle, Matrix) {
            /** * *
            * A private variable for holding the number
            * of instantiated View objects.
            * @type {number}
            * * **/
            var _instances = 0;
            /** * *
            * Creates a new View object.
            * @param {number}
            * @param {number}
            * @param {number}
            * @param {number}
            * @return {View} 
            * @nosideeffects
            * * **/
            function View(x, y, w, h) {
                x = x || 0;
                y = y || 0;
                /** * *
                * A reference to this view's canvas's context.
                * @type {CanvasRenderingContext2D}
                * * **/
                this.context = document.createElement('canvas').getContext('2d');
                /** * *
                * The x coordinate of this view.
                * @type {number}
                * * **/
                this.x = x;
                /** * *
                * The y coordinate of this view.
                * @type {number}
                * * **/
                this.y = y;
                /** * *
                * The x scale of this view.
                * @type {number}
                * * **/
                this.scaleX = 1;
                /** * *
                * The y scale of this view.
                * @type {number}
                * * **/
                this.scaleY = 1;
                /** * *
                * The rotation (in radians) of this view.
                * @type {number}
                * * **/
                this.rotation = 0;
                /** * *
                * The alpha value of this view.
                * @type {number}
                * * **/
                this.alpha = 1;
                /** * *
                * The parent view of this view.
                * False if this view has no parent.
                * @type {View|false}
                * * **/
                this.parent = false;
                /** * *
                * The stage view.
                * @type {Stage|false} stage 
                * * **/
                this.stage = false;
                /** * *
                * A list of children of this view.
                * @type {Array.<View>}
                * * **/
                /** * *
                * A string that identifies this view.
                * @type {string}
                * * **/
                this.tag = (_instances++).toString();
                /** * *
                * A list of child views.
                * @type {Array.<View>}
                * * **/
                this.displayList = [];
                
                // Set the width and height...
                if (typeof w === 'number') {
                    this.context.canvas.width = w;
                } else {
                    w = this.context.canvas.width;
                }
                this.width = w;
                if (typeof h === 'number') {
                    this.context.canvas.height = h;
                } else {
                    h = this.context.canvas.height;
                }
                this.height = h;
            }
            
            View.prototype = {};
            
            View.prototype.constructor = View;
            //--------------------------------------
            //  METHODS
            //--------------------------------------
            /** * *
            * Returns a string representation of this view.
            * @return {string}
            * @nosideeffects
            * * **/
            View.prototype.toString = function View_toString() {
                return 'View{"'+this.tag+'"['+[this.x,this.y,this.width,this.height]+']}';
            };
            /** * *
            * Initializes the view.
            * Currently empty. This exists to conform View to a View3d,
            * so View objects can be rendered by a View3d.
            * * **/
            View.prototype.initialize = function View_initialize() {
                
            };
            /** * *
            * Returns this view's transformation in local coordinates.
            * If invert is true, will return the inverse of the
            * local tranformation matrix.
            * @param {boolean=}
            * @nosideeffects
            * * **/
            View.prototype.localTransform = function View_localTransform(invert) {
                var matrix = new Matrix();
                    
                if (invert) {
                    // Let's just provide them with an inverse instead of
                    // making them take the inverse afterwards, it should
                    // save some cycles...
                    matrix = matrix.scale(1/this.scaleX, 1/this.scaleY);
                    matrix = matrix.rotate(-this.rotation);
                    matrix = matrix.translate(-this.x, -this.y);
                } else {
                    matrix = matrix.translate(this.x, this.y);
                    matrix = matrix.rotate(this.rotation);
                    matrix = matrix.scale(this.scaleX, this.scaleY);
                }
                return matrix;
            };
            /** * *
            * Returns this view's transformation in global coordinates.
            * If invert is true, will return the inverse of the
            * global tranformation matrix.
            * @param {boolean=}
            * @nosideeffects
            * * **/
            View.prototype.globalTransform = function View_globalTransform(invert) {
                invert = invert || false;
                var i = invert ? -1 : 1;
                    
                // Get this view's transformation matrix...
                var transform = this.localTransform(invert);

                if (!this.parent) {
                    // There is no parent view, so either this view does not
                    // belong to a display list, or we've hit the root of the tree...
                    return transform;
                }
                    
                // Recurse up the tree and get the compound transfor..
                var compound = this.parent.globalTransform(invert);
                    
                if (invert) {
                    return transform.multiply(compound);
                }
                return compound.multiply(transform);
            };
            /** * *
            * Returns a copy of the given local vector converted into global coordinates.
            * @param {Vector}
            * @return {Vector}
            * @nosideeffects
            * * **/
            View.prototype.vectorToGlobal = function View_vectorToGlobal(vector) {
                return this.globalTransform().transformPolygon(vector);
            };
            /** * *
            * Returns a copy of the given global vector converted into local coordinates.
            * @param {Vector}
            * @return {Vector}
            * @nosideeffects
            * * **/
            View.prototype.vectorToLocal = function View_vectorToLocal(vector) {
                var inverse = true;
                return this.globalTransform(inverse).transformPolygon(vector);
            };
            /** * *
            * Returns the local bounds of this view.
            * @return {Rectangle}
            * * **/
            View.prototype.localBoundary = function View_localBoundary() {
                return new Rectangle(0, 0, this.width, this.height);
            };
            /** * *
            * Applies this view's transformation to a context.  
            * @param {CanvasRenderingContext2D} 
            * * **/
            View.prototype.transformContext = function View_transformContext(context) {
                context.translate(this.x, this.y);
                context.rotate(this.rotation);
                context.scale(this.scaleX, this.scaleY);
                context.globalAlpha *= this.alpha;
            };
            /** * *
            * Adds a subview to this view.
            * @param {View}
            * * **/
            View.prototype.addView = function View_addView(subView) {
                if (subView.parent) {
                    subView.parent.removeView(subView);
                }
                this.displayList.push(subView);
                subView.parent = this;
                subView.stage = this.stage;
            };
            /** * *
            * Adds a subview to this view at a given index.
            * @param {View}
            * @param {number}
            * * **/
            View.prototype.addViewAt = function View_addViewAt(subView, insertNdx) {
                insertNdx = insertNdx || 0;
                
                if (subView.parent) {
                    subView.parent.removeView(subView);
                }
                this.displayList.splice(insertNdx, 0, subView);
                subView.parent = this;
                subView.stage = this.stage;
            };
            /** * *
            * Removes a subview of this view.
            * * **/
            View.prototype.removeView = function View_removeView(subView) {
                var ndx = this.displayList.indexOf(subView);
                if (ndx !== -1) {
                    this.displayList.splice(ndx, 1);
                } else {
                    throw new Error('subview must be a child of the caller.');
                }
                subView.parent = false;
                subView.stage = false;
            };
            /** * *
            * Draws this view and its subviews into the given context.
            * @param {CanvasRenderingContext2D}
            * * **/
            View.prototype.draw = function View_draw(context) {
                if (!context || !CanvasRenderingContext2D.prototype.isPrototypeOf(context)) {
                    context = this.stage.canvas.getContext('2d');
                }
                context.save();
                // Apply the transform for subviews...
                this.transformContext(context);
                // Draw these pixels into the context...
                context.drawImage(this.context.canvas, 0, 0);
        
                for (var i=0; i < this.displayList.length; i++) {
                    var subView = this.displayList[i];
                    subView.draw(context);
                }
                context.restore();
            };
            return View;
        })(modules.Rectangle,modules.Matrix);
    /// Animation from bang::Utils/Animation.js
        modules.Animation = (function initAnimation() {
            /** * *
            * Creates a new Animation object.
            * Animation objects request timers from the browser and
            * schedule callbacks. They don't necessarily have to be
            * used for animation.
            * @constructor
            * * **/
            function Animation() {
                /** * *
                * An array to hold all the current animations.
                * @type {Array.<object>}
                * * **/
                this.animations = [];
            }
            
            Animation.prototype = {};
            
            Animation.prototype.constructor = Animation;
            //--------------------------------------
            //  HELPERS
            //--------------------------------------
            /** * *
            * The function to use for requesting an animation timer.
            * @type {function(function(number)): number}
            * * **/
            var request = (window.requestAnimationFrame       ||
                           window.webkitRequestAnimationFrame ||
                           window.mozRequestAnimationFrame    ||
                           window.onRequestAnimationFrame     ||
                           window.msRequestAnimationFrame     ||
                           function (callback) {
                               setTimeout(callback, 1000/60);
                               return callback;
                           });
            /** * *
            * The function to use for cancelling an animation timer.
            * @type {function( number|function(number) )}
            * * **/
            var cancel = (window.cancelRequestAnimationFrame       || 
                          window.webkitCancelRequestAnimationFrame || 
                          window.cancelAnimationFrame              || 
                          function(id) {
                              clearTimeout(id);
                          });
            //--------------------------------------
            //  METHODS
            //--------------------------------------
            /** * *
            * Returns a string representation of this Animation.
            * @return {string}
            * * **/
            Animation.prototype.toString = function Animation_toString() {
                return 'Animation{}';
            };
            /** * *
            * Creates an animation package.
            * Animation packages are used for keeping track of specific animations.
            * @param context {Object} The context of this animation package.
            * @return {Object}
            * * **/
            Animation.prototype.createPackage = function Animation_createPackage(context) {
                return {
                    id : 0,
                    cancelled : false,
                    context : context
                };
            };
            /** * *
            * Calls animationFunction over and over again.
            * @param animationFunction {function(number=)} The function to call over and over, repeatedly.
            * @param context {Object} The object to use as the 'this' property with calling animationFunction.
            * @return {Object.<string, string|number|false>}
            * * **/
            Animation.prototype.requestAnimation = function (animationFunction, context) {
                var animation = this.createPackage(context);
                // Store a reference to the animation...
                this.animations.push(animation);
                /** * *
                * Calls the animation function and schedules another call.
                * @param {number}
                * * **/
                var animate = function (time) {
                    time = time || Date.now();
                    
                    if (animation.cancelled === true) {
                        // Abort if the animation has been cancelled...
                        animation.id = false;
                        return;
                    }
                    // Update the animation id...
                    animation.id = request(animate);
                    // Animate...
                    animationFunction.call(animation.context, time);
                };

                animation.id = request(animate);
                return animation;
            };
            /** * *
            * Cancels an animation associate with a package returned by requestAnimation.
            * @param {Object.<string, string|number|false>}
            * * **/
            Animation.prototype.cancelAnimation = function Animation_cancelAnimation(animation) {
                animation.cancelled = true;
                animation.context = null;
                cancel(animation.id);
                
                // Remove the animation from our list...
                var ndx = this.animations.indexOf(animation);
                if (ndx !== -1) {
                    this.animations.splice(ndx, 1);
                }
            };
            /** * *
            * Cancels all animations currently registered.
            * * **/
            Animation.prototype.cancelAllAnimations = function() {
                while (this.animations.length) {
                    this.cancelAnimation(this.animations[0]);
                }
            };

            return Animation;
        })();
    /// Stage from bang::View/Stage.js
        modules.Stage = (function initStage(View, Rectangle, Animation) {
            /** * *
            * Creates a new Stage view object.
            * @param width {number=}
            * @param height {number=}
            * @constructor
            * @extends View
            * * **/
            function Stage(width, height) {
               View.call(this, 0, 0, width, height);
                /** * *
                * An animation timer for scheduling redraws.
                * @type {Animation}
                * * **/
                this.timer = new Animation();
                /** * *
                * An object that identifies the Stage's step animation in the Stage's timer.
                * @type {Object}
                * * **/
                this.stepAnimation = this.timer.requestAnimation(this.step, this);
                /** * *
                * A canvas for drawing the display list into.
                * Since the Stage is also a View, we need to separate the canvas's
                * into the Stage as a View's canvas and the entire display list's canvas.
                * @type {HTMLCanvasElement}
                * * **/
                this.canvas = document.createElement('canvas');
                this.canvas.width = this.width;
                this.canvas.height = this.height;
                /** * *
                * Whether or not to clear the screen before each draw.
                * Set to false if the stage will be drawn by another view.
                * @type {boolean} clearsOnDraw 
                * * **/
                this.clearsOnDraw = true;
            }
            
            Stage.prototype = new View();
            
            Stage.prototype.constructor = Stage;
            //--------------------------------------
            //  METHODS
            //--------------------------------------
            /** * *
            * Returns a flattened list of all this view's subviews.
            * @return {Array.<View>}
            * * **/
            Stage.prototype.children = function Stage_children() {
                var children = [this];
                for (var i=0; i < children.length; i++) {
                    var child = children[i];
                    if (child.displayList.length) {
                        // Splice the child's displayList into children
                        // after child, so its children will be checked
                        // next...
                        Array.prototype.splice.apply(children, [i+1, 0].concat(child.displayList));
                    }
                }
                return children;
            };
            /** * *
            * Draws the stage and its subviews into the given context.
            * @param context {CanvasRenderingContext2D}
            * * **/
            Stage.prototype.draw = function Stage_draw(context) {
                context = context || this.canvas.getContext('2d');
                
                context.save();
                if (this.clearsOnDraw) {
                    // Clear the entire stage...
                    context.clearRect(0, 0, this.width, this.height);
                }
                // Call View's draw...
                View.prototype.draw.call(this, context);
            };
            /** * *
            * This is the main step of the display list.
            * @param {number} time The current time in milliseconds.
            * * **/
            Stage.prototype.step = function Stage_step(time) {
               this.draw(this.canvas.getContext('2d')); 
            };
            
            return Stage;
        })(modules.View,modules.Rectangle,modules.Animation);
    /// Sprite from moon::View/Sprite.js
        modules.Sprite = (function initSpriteConstructor(View) {
            /** * *
            * Constructs new sprites.
            * @constructor
            * @nosideeffects
            * @extends View
            * @param {number=} x The x coordinate.
            * @param {number=} y The y coordinate.
            * @param {number=} w The width of the sprite.
            * @param {number=} h The height of the sprite.
            * @param {string=} src The source of the sprite sheet.
            * @param {Array.<number>=} frames A list of rectangles specifying the boundary of each frame.
            * @return {Sprite}
            * * **/ 
            function Sprite(x, y, w, h, src, frames) {
                // Forward the first params to View()...
                View.call(this, x, y, w, h);    
                /** * *
                * The source of the sprite sheet.
                * @type {string}
                * * **/
                this.src = src || '';
                /** * *
                * The boundaries of each frame in the sprite's animation.
                * @type {Array.<Rectangle>}
                * * **/
                this.frames = frames || [];
                /** * *
                * The loaded sprite sheet.
                * @type {Image}
                * * **/
                this.sheet = new Image();
                var self = this;
                this.sheet.onload = function forwardToSpriteSheetLoad() {
                    Sprite.prototype.onSpriteSheetLoad.apply(self, arguments);
                };
                this.sheet.onerror = function forwardToSpriteSheetFail() {
                    Sprite.prototype.onSpriteSheetError.apply(self, arguments);
                };
                if (this.src !== '') {
                   this.sheet.src = this.src; 
                }            
                /** * *
                * The number of frames that should pass each second.
                * @type {number}
                * * **/
                this.framesPerSecond = 12;
                /** * *
                * The current frame.
                * The first frame is 0.
                * @type {number}
                * * **/
                this.currentFrameIndex = 0;
                /** * *
                * The time at which the last frame was changed.
                * @type {number}
                * * **/
                this.lastFrameTimeStamp = 0;
                /** * *
                * Whether or not the sprite is playing.
                * @type {boolean}
                * * **/
                this.isPlaying = false;
            }  

            Sprite.prototype = new View();
            Sprite.prototype.constructor = Sprite;
            //-----------------------------
            //  METHODS
            //-----------------------------
            /** * *
            * Handles the successful load of the sprite sheet.
            * * **/
            Sprite.prototype.onSpriteSheetLoad = function Sprite_onSpriteSheetLoad() {
                if (this.frames.length === 0) {
                    this.frames = [
                        new Rectangle(0,0,this.sheet.width,this.sheet.height)
                    ]; 
                }
                this.updateContextWithCurrentFrame();
            };
            /** * *
            * Handles the unsuccesful load of the sprite sheet.
            * * **/
            Sprite.prototype.onSpriteSheetError = function Sprite_onSpriteSheetError() {
            }; 
            /** * *
            * Updates the context with the current frame.
            * * **/
            Sprite.prototype.updateContextWithCurrentFrame = function Sprite_updateContextWithCurrentFrame() {
                var ndx = Math.floor(this.currentFrameIndex);
                var frame = this.frames[ndx];
                var sx = frame.left();
                var sy = frame.top();
                var sw = frame.width();
                var sh = frame.height();
                var dw = this.width;
                var dh = this.height;
                this.context.clearRect(0, 0, dw, dh);
                this.context.drawImage(this.sheet, sx, sy, sw, sh, 0, 0, dw, dh);
            };
            /** * *
            * Returns the number of milliseconds per frame.
            * @return {number}
            * * **/
            Sprite.prototype.calculateMillisecondsPerFrame = function Sprite_calculateMillisecondsPerFrame() {
                return 1000/this.framesPerSecond;
            };
            /** * *
            * Returns the number of frames passed since the given time.
            * @param {number} time The time since the last frame.
            * @return {number}
            * * **/
            Sprite.prototype.numberOfFramesSince = function Sprite_numberOfFramesSince(time) {
                var millis = this.calculateMillisecondsPerFrame();
                var now = Date.now();
                var msElapsed = now - time;
                var frames = msElapsed/millis;
                return frames;
            };
            /** * *
            * Draws this view and its subviews into the given context.
            * @param {CanvasRenderingContext2D}
            * @override
            * * **/
            Sprite.prototype.draw = function View_draw(context) {
                if (this.isPlaying) {
                   var framesElapsed = this.numberOfFramesSince(this.lastFrameTimeStamp);
                   var nextFrame = framesElapsed + this.currentFrameIndex;
                   if (nextFrame >= this.frames.length) {
                       nextFrame = nextFrame % this.frames.length;
                   }

                   this.currentFrameIndex = nextFrame; 
                   this.updateContextWithCurrentFrame();
                   this.lastFrameTimeStamp = Date.now();
                }
                View.prototype.draw.call(this, context);
            };
            return Sprite;
        })(modules.View,modules.Rectangle);
    /// Toon from moon::View/Toon.js
        modules.Toon = (function initToonConstructor(View, Sprite) {
            /** * *
            * Constructs new Toons.
            * @constructor
            * @param {number} x
            * @param {number} y
            * @param {number} w
            * @param {number} h
            * @param {Array.<Sprite>} sprites
            * @nosideeffects
            * @return {Toon}
            * * **/ 
            function Toon(x, y, w, h, sprites) {
               View.call(this, x, y, w, h);

               /** * *
               * An array of sprites that the toon can play.
               * @type {Array.<Sprite>} 
               * * **/
               this.sprites = sprites || [];
               /** * *
               * The index of the sprite that is currently showing.
               * @type {number}
               * * **/
               this.currentSpriteNdx = 0;
            }
            Toon.prototype = new View(); 
            Toon.prototype.constructor = Toon;
            //-----------------------------
            //  METHODS
            //-----------------------------
            /** * *
            * Draws this view and its subviews into the given context.
            * @param {CanvasRenderingContext2D}
            * * **/
            Toon.prototype.draw = function Toon_draw(context) {
                for (var i=0; i < this.sprites.length; i++) {
                    if (i !== this.currentSpriteNdx && this.displayList.indexOf(this.sprites[i]) !== -1) {
                        this.removeView(this.sprites[i]);        
                    }
                }
                this.addView(this.sprites[this.currentSpriteNdx]);
                View.prototype.draw.call(this, context);
            };
            return Toon;
        })(modules.View,modules.Sprite);
    /// Task from bang::Utils/Task.js
        modules.Task = (function TaskFactory() {
            /** * *
            * Creates a new Task object.
            * The default task object executes some number of task functions in serial. Each
            * task function should take at least one argument, a callback function, which will
            * be provided by the task runner. The task function can optionally take two arguments,
            * a callback function and the return value of the previous task function. The task runner
            * will provide the return value of the previous function only if the runner is evoked in a 
            * serial context. If the current task in the queue is a parallel operation nested in a 
            * serial operation, each parallel task function will be given the result of the 
            * last serial operation.
            * 
            * @param {string=} The type of task to run ('serial' or 'parallel').
            * @param {...} A number of task functions or Task objects to run.
            * @constructor
            * * **/
            function Task() {
                var args = Array.prototype.slice.call(arguments);
                var type = false;
                if (typeof args[0] === 'string') {
                    type = args.shift();
                }
                /** * *
                * The type of task this is.
                * @param {string}
                * * **/
                this.type = type || 'serial';
                /** * *
                * The function steps of the task, or nested Task objects.
                * @type {Array.<function(function)|Task>} An array of Task objects or function steps that take function callbacks.
                * * **/
                this.queue = args;
                /** * *
                * A list of the return values of task functions.
                * @type {Array.<*>}
                * * **/
                this.results = [];
                for (var i=0; i < args.length; i++) {
                    this.results.push(undefined);
                }
                /** * *
                * A callback function for other Task objects to set.
                * @type {function(*)|boolean}
                * * **/
                this._taskCallback = false;
                /** * *
                * A callback function for users to set.
                * @type {function(*, Task)|boolean}
                * * **/
                this._userCallback = false;
                /** * *
                * A callback function to call in case of cancellation.
                * @type {function(Task)|false}
                * * **/
                this._cancelCallback = false;
                /** * *
                * The current task index.
                * @type {number}
                * * **/
                this.index = -1;
                /** * *
                * A reference to a parent task.
                * @type {Task|boolean}
                * * **/
                this.parent = false;
                /** * *
                * Whether or not the task has been cancelled.
                * @type {boolean}
                * * **/
                this.cancelled = false;
            }
            
            Task.prototype = {};
            
            Task.prototype.constructor = Task;
            //--------------------------------------
            //  METHODS
            //--------------------------------------
            /** * *
            * Cancels a task, if the task is nested this also cancels parent tasks.
            * * **/
            Task.prototype.cancel = function Task_cancel() {
                this.cancelled = true;
                this._userCallback = function(){};
                this._taskCallback = function(){};
                if (this._cancelCallback) {
                    this._cancelCallback(this);
                }
                if (this.parent) {
                    this.parent.cancel();
                }
            };
            /** * *
            * Calls the given function in the case that some sub operation cancels
            * the task. Provides the task object as a parameter to the given function.
            * @param {function(Task)} cancelFunc
            * * **/
            Task.prototype.onCancel = function Task_onCancel(cancelFunc) {
                this._cancelCallback = cancelFunc;
                // Return itself for chaining options...
                return this;
            }
            /** * *
            * Calls the given function once all of the Task's operations
            * have completed. Provides the results of the last operation
            * and the calling Task object as parameters. The results of this
            * function will be used as the result of a nested Task.
            * @param {function(*, Task)} completeFunc
            * * **/
            Task.prototype.onComplete = function Task_onComplete(completeFunc) {
                this._userCallback = completeFunc;
                // Return itself for chaining options...
                return this;
            };
            /** * *
            * Runs the task in serial.
            * @param {*} resultOfParentTaskOp The result of the parent task's last operation. Used internally for nested tasks.
            * * **/
            Task.prototype.go = function Task_go(resultOfParentTaskOp) {
                if (this.cancelled) {
                    return;
                }
                
                var alias = this;
                
                // Figure out what we should pass to operations and sub tasks,
                // should be the result of the last operation...
                var resultOfLastOperation = this.results[this.index]; // may be undefined...
                if (this.index === -1) {
                    // This is the first operation in a task, but if
                    // this task is a sub task of some parent task,
                    // the parent task would have given us the results
                    // of the last operation as the only parameter to go().
                    resultOfLastOperation = resultOfParentTaskOp;
                }
                
                function finish() {
                    var onCompleteResults = undefined;
                    if (alias._userCallback) {
                        // The user has supplied a callback using onComplete(),
                        // so call it with the last results and this...
                        onCompleteResults = alias._userCallback(alias.results[alias.index], alias);
                    }
                    if (alias._taskCallback) {
                        // This is a child Task, so callback to the parent Task...
                        // Give the parent Task object the result of the user supplied callback...
                        alias._taskCallback(onCompleteResults, alias);
                    }
                }
                
                if (this.type === 'serial') {
                    var step = this.queue.shift() || false;
                    
                    if (step) {
                        function serialCallback(results) {
                            alias.index++;
                            alias.results[alias.index] = results;
                            alias.go();
                        };
                        
                        if (Task.prototype.isPrototypeOf(step)) {
                            // The step is a Task object, so set that Task's callback 
                            // and let the Task take over until it calls back...
                            step.parent = this;
                            step._taskCallback = serialCallback;
                            step.go(this.results[this.index]);
                            return this;
                        }
                        // The step is a user's task function so run it...
                        step(serialCallback, resultOfLastOperation, this);
                        return this;
                    }
                    // This was the last step...
                    finish();
                } else if (this.type === 'parallel') {
                    
                    function createParallelCallback(task, ndx) {
                        return function parallelClosure(results) {
                            task.index++;
                            task.results[ndx] = results;
                            if (task.index === (task.queue.length - 1)) {
                                finish();
                            }
                        };
                    }
                    
                    for(var i = 0; i < this.queue.length/* && this.index === -1*/; i++) {
                        var step = this.queue[i];
                        var parallelCallback = createParallelCallback(this, i);
                        
                        if (Task.prototype.isPrototypeOf(step)) {
                            step.parent = this;
                            step._taskCallback = parallelCallback;
                            step.go(resultOfLastOperation);
                        } else {
                            step(parallelCallback, resultOfLastOperation, this);
                        }
                    }
                }
                // Return itself so we can do some chaining...
                return this;
            };
            
            return Task;
        })();
    /// Ease from bang::Utils/Ease.js
        modules.Ease = (function initEase(Task, Animation) {
            /** * *
            * Creates a new Ease object.
            * @param {Object} config The configuration object. Its properties are any number of those of an Ease object.
            * @return {Ease}
            * * **/
            function Ease (config) {
                Task.prototype.constructor.call(this);
                
                // Create a set of defaults for every tween...
                var defaultConfig = {
                    target : {},
                    duration : 1000,
                    delay : 0,
                    equation : Ease.linear,
                    properties : {},
                    onUpdate : function(){},
                    onUpdateParams : [],
                    onComplete : function(){},
                    onCompleteParams : []
                };
                config = config || defaultConfig;
                for (var key in defaultConfig) {
                    if (!(key in config)) {
                        // Inherit defaults if no override exists...
                        config[key] = defaultConfig[key];
                    }
                }
                /** * *
                * The configuration of this Ease.
                * There are some special properties in the config object, namely
                * 'onUpdateParams' and 'onCompleteParams', which should both be
                * arrays of parameters you'd like passed to your onUpdate and
                * onComplete functions. What's special about them is that Ease
                * will add itself to the end of the arrays, so the last parameter
                * will always be a reference to the Ease object itself. This allows
                * you to control the ease object inside your onUpdate and onComplete
                * functions without defining the Ease object itself.
                * @type {Object}
                * * **/
                this.config = config;
                /** * *
                * An animation package for interpolation.
                * @type {Object}
                * * **/
                this.interpolation = {};
            }
            
            Ease.prototype = new Task();
            
            Ease.prototype.constructor = Ease;
            //--------------------------------------
            //  STATIC PROPERTIES
            //--------------------------------------
            /** * *
            * An animation scheduler.
            * @type {Animation}
            * * **/
            Ease.timer = new Animation();
            //--------------------------------------
            //  STATIC EASING EQUATIONS [by Robert Penner (http://www.gizma.com/easing/)]
            //--------------------------------------
            /** * *
            * Simple linear interpolation.
            * @param - t Number (current time)
            * @param - b Number (start value)
            * @param - c Number (change in value)
            * @param - d Number (duration)
            * @returns - Number (new value)
            * * **/
            Ease.linear = function Ease_linear(t, b, c, d) {
                return c*t/d + b;
            };
            /** * *
            * Quadratic interpolation easing in from zero velocity.
            * @param - t Number (current time)
            * @param - b Number (start value)
            * @param - c Number (change in value)
            * @param - d Number (duration)
            * @returns - Number (new value)
            * * **/
            Ease.easeInQuad = function Ease_easeInQuad(t, b, c, d) {
                t /= d;
                return c*t*t + b;
            };
            /** * *
            * Quadratic interpolation easing out to zero velocity.
            * @param - t Number (current time)
            * @param - b Number (start value)
            * @param - c Number (change in value)
            * @param - d Number (duration)
            * @returns - Number (new value)
            * * **/
            Ease.easeOutQuad = function Ease_easeOutQuad(t, b, c, d) {
                t /= d;
                return -c * t*(t-2) + b;
            };
            /** * *
            * Acceleration until halfway, then deceleration.
            * @param - t Number (current time)
            * @param - b Number (start value)
            * @param - c Number (change in value)
            * @param - d Number (duration)
            * @returns - Number (new value)
            * * **/
            Ease.easeInOutQuad = function Ease_easeInOutQuad(t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t + b;
                t--;
                return -c/2 * (t*(t-2) - 1) + b;         
            };
            /** * *
            * Accelerating from zero velocity.
            * @param - t Number (current time)
            * @param - b Number (start value)
            * @param - c Number (change in value)
            * @param - d Number (duration)
            * @returns - Number (new value)
            * * **/
            Ease.easeInCubic = function Ease_easeInCubic(t, b, c, d) {
                t /= d;
                return c*t*t*t + b;         
            };
            /** * *
            * Decelerating to zero velocity
            * @param - t Number (current time)
            * @param - b Number (start value)
            * @param - c Number (change in value)
            * @param - d Number (duration)
            * @returns - Number (new value)
            * * **/
            Ease.easeOutCubic = function Ease_easeOutCubic(t, b, c, d) {
                t /= d;
                t--;
                return c*(t*t*t + 1) + b;         
            };
            /** * *
            * Accelerating halfway, decelerating halfway.
            * @param - t Number (current time)
            * @param - b Number (start value)
            * @param - c Number (change in value)
            * @param - d Number (duration)
            * @returns - Number (new value)
            * * **/
            Ease.easeInOutCubic = function Ease_easeInOutCubic(t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t*t + b;
                t -= 2;
                return c/2*(t*t*t + 2) + b;
            };
            /** * *
            * Quartic easing in - accelerating from zero velocity
            * @param - t Number (current time)
            * @param - b Number (start value)
            * @param - c Number (change in value)
            * @param - d Number (duration)
            * @returns - Number (new value)
            * * **/
            Ease.easeInQuart = function Ease_easeInQuart(t, b, c, d) {
                t /= d;
                return c*t*t*t*t + b;         
            };
            /** * *
            * Quartic easing out - decelerating to zero velocity
            * @param - t Number (current time)
            * @param - b Number (start value)
            * @param - c Number (change in value)
            * @param - d Number (duration)
            * @returns - Number (new value)
            * * **/
            Ease.easeOutQuart = function Ease_easeOutQuart(t, b, c, d) {
                t /= d;
                t--;
                return -c * (t*t*t*t - 1) + b;         
            };
            /** * *
            * Quartic easing in/out - acceleration until halfway, then deceleration
            * @param - t Number (current time)
            * @param - b Number (start value)
            * @param - c Number (change in value)
            * @param - d Number (duration)
            * @returns - Number (new value)
            * * **/
            Ease.easeInOutQuart = function Ease_easeInOutQuart(t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t*t*t + b;
                t -= 2;
                return -c/2 * (t*t*t*t - 2) + b;         
            };
            /** * *
            * Quintic easing in - accelerating from zero velocity
            * @param - t Number (current time)
            * @param - b Number (start value)
            * @param - c Number (change in value)
            * @param - d Number (duration)
            * @returns - Number (new value)
            * * **/
            Ease.easeInQuint = function Ease_easeInQuint(t, b, c, d) {
                t /= d;
                return c*t*t*t*t*t + b;          
            };
            /** * *
            * Quintic easing out - decelerating to zero velocity
            * @param - t Number (current time)
            * @param - b Number (start value)
            * @param - c Number (change in value)
            * @param - d Number (duration)
            * @returns - Number (new value)
            * * **/
            Ease.easeOutQuint = function Ease_easeOutQuint(t, b, c, d) {
                t /= d;
                t--;
                return c*(t*t*t*t*t + 1) + b;            
            };
            /** * *
            * Quintic easing in/out - acceleration until halfway, then deceleration
            * @param - t Number (current time)
            * @param - b Number (start value)
            * @param - c Number (change in value)
            * @param - d Number (duration)
            * @returns - Number (new value)
            * * **/
            Ease.easeInOutQuint = function Ease_easeInOutQuint(t, b, c, d) {
                t /= d/2;
                if (t < 1) {
                    return c/2*t*t*t*t*t + b;
                }
                t -= 2;
                return c/2*(t*t*t*t*t + 2) + b;         
            };
            /** * *
            * Sinusoidal easing in - accelerating from zero velocity
            * @param - t Number (current time)
            * @param - b Number (start value)
            * @param - c Number (change in value)
            * @param - d Number (duration)
            * @returns - Number (new value)
            * * **/
            Ease.easeInSine = function Ease_easeInSine(t, b, c, d) {
                return -c * Math.cos(t/d * (Math.PI/2)) + c + b;         
            };
            /** * *
            * Sinusoidal easing out - decelerating to zero velocity
            * @param - t Number (current time)
            * @param - b Number (start value)
            * @param - c Number (change in value)
            * @param - d Number (duration)
            * @returns - Number (new value)
            * * **/
            Ease.easeOutSine = function Ease_easeOutSine(t, b, c, d) {
               return c * Math.sin(t/d * (Math.PI/2)) + b;         
            };
            /** * *
            * Sinusoidal easing in/out - accelerating until halfway, then decelerating
            * @param - t Number (current time)
            * @param - b Number (start value)
            * @param - c Number (change in value)
            * @param - d Number (duration)
            * @returns - Number (new value)
            * * **/
            Ease.easeInOutSine = function Ease_easeInOutSine(t, b, c, d) {
               return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;           
            };
            /** * *
            * Exponential easing in - accelerating from zero velocity
            * @param - t Number (current time)
            * @param - b Number (start value)
            * @param - c Number (change in value)
            * @param - d Number (duration)
            * @returns - Number (new value)
            * * **/
            Ease.easeInExpo = function Ease_easeInExpo(t, b, c, d) {
               return c * Math.pow( 2, 10 * (t/d - 1) ) + b;         
            };
            /** * *
            * Exponential easing out - decelerating to zero velocity
            * @param - t Number (current time)
            * @param - b Number (start value)
            * @param - c Number (change in value)
            * @param - d Number (duration)
            * @returns - Number (new value)
            * * **/
            Ease.easeOutExpo = function Ease_easeOutExpo(t, b, c, d) {
               return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;         
            };
            /** * *
            * Exponential easing in/out - accelerating until halfway, then decelerating
            * @param - t Number (current time)
            * @param - b Number (start value)
            * @param - c Number (change in value)
            * @param - d Number (duration)
            * @returns - Number (new value)
            * * **/
            Ease.easeInOutExpo = function Ease_easeInOutExpo(t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
                t--;
                return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;         
            };
            /** * *
            * Circular easing in - accelerating from zero velocity
            * @param - t Number (current time)
            * @param - b Number (start value)
            * @param - c Number (change in value)
            * @param - d Number (duration)
            * @returns - Number (new value)
            * * **/
            Ease.easeInCirc = function Ease_easeInCirc(t, b, c, d) {
                t /= d;
                return -c * (Math.sqrt(1 - t*t) - 1) + b;         
            };
            /** * *
            * Circular easing out - decelerating to zero velocity
            * @param - t Number (current time)
            * @param - b Number (start value)
            * @param - c Number (change in value)
            * @param - d Number (duration)
            * @returns - Number (new value)
            * * **/
            Ease.easeOutCirc = function Ease_easeOutCirc(t, b, c, d) {
                t /= d;
                t--;
                return c * Math.sqrt(1 - t*t) + b;         
            };
            /** * *
            * Circular easing in/out - acceleration until halfway, then deceleration
            * @param - t Number (current time)
            * @param - b Number (start value)
            * @param - c Number (change in value)
            * @param - d Number (duration)
            * @returns - Number (new value)
            * * **/
            Ease.easeInOutCirc = function Ease_easeInOutCirc(t, b, c, d) {
                t /= d/2;
                if (t < 1) {
                    return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
                }
                t -= 2;
                return c/2 * (Math.sqrt(1 - t*t) + 1) + b;         
            };
            //--------------------------------------
            //  METHODS
            //--------------------------------------
            /** * *
            * Cancels the interpolation. Tweening stops where it is.
            * * **/
            Ease.prototype.cancel = function Ease_cancel() {
                Ease.timer.cancelAnimation(this.interpolation);
            };
            /** * *
            * Starts interpolation. Returns itself.
            * @return {Ease}
            * * **/
            Ease.prototype.interpolate = function Ease_interpolate() {
                var start = Date.now();
                var time = 0;
                var tween = this;
                // Get the delta of the properties we're interpolating...
                var deltaProperties = {};
                var fromProperties = {};
                // Save the type of property...
                var propertyTypeIsFunction = {};
                    
                for (var key in this.config.properties) {
                    if (key in this.config.target) {
                        var from, to;
                        if (typeof this.config.target[key] === 'function') {
                            // This property is a getter/setter, so use it as a function...
                            propertyTypeIsFunction[key] = true;
                            from = this.config.target[key]();
                        } else {
                            propertyTypeIsFunction[key] = false;
                            from = this.config.target[key];
                        }
                        to = this.config.properties[key];
                            
                        var change = to - from;
                        fromProperties[key] = from; 
                        deltaProperties[key] = change;   
                    } else {
                        console.warn(key, 'is not in target',this.config.target.toString());
                    }
                }
                var interpolationFunction = function Ease_interpolate_interpolationFunction() {
                    time = Date.now() - start;
                    if (time >= tween.config.duration + tween.config.delay) {
                        // Cancel...
                        tween.cancel();
                        // Set final values...
                        for (var key in tween.config.properties) {
                            if (key in tween.config.target) {
                                if (typeof tween.config.target[key] === 'function') {
                                    // Apply the setter function...
                                    tween.config.target[key](tween.config.properties[key]);
                                } else {
                                    tween.config.target[key] = tween.config.properties[key];
                                }
                            }
                        }
                        // Update...
                        tween.config.onUpdate.apply(null, tween.config.onUpdateParams.concat(tween));
                        // Call onComplete...
                        tween.config.onComplete.apply(null, tween.config.onCompleteParams.concat(tween));
                        // Call Task's go again...
                        Task.prototype.go.call(tween);
                    } else if (time >= tween.config.delay) {
                        var t_interpolate = time - tween.config.delay;
                        for (var key in fromProperties) {
                            var from = fromProperties[key];
                            var delta = deltaProperties[key];
                            var current = tween.config.equation(t_interpolate, from, delta, tween.config.duration);
                            if (propertyTypeIsFunction[key]) {
                                tween.config.target[key](current);
                            } else {
                                tween.config.target[key] = current;
                            }
                        }
                        // Update...
                        tween.config.onUpdate.apply(null, tween.config.onUpdateParams);
                    }
                };
                // Start and store our interpolation...
                tween.interpolation = Ease.timer.requestAnimation(interpolationFunction);
                return tween;
            };
            /** * *
            * Runs this tween as a Task.
            * * **/
            Ease.prototype.go = function Ease_go(results) {
                this.interpolate();
            }
            
            return Ease;
        })(modules.Task,modules.Animation);
    /// Astronaut from moon::View/Astronaut.js
        modules.Astronaut = (function initAstronautConstructor(Toon, Ease, Sprite, Rectangle, View) {
            /** * *
            * Constructs new Astronauts.
            * @constructor
            * @nosideeffects
            * @return {Astronaut}
            * * **/ 
            function Astronaut(x, y) {
                var startX = 1;
                var startY = -12;
                var toon = new Toon(startX, startY, 32,32, [
                    new Sprite(0, 0, 32, 32, 'img/tiles.png', [
                        new Rectangle(0, 96+0*32, 32, 32), // 0 - forward
                    ]),
                    new Sprite(0, 0, 32, 32, 'img/tiles.png', [
                        new Rectangle(0, 96+1*32, 32, 32), // 1 - right
                    ]),
                    new Sprite(0, 0, 32, 32, 'img/tiles.png', [
                        new Rectangle(0, 96+2*32, 32, 32), // 2 - left
                    ]),
                    new Sprite(0, 0, 32, 32, 'img/tiles.png', [
                        new Rectangle(0, 96+3*32, 32, 32), // 3 - backward
                    ]),
                    new Sprite(0, 0, 32, 32, 'img/tiles.png', [
                        new Rectangle(32, 96+0*32, 32, 32), // 4 - forward (spray) 
                    ]),
                    new Sprite(0, 0, 32, 32, 'img/tiles.png', [
                        new Rectangle(32, 96+1*32, 32, 32), // 5 - right (spray)
                    ]),
                    new Sprite(0, 0, 32, 32, 'img/tiles.png', [
                        new Rectangle(32, 96+2*32, 32, 32), // 6 - left (spray)
                    ]),
                    new Sprite(0, 0, 32, 32, 'img/tiles.png', [
                        new Rectangle(32, 96+3*32, 32, 32), // 7 - backward (spray)
                    ])
                ]);
                toon.isPlaying = false;
                toon.shadowAlpha = 1;
                /** * *
                * The player's astronaut toon.
                * @type {Toon}
                * * **/
                this.toon = toon;

                var shadow = new View(12,12,8,8);
                shadow.context.fillStyle = 'rgba(0,0,0,0.3)';
                shadow.context.fillRect(0,0,10,8);
                this.shadow = shadow;

                View.call(this,x,y);
                this.context.strokeStyle = 'rgba(255,0,0,0.5)';
                this.context.strokeRect(0,0,32,32);
                this.addView(shadow);
                this.addView(toon);
                this.hover = this.idleHover(startX, startY).interpolate();
            }

                Astronaut.prototype = new View(); 
                Astronaut.prototype.constructor = Astronaut;
                //-----------------------------
                //  METHODS
                //-----------------------------
                Astronaut.prototype.idleHover = function Astronaut_idleHover(startX, startY) {
                    var toon = this.toon;
                    var shadow = this.shadow;
                    startX = startX || 0;
                    startY = startY || 0;
                    return new Ease({
                        target : toon,
                        duration : 1000,
                        properties : {
                            y : startY-8,
                            shadowAlpha : 0.3,
                        },
                        onComplete : function reverse(hover) {
                            if (toon.y === startY-8) { 
                                hover.config.properties.y = startY;
                                hover.config.properties.shadowAlpha = 1;
                            } else {
                                hover.config.properties.y = startY-8;
                                hover.config.properties.shadowAlpha = 0.3;
                            }
                            hover.interpolate();
                        },
                        onUpdate : function update(hover) {
                            toon.y = Math.round(toon.y);
                            shadow.alpha = toon.shadowAlpha;
                        }
                    })
                };
                Astronaut.prototype.quickHover = function Astronaut_idleHover(startX, startY) {
                    var toon = this.toon;
                    var shadow = this.shadow;
                    startX = startX || 0;
                    startY = startY || 0;
                    return new Ease({
                        target : toon,
                        duration : 1000,
                        properties : {
                            y : startY-8,
                            shadowAlpha : 0.3,
                        },
                        onComplete : function reverse(hover) {
                            if (toon.y === startY-8) { 
                                hover.config.properties.y = startY;
                                hover.config.properties.shadowAlpha = 1;
                            } else {
                                hover.config.properties.y = startY-8;
                                hover.config.properties.shadowAlpha = 0.3;
                            }
                            hover.interpolate();
                        },
                        onUpdate : function update(hover) {
                            toon.y = Math.round(toon.y);
                            shadow.alpha = toon.shadowAlpha;
                        }
                    })
                };
                return Astronaut;
        })(modules.Toon,modules.Ease,modules.Sprite,modules.Rectangle,modules.View);
    /// Map from moon::View/Map.js
        modules.Map = (function initMapConstructor(Rectangle, View, Sprite) {
            /** * *
            * Constructs new Maps.
            * @constructor
            * @nosideeffects
            * @extends Sprite
            * @param {number=} x The x coordinate.
            * @param {number=} y The y coordinate.
            * @param {number=} w The width of the map.
            * @param {number=} h The height of the map.
            * @param {string=} src The source of the sprite sheet.
            * @param {Array.<number>=} frames A list of rectangles specifying the boundary of each frame.
            * @param {number} mapW The width of the map in tiles.
            * @param {number} mapH The height of the map in tiles.
            * @param {Array.<number>=} tileMap A list of indices mapping the tile to the frame (map spot -> image).
            * @param {Array.<Object>=} dataMap A list of objects of user data for each tile.
            * @return {Map}
            * * **/ 
            function Map(x, y, w, h, src, frames, mapW, mapH, tileMap, dataMap) {
                // Forward to Sprite...
                Sprite.call(this, x, y, w, h, src, frames);

                /** * *
                * The map width.
                * @type {number}
                * * **/
                this.mapW = mapW || 0;
                /** * *
                * The map height.
                * @type {number}
                * * **/
                this.mapH = mapH || 0;
                /** * *
                * The tile map.
                * @type {Array.<number>}
                * * **/
                this.tileMap = tileMap || [];        
                /** * *
                * The user data map.
                * @type {Array.<number>}
                * * **/
                this.dataMap = dataMap || [];
                /** * *
                * The amount scrolled in x.
                * @type {number}
                * * **/
                this.scrollX = 0;
                /** * *
                * The amount scrolled in y.
                * @type {number}
                * * **/
                this.scrollY = 0;
            }

            Map.prototype = new Sprite(); 
            Map.prototype.constructor = Map;
            //-----------------------------
            //  METHODS
            //-----------------------------
            /** * *
            * @inheritDoc
            * * **/
            Map.prototype.draw = function Map_draw(context) {
                // Maps cannot be played...
                this.isPlaying = false;
                // Clear the internal context...
                this.context.clearRect(0, 0, this.width, this.height);
                
                if (this.frames.length) {
                    // Get our measurements...
                    var frame = this.frames[0];
                    var tileW = frame.width();
                    var tileH = frame.height();
                    // Get our index boundaries...
                    var xstart = this.scrollX/tileW;
                    var xsndx = Math.floor(xstart);
                    var xend = (this.scrollX + this.width)/tileW;
                    var xendx = Math.floor(xend);
                    if (xstart !== xsndx) {
                        xendx += 1;
                    }
                    var ystart = this.scrollY/tileH;
                    var ysndx = Math.floor(ystart);
                    var yend = (this.scrollY + this.height)/tileH;
                    var yendx = Math.floor(yend);
                    if (ystart !== ysndx) {
                        yendx += 1;
                    }
                    // Find the offset...
                    var xoff = xsndx - xstart;
                    var yoff = ysndx - ystart;
                    // Run through and draw...            
                    for (var x = 0; x + xsndx < xendx; x++) {
                        // Bounds checking...
                        if (x + xsndx >= this.mapW) { 
                            continue;
                        }
                        for (var y = 0; y + ysndx < yendx; y++) {
                            // Bounds checking...
                            if (y + ysndx >= this.tileMap.length/this.mapW) {
                                continue;
                            }
                            // The current pixel offset at which to draw this tile...
                            var offsetx = (xoff*tileW) + x*tileW;
                            var offsety = (yoff*tileH) + y*tileH;
                            // The actual index of the tile we are drawing...
                            var ndx = (y + ysndx) * this.mapW + (x + xsndx);
                            // The tile map ndx...
                            var tileMapNdx = this.tileMap[ndx];
                            // The frame of our tile...
                            var frame = this.frames[tileMapNdx];
                            var frameW = frame.width();
                            var frameH = frame.height();
                            this.context.drawImage(this.sheet, frame.left(), frame.top(), frameW, frameH, offsetx, offsety, frameW, frameH);
                        }
                    }
                }

                View.prototype.draw.call(this, context);
            };

            return Map;
        })(modules.Rectangle,modules.View,modules.Sprite);
    /// MapData from moon::Data/MapData.js
        modules.MapData = (function initMapDataConstructor() {
            /** * *
            * Constructs new MapDatas.
            * @constructor
            * @nosideeffects
            * @return {MapData}
            * * **/ 
            function MapData(isWall) {
                /** * *
                * Whether or not the spot is a wall.
                * @type {Boolean}
                * * **/
                this.isWall = 1;
            }
            MapData.prototype = {}; 
            MapData.prototype.constructor = MapData;
            //-----------------------------
            //  METHODS
            //-----------------------------

            return MapData;
        })();
    /// Moonening from moon::Moonening.js
        modules.Moonening = (function initMooneningConstructor(Astronaut, Map, MapData, View, Rectangle) {
            /** * *
            * Constructs new Moonenings.
            * @constructor
            * @nosideeffects
            * @return {Moonening}
            * * **/ 
            function Moonening() {
                View.apply(this, arguments);

                var tileIndices = [
                    // tile indices...
                    2, 2, 2, 2, 2, 2, 2, 3, 4, 5, 2, 2, 2, 2, 2, 7, 
                    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8, 
                    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8, 
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 
                    2, 2, 2, 2, 2, 2, 7, 0, 0, 0, 0, 0, 0, 0, 0, 8, 
                    1, 1, 1, 1, 1, 1, 8, 0, 0, 0, 0, 0, 0, 0, 0, 8, 
                    1, 1, 1, 1, 1, 1, 8, 0, 0, 0, 0, 0, 0, 0, 0, 8, 
                    0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 8, 
                    0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 8, 
                    0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 8, 
                    2, 2, 2, 2, 2, 2, 6, 0, 0, 0, 0, 0, 0, 0, 0, 8, 
                    1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 8, 
                    1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 8, 
                ];
                var mapData = tileIndices.map(function mapTileIndicesToData(ndx) {
                    var data = new MapData();
                    switch (ndx) {
                        case 0: // A floor tile...
                            data.isWall = false;
                        break;

                        case 1: // A clear tile, which we use for walls...
                        case 2: // A wall...
                        case 3: // A wall...
                        case 4: // A door...
                        case 5: // A wall...
                        case 6: // A wall...
                        case 7: // A wall...
                            data.isWall = true;
                        break;

                        default:
                            data.isWall = false; 
                    }
                    return data;
                });
                /** * *
                * The ground map.
                * @type {Map}
                * * **/
                this.map = new Map(0, 0, 512, 512, 'img/tiles.png', [
                    // tile frames... 
                    new Rectangle(0,0,32,32), // 0 - floor
                    new Rectangle(511,511,1,1), // 1 - clear
                    new Rectangle(32,0,32,96), // 2 - wall repeat x
                    new Rectangle(64,0,32,96), // 3 - wall -> door
                    new Rectangle(96,0,32,96), // 4 - door
                    new Rectangle(128,0,32,96), // 5 - door -> wall 
                    new Rectangle(160,0,32,96), // 6 - wall end (if going vert)
                    new Rectangle(192,0,32,32), // 7 - wall (top vert)
                    new Rectangle(192,32,32,32), // 8 - wall vert repeating
                ], 16 /* map width */, 16 /* map height */, tileIndices, mapData);
                this.addView(this.map);
                /** * *
                * The map selector.
                * @type {View}
                * * **/
                this.mapSelector = new View(0,0,32,32);
                this.mapSelector.context.strokeStyle = 'rgba(0, 255, 0, 0.5)';
                this.mapSelector.context.strokeRect(0,0,32,32);
                this.addView(this.mapSelector);
                /** * *
                * The player's position.
                * @type {Array.<number>}
                * * **/
                this.playerPosition = [0,4];
                /** * *
                * The main player character.
                * @type {Astronaut}
                * * **/    
                this.player = new Astronaut(this.playerPosition[0]*32,this.playerPosition[1]*32);
                this.addView(this.player); 
                /** * *
                * Whether or not the game is suspended.
                * @type {Boolean}
                * * **/
                this.suspended = false;
            
                var self = this;
                document.body.onkeydown = function(e) {
                    switch (e.keyCode) {
                        case 71: // g 
                            self.playerPosition[1]--;
                        break;
                        case 70: // f
                            self.playerPosition[0]++;
                        break;
                        case 77: // m
                            self.playerPosition[1]++;
                        break;
                        case 68: // d
                            self.playerPosition[0]--;
                        break;

                        default:
                            console.log('unknown keyCode:',e.keyCode);
                    }
                };
                        
            }
            Moonening.prototype = new View(); 
            Moonening.prototype.constructor = Moonening;
            //-----------------------------
            //  METHODS
            //-----------------------------
            /** * *
            * Animates a player moving to a spot.
            * @param {number} x
            * @param {number} y
            * @param {function} callback
            * * **/
            Moonening.prototype.movePlayerTo = function Moonening_movePlayerTo(x, y, callback) {
                var self = this;
                var move = new Ease({
                    target : this.player,
                    duration : 400,
                    equation : Ease.easeInOutCirc,
                    properties : {
                        x : x,
                        y : y
                    },
                    onComplete : function movePlayerToCallback() {
                        callback.call(self);
                    }
                }).interpolate();
            };
            /** * *
            * Draws this view and its subviews into the given context.
            * @param {CanvasRenderingContext2D}
            * * **/
            Moonening.prototype.draw = function Moonening_draw(context) {
                if (!this.suspended) {
                    // Put the player in the right place...
                    var nextXPos = 32*this.playerPosition[0];
                    if (this.player.x !== nextXPos) {
                        this.suspended = true;
                        //this.player.hover.cancel();
                        if (this.player.x < nextXPos) { 
                            this.player.toon.currentSpriteNdx = 5;
                        } else {
                            this.player.toon.currentSpriteNdx = 6;
                        }
                        this.movePlayerTo(32*this.playerPosition[0], this.player.y, function moveXCallback() {
                            this.suspended = false;
                            //this.player.hover.interpolate();
                            this.player.toon.currentSpriteNdx -= 4;
                        }); 
                    }
                    var nextYPos = 32*this.playerPosition[1];
                    if (this.player.y !== nextYPos) {
                        this.suspended = true;
                        //this.player.hover.cancel();
                        if (this.player.y < nextYPos) { 
                            this.player.toon.currentSpriteNdx = 4;
                        } else {
                            this.player.toon.currentSpriteNdx = 7;
                        }
                        this.movePlayerTo(this.player.x, 32*this.playerPosition[1], function moveYCallback() {
                            this.suspended = false;
                            //this.player.hover.interpolate();
                            this.player.toon.currentSpriteNdx -= 4;
                        }); 
                    }
                }
                View.prototype.draw.call(this,context);
            };

            return Moonening;
        })(modules.Astronaut,modules.Map,modules.MapData,modules.View,modules.Rectangle);
    /// Levelator from moon::Dev/Levelator.js
        modules.Levelator = (function initLevelatorConstructor(Moonening, Sprite, View, Rectangle) {
            /** * *
            * Constructs new Levelators.
            * @constructor
            * @nosideeffects
            * @return {Levelator}
            * * **/ 
            function Levelator() {
                View.call(this,0,0,512,512); 
                /** * *
                * A nice backing.
                * @type {View}
                * * **/
                this.back = new View(0,0,512,512);
                this.back.context.fillStyle = 'rgba(0,0,0,0.5)';
                this.back.context.fillRect(0,0,512,512);
                this.addView(this.back);
                /** * *
                * The tileset.
                * @type {Sprite}
                * * **/ 
                this.tileset = new Sprite(0,0,512,512,'img/tiles.png');
                this.addView(this.tileset);
                /** * *
                * The tile selector.
                * @type {View}
                * * **/
                this.tileSelector = new View(0,0,32,32);
                this.tileSelector.context.strokeStyle = 'rgb(255,0,255)';
                this.tileSelector.context.strokeRect(0,0,32,32);
                this.addView(this.tileSelector);
            }

            Levelator.prototype = new View() 
            Levelator.prototype.constructor = Levelator;
            //-----------------------------
            //  METHODS
            //-----------------------------
            return Levelator;
        })(modules.Moonening,modules.Sprite,modules.View,modules.Rectangle);
    /// Main from main
        modules.Main = (function initMain(Stage, Moonening, Levelator) {
                        var stage = window.stage = new Stage(512, 512);
                        document.body.appendChild(stage.canvas);
                        
                        var moon = new Moonening();
                        window.moon = moon;
                        stage.addView(moon);

                        var level = new Levelator();
                        window.level = level;
                        //stage.addView(level);

                        //setTimeout(function() {
                        //    outline.context.putImageData(Filters.mapBitmap(toon.context.getImageData(0,0,30,50), function thresh(pixel,imageData) {
                        //        var width = 2;
                        //        if (pixel.a === 0) {
                        //            var count = Filters.getMoore(pixel, 2).reduce(function(acc, neighborPixel) {
                        //                if (neighborPixel.a > 0) {
                        //                    return acc+1;
                        //                }
                        //                return acc;
                        //            }, 0);
                        //            pixel.r = 0;
                        //            pixel.g = 0;
                        //            pixel.b = 0;
                        //            pixel.a = count > 1 ? 255 : 0; 
                        //        } else {
                        //            pixel.r = 0;
                        //            pixel.g = 0;
                        //            pixel.b = 0;
                        //            pixel.a = 0;
                        //        }
                        //        return pixel;
                        //    }), 0, 0);
                        //}, 1000);

                    })(modules.Stage,modules.Moonening,modules.Levelator);
        return modules;
    }(window));
}

/*jshint esnext: true*/

var faceToPolygon = function( face ) {
    var p = [];
    for ( var vert of face.$verts().values() ) {
        p.push( vert.annotation.x );
        p.push( vert.annotation.y );
    }
    return p;
};

var doesFaceContainPoint = function( face, x, y ) {
    return PolyK.ContainsPoint( faceToPolygon( face ), x, y );
};

var doesFaceContainVert = function( face, vert ) {
    return doesFaceContainPoint( face, vert.annotation.x, vert.annotation.y );
};

var faceFromMeshWithPoint = function( mesh, x, y ) {
    for ( var face of mesh.faces.values() ) {
        if ( doesFaceContainPoint( face, x, y ) ) {
            return face;
        }
    }
};

var faceFromMeshWithVert = function( mesh, vert ) {
    return faceFromMeshWithPoint( mesh, vert.annotation.x, vert.annotation.y );
};

var distBetweenPointAndPoint = function( x1, y1, x2, y2 ) {
    return Math.sqrt( Math.pow( x2 - x1, 2 ) + Math.pow( y2 - y1, 2 ) );
};

var distBetweenVertAndPoint = function( vert, x, y ) {
    return distBetweenPointAndPoint( vert.annotation.x, vert.annotation.y, x, y );
};

var distBetweenVertAndVert = function( vert1,vert2 ) {
    return distBetweenPointAndPoint( vert1.annotation.x, vert1.annotation.y, vert2.annotation.x, vert2.annotation.y );
};

var vertFromFaceNearestPoint = function( face, x, y ) {
    var nearestVert;
    var nearestDistance = Number.POSITIVE_INFINITY; 
    for ( var vert of face.$verts().values() ) {
        var distance = distBetweenVertAndPoint( vert, x, y );
        if ( distance < nearestDistance ) {
            nearestVert = vert;
            nearestDistance = distance;
        }
    }
    return nearestVert;
};

var vertFromFaceNearestVert = function( face, vert ) {
    return vertFromFaceNearestPoint( face, vert.annotation.x, vert.annotation.y );
};

var vertsByDistFromPoint = function( verts, x, y ) {
    
    var dists = new Map();
    
    for ( var vert of verts.values() ) {
        dists.set( vert, distBetweenVertAndPoint( vert, x, y ) );
    }
    
    verts = [ ...verts.values() ];
    verts.sort( function( vert1, vert2 ) {
        if ( dists.get( vert1 ) < dists.get( vert2 ) ) {
            return -1;
        } else if ( dists.get( vert1 ) > dists.get( vert2 ) ) {
            return 1;
        } else {
            return 0;
        }
    } );
    
    return verts;
    
};

var vertsByDistFromVert = function( verts, vert ) {
    return vertsByDistFromPoint( verts, vert.annotation.x, vert.annotation.y );
};

var facesByDistFromPoint = function( faces, x, y ) {
    faces = [ ...faces ];
    faces.sort( function( f1, f2) {
        var dist1 = distBetweenVertAndPoint( vertFromFaceNearestPoint( f1.$verts(), x, y ), x, y );
        var dist2 = distBetweenVertAndPoint( vertFromFaceNearestPoint( f2.$verts(), x, y ), x, y );
        if ( dist1 < dist2 ) {
            return -1;
        } else if ( dist1 > dist2 ) {
            return 1;
        } else {
            return 0;
        }
    } );
    return faces;
};

var facesByDistFromVert = function( faces, vert ) {
    return facesByDistFromPoint( faces, vert.annotation.x, vert.annotation.y );
};

var normalizeRadian = function( angle ) {
    angle %= Math.PI*2;
    if ( angle < 0 ) {
        return Math.PI*2 + angle;
    } else { 
        return angle; 
    }
};

var slopeOfVerts = function( a, b ) {
    return normalizeRadian( Math.atan2( b.annotation.y - a.annotation.y, b.annotation.x - a.annotation.x ) );
};

var angleOfVerts = function( center, hand ) {
    return normalizeRadian( Math.atan2( hand.annotation.y - center.annotation.y, hand.annotation.x - center.annotation.x ) );
};

var acuteAngleBetweenVerts = function( a, b ) {
    var d = normalizeRadian( b - a )
    if ( d > Math.PI ) return Math.PI*2 - d;
    else return d;
};

var acuteFunnelFromVerts = function( center, a, b, marginRadius ) {

    var left; var leftAngle;
    var right; var rightAngle;
    
    var marginRadius = marginRadius ? marginRadius : 0;
    var slope = slopeOfVerts( a, b );
    var marginX = Math.cos( slope ) * marginRadius;
    var marginY = Math.sin( slope ) * marginRadius;
    
    var angle1 = angleOfVerts( center, { annotation: { 
        x: a.annotation.x + marginX,
        y: a.annotation.y + marginY 
    } } );
    var angle2 = angleOfVerts( center, { annotation: { 
        x: b.annotation.x - marginX,
        y: b.annotation.y - marginY 
    } } );
    
    if ( Math.abs( angle1 - angle2 ) <= Math.PI ) {
        if ( angle1 < angle2 ) {
            left = a; leftAngle = angle1;
            right = b; rightAngle = angle2;
        } else {
            left = b; leftAngle = angle2;
            right = a; rightAngle = angle1;
        }
    } else {
        if ( angle1 > angle2 ) {
            left = a; leftAngle = angle1;
            right = b; rightAngle = angle2;
        } else {
            left = b; leftAngle = angle2;
            right = a; rightAngle = angle1;
        }
    }
    
    return { 
        center: center,
        left: left, leftAngle: leftAngle,
        right: right, rightAngle: rightAngle
    };
    
};

var checkVertBetweenVertFunnel = function( funnel, check ) {
//    console.log( "FUNNEL: " + funnel.center.annotation.tag + " " + funnel.left.annotation.tag + " " + funnel.right.annotation.tag );
    if ( ( funnel.center == funnel.left || funnel.center == funnel.right ) || ( check == funnel.left || check == funnel.right ) ) return { pass: true };
    var angle = angleOfVerts( funnel.center, check );
    if ( funnel.leftAngle < funnel.rightAngle ) {
        if ( ( angle < funnel.leftAngle ) || ( angle > funnel.rightAngle ) ) {
            var leftDiff = acuteAngleBetweenVerts( angle, funnel.leftAngle ); 
            var rightDiff = acuteAngleBetweenVerts( angle, funnel.rightAngle ); 
            var overflow; var overflowAngle;
            if ( leftDiff < rightDiff ) {
                if ( check != funnel.left ) {
                    overflow = funnel.left;
                    overflowAngle = leftDiff;
                }
            } else {
                if ( check != funnel.right ) {
                    overflow = funnel.right;
                    overflowAngle = rightDiff;
                }
            }
            if ( overflow != check ) {
                return { pass: false, overflow: overflow, overflowAngle: overflowAngle };
            }
        } 
        return { pass: true };
        
    } else {
        if ( angle < Math.PI ) {
            if ( angle > funnel.rightAngle ) {
                return { pass: false, overflow: funnel.right, overflowAngle: Math.abs( angle - funnel.rightAngle ) };
            }
        } else {
            if ( angle < funnel.leftAngle ) {
                return { pass: false, overflow: funnel.left, overflowAngle: Math.abs( angle - funnel.leftAngle ) };
            }
        }
        return { pass: true };
    }
};
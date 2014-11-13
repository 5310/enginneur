/*jshint esnext: true*/

var solvePath = function( mesh, start, goal, radius ) {
    
    var radius = radius ? radius : 4;
    
    var startFace = faceFromMeshWithVert( mesh, start ); if ( !startFace ) throw "Invalid starting location.";
    var goalFace = faceFromMeshWithVert( mesh, goal ); if ( !goalFace ) throw "Invalid goal location.";    
    
    if ( startFace == goalFace ) {
        
        return [ start, goal ];
        
    } else {
        
        var previous;
        var current;
        var next;
        
        var frontier = new Heap( function( next1, next2 ) { return next1[1] - next2[1]; } );
        var cameFrom = new Map();
        var costSoFar = new Map();
        
        var g = function( next ) {
            return costSoFar.get( current ) + 1; // That 1 is actually the cost between current and next. No variable costs in this prototype though.
        };
        var h = function( next ) {
            var nearest = vertFromFaceNearestVert( next, goal );
            return distBetweenVertAndVert( nearest, goal );
        };

        frontier.push( [ startFace, 0 ] );
        cameFrom.set( startFace, null );
        costSoFar.set( startFace, 0 );
        
        while ( !frontier.empty() ) {
            
            // Get new node to check.
            current = frontier.pop()[0];
            
            // If node is goal generate actual path!
            if ( current == goalFace ) {
                
                // Create facePath from traversal history.
                var facePath = new Set();
                current = goalFace;
                while ( current !== startFace ) {
                    current = cameFrom.get( current );
                    facePath.add( current );
                }
                
                // Convert facePath to edgePath.
                previous = goalFace;
                var edgePath = [];
                for ( current of facePath ) {
                    var commonEdges = setalg.intersection( previous.edges, current.edges );
                    edgePath.push( ...commonEdges );
                    previous = current;
                }
                
                /*
                // Convert edgePath to vertPath using center of edges.
                var vertPath = [];
                for ( current of edgePath ) {
                    vertPath.push( { annotation: { 
                        x: ( current.vert1.annotation.x + current.vert2.annotation.x ) / 2, 
                        y: ( current.vert1.annotation.y + current.vert2.annotation.y ) / 2 
                    } } );
                }
                vertPath.reverse();
                vertPath.unshift( start );
                vertPath.push( goal );
                */                
                
                // Convert edgePath to vertPath using the funnel algorithm.
                
                // Reverse edgepath to proper direction.
                edgePath.reverse();
                
                // Start with start!
                next = start;
                var vertPath = [ next ];
                
                // Create funnel from first edge.
                var funnel = acuteFunnelFromVerts( next, edgePath[0].vert1, edgePath[0].vert2, radius );
                
                // Iterate over rest of the edges...
                for ( var i = 1; i < edgePath.length; i++  ) {  
                    
//                    console.log( "converting edge " + edgePath[i].annotation.tag + " to vert" );
                    
                    var vert1 = edgePath[i].vert1;
                    var vert2 = edgePath[i].vert2;
                    
                    // Check to see if vert1 or vert2 is within tunnel.
                    var check1 = checkVertBetweenVertFunnel( funnel, vert1 ); 
//                    console.log( "checking funnel: " + vert1.annotation.tag + " " + check1.pass ); console.log( check1 );
                    var check2 = checkVertBetweenVertFunnel( funnel, vert2 ); 
//                    console.log( "checking funnel: " + vert2.annotation.tag + " " + check2.pass ); console.log( check2 );
                    
                    // See which side of the funnel to add to vertPath if broken.
                    if ( !check1.pass && !check2.pass ) {
                        if ( distBetweenVertAndVert( goal, funnel.left ) < distBetweenVertAndVert( goal, funnel.right ) )
                            next = funnel.left;
                        else
                            next = funnel.right;
                    } else {
                        // Check which side is broken.
                        if ( !check1.pass ) next = check1.overflow;
                        if ( !check2.pass ) next = check2.overflow;
                        // Add new vert to path only if not already added due to being a common vert.
                    }
                    if ( next != vertPath[ vertPath.length - 1 ] ) {
                        //TODO: Calculate rotation arc around vert for wide tokens to get to here and annotate on vert.
                        //
                        // I've decided not to create width offset vertPaths, as they make no sense where we can have wire edges.
                        //
                        // Instead, each vert on he path has a arrive and depart angle, 
                        // to and from which tokens should interpolate to while moving between verts.
                        // And also when rotating around the vert.
                        //
                        // We're only calculating to circles to points, not circles to circles, because we don't know of the next point at this point.
                        // But it's more than good enough as an approximation, even without steering, as long as token rotates around verts. And less work!
                        //
                        // The problem is, we're reusing verts, and it's fouling up the mesh with annotation that doesn't need to be persistent.
                        // Perhaps we should use a map? Yes!
                        //
                        // http://stackoverflow.com/a/1351794
                        /*
                        if ( vertPath.length > 1 ) {
                            previous = vertPath[ length - 2 ];
                            current = vertPath[ length - 1 ];
                            var s = slopeOfVerts( current, next );
                            var r = Math.acos( distBetweenVertAndVert( current, next ) / radius );
                        }
                        */
                        vertPath.push( next );
//                        console.log( "adding " + next.annotation.tag );
                    }                    
                    // Renew funnel with new center and edge.
                    funnel = acuteFunnelFromVerts( next, vert1, vert2, radius );
                    
                }
                
                // Check if the final connection to goal breaks tunnel.
                var check = checkVertBetweenVertFunnel( funnel, goal ); console.log( check );
                if ( !check.pass ) {
                    if ( check.overflow != vertPath[ vertPath.length - 1 ] ) {
                        //TODO: Calculate rotation arc around vert for wide tokens to get to here and annotate on vert.
                        vertPath.push( check.overflow );
                    }
                }
                
                // Finish with goal.
                vertPath.push( goal );

                // Return vertPath.
                return vertPath;
            
            }
            
            // Collect next candidate nodes.
            var nexts = [];
            for ( var edge of current.edges ) {
                // Check if traversing edge is wide enough for token.
                var width = distBetweenVertAndVert( edge.vert1, edge.vert2 );
                if ( !edge.annotation.wall && width > 2*radius) {
                    for ( var face of edge.faces ) {
                        //TODO: Check if face is big enough for token. 
                        // But this is non-trivial for non-triangular faces, so not being implemented.
                        nexts.push( face );
                    }
                }
            }
            
            // If candidate not already traversed, add to frontier and record previous.
            for ( next of nexts ) {
                if ( !cameFrom.has( next ) ) {
                    var cost = g( next ); 
                    if ( !costSoFar.has( next ) || cost < costSoFar.get( next ) ) {
                        var priority = cost + h( next ); // Effectively, f() = g() + h(), hence A*!
                        frontier.push( [ next, priority ] );
                        cameFrom.set( next, current );
                        costSoFar.set( next, cost );
                    }
                }
            }
            
        }
        
        return [];
        
    }
    
};
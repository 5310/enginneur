/*jshint esnext: true*/

// Pixi.js setup. //

// Scale.
var scale = new PIXI.Point( 4, 4 );

// Create an new instance of a pixi stage
var stage = new PIXI.Stage( 0xffffff, true ); stage.scale = scale;

// Create a renderer instance.
var renderer = PIXI.autoDetectRenderer( 120*scale.x, 120*scale.y );

// Add the renderer view element to the DOM.
document.body.appendChild( renderer.view );

// Drawables.
var container = new PIXI.DisplayObjectContainer(); stage.addChild( container ); container.scale = scale;
var navmeshDrawable = new PIXI.Graphics(); container.addChild( navmeshDrawable );
var pathingDrawable = new PIXI.Graphics(); container.addChild( pathingDrawable );

// Draw loop.
//requestAnimFrame( animate );
//function animate() {
//    requestAnimFrame( animate );
//    // render the stage  
//    renderer.render(stage);
//}
renderer.render(stage);


// Drawing functions. //

var drawLine = function( graphics, x1, y1, x2, y2 )  {
    graphics.moveTo( x1, y1 );
    graphics.lineTo( x2, y2 );
};
var drawArrow = function( graphics, x1, y1, x2, y2, radius )  {
    var r = Math.atan2( y2-y1, x2-x1 );
    graphics.drawPolygon( [ 
        x1, y1,
        x1+Math.cos(r-Math.PI/2)*radius, y1+Math.sin(r-Math.PI/2)*radius,
        x1+Math.cos(r)*radius, y1+Math.sin(r)*radius,
        x1+Math.cos(r+Math.PI/2)*radius, y1+Math.sin(r+Math.PI/2)*radius,
    ] );
};
var drawStar = function( graphics, x, y, radius, ratio )  {
    graphics.drawPolygon( [ 
        x-radius, y-radius, 
        x, y-radius*ratio,
        x+radius, y-radius, 
        x+radius*ratio, y,
        x+radius, y+radius, 
        x, y+radius*ratio,
        x-radius, y+radius, 
        x-radius*ratio, y,
    ] );
};

// Draw navmeshDrawable.
var drawnavmeshDrawable = function( mesh ) {
    
    navmeshDrawable.clear();
    
    for ( var edge of mesh.edges.values() ) {
        navmeshDrawable.lineStyle( 6, 0x333333, edge.annotation.wall ? 1 : 0.1 );
        drawLine( navmeshDrawable, edge.vert1.annotation.x, edge.vert1.annotation.y, edge.vert2.annotation.x, edge.vert2.annotation.y );
    }

    navmeshDrawable.lineStyle( 6, 0x333333, 1 );
    navmeshDrawable.beginFill( 0xffffff, 1 );
    for ( var vert of mesh.verts.values() ) {
        navmeshDrawable.drawCircle( vert.annotation.x, vert.annotation.y, 2);
    }
    navmeshDrawable.endFill();
    
    renderer.render(stage);

};
drawnavmeshDrawable( navmesh.mesh );

// Draw pathingDrawable.
var drawpathingDrawable = function( verts, radius ) {
    
    pathingDrawable.clear();

    pathingDrawable.lineStyle( 1, 0x00cc00, 1 );
    var lastVert;
    for ( var i in verts ) {
        var vert = verts[i];
        if ( lastVert ) {
            drawLine( pathingDrawable, lastVert.annotation.x-0.5, lastVert.annotation.y-0.5, vert.annotation.x, vert.annotation.y );
            pathingDrawable.lineStyle( 0 );
            pathingDrawable.beginFill( 0xffffff, 1 );
            drawArrow( pathingDrawable, lastVert.annotation.x, lastVert.annotation.y, vert.annotation.x, vert.annotation.y, 2 );
            pathingDrawable.lineStyle( 1, 0x00cc00, 1 );
        }
        lastVert = vert;
        pathingDrawable.beginFill( 0xffffff, 0.0 ); 
        pathingDrawable.drawCircle( vert.annotation.x-0.5, vert.annotation.y-0.5, radius);
    }
    if ( lastVert ) {
        pathingDrawable.beginFill( 0xffffff, 1 );
        pathingDrawable.lineStyle( 0 );
        drawStar( pathingDrawable, lastVert.annotation.x, lastVert.annotation.y, 2, 0.5 );
        pathingDrawable.endFill();
    }
    
    renderer.render(stage);

};
drawpathingDrawable( navmesh.pathing, navmesh.marginRadius );



// Interactivity. //
var state = 0; // 0 means nothing, 1 is start set, 2 is goal set
stage.mousedown = function( data ) { 
    var mousePosition = stage.getMousePosition();
    switch ( state ) {
        case 0:
            navmesh.start.annotation.x = mousePosition.x/4;
            navmesh.start.annotation.y = mousePosition.y/4;
            pathingDrawable.clear();
            state = 1;
            break;
        case 1:
            navmesh.goal.annotation.x = mousePosition.x/4;
            navmesh.goal.annotation.y = mousePosition.y/4;
            navmesh.pathingDrawable = solvePath( navmesh.mesh, navmesh.start, navmesh.goal );
            drawpathingDrawable( navmesh.pathingDrawable, navmesh.marginRadius );
            state = 2;
            break;
        case 2:
            navmesh.start.annotation.x = mousePosition.x/4;
            navmesh.start.annotation.y = mousePosition.y/4;
            pathingDrawable.clear();
            state = 1;
            break;
        default:
            state = 0;
            break;
    }
    drawnavmeshDrawable( navmesh.mesh );
};
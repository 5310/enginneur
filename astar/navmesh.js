var navmesh = {};

navmesh.marginRadius = 4;
    
navmesh.mesh = new aifm.SimpleMesh();

navmesh.vA = navmesh.mesh.addVertByCoords( 10, 110 ); navmesh.vA.annotation.tag = 'vA';
navmesh.vB = navmesh.mesh.addVertByCoords( 10, 10 ); navmesh.vB.annotation.tag = 'vB';
navmesh.vC = navmesh.mesh.addVertByCoords( 110, 10 ); navmesh.vC.annotation.tag = 'vC';
navmesh.vD = navmesh.mesh.addVertByCoords( 110, 110 ); navmesh.vD.annotation.tag = 'vD';
navmesh.vE = navmesh.mesh.addVertByCoords( 40, 110 ); navmesh.vE.annotation.tag = 'vE';
navmesh.vF = navmesh.mesh.addVertByCoords( 40, 40 ); navmesh.vF.annotation.tag = 'vF';
navmesh.vG = navmesh.mesh.addVertByCoords( 80, 40 ); navmesh.vG.annotation.tag = 'vG';
navmesh.vH = navmesh.mesh.addVertByCoords( 110, 40 ); navmesh.vH.annotation.tag = 'vH';
navmesh.vI = navmesh.mesh.addVertByCoords( 80, 110 ); navmesh.vI.annotation.tag = 'vI';

navmesh.e1 = navmesh.mesh.addEdgeByVertPair( navmesh.vA, navmesh.vB ); navmesh.e1.annotation.tag = 'e1'; navmesh.e1.annotation.wall = true; 
navmesh.e2 = navmesh.mesh.addEdgeByVertPair( navmesh.vB, navmesh.vC ); navmesh.e2.annotation.tag = 'e2'; navmesh.e2.annotation.wall = true; 
navmesh.e3 = navmesh.mesh.addEdgeByVertPair( navmesh.vH, navmesh.vD ); navmesh.e3.annotation.tag = 'e3'; navmesh.e3.annotation.wall = true; 
navmesh.e4 = navmesh.mesh.addEdgeByVertPair( navmesh.vD, navmesh.vI ); navmesh.e4.annotation.tag = 'e4'; navmesh.e4.annotation.wall = true; 
navmesh.e5 = navmesh.mesh.addEdgeByVertPair( navmesh.vE, navmesh.vA ); navmesh.e5.annotation.tag = 'e5'; navmesh.e5.annotation.wall = true; 
navmesh.e6 = navmesh.mesh.addEdgeByVertPair( navmesh.vE, navmesh.vF ); navmesh.e6.annotation.tag = 'e6'; navmesh.e6.annotation.wall = true; 
navmesh.e7 = navmesh.mesh.addEdgeByVertPair( navmesh.vF, navmesh.vG ); navmesh.e7.annotation.tag = 'e7'; navmesh.e7.annotation.wall = true; 
navmesh.e8 = navmesh.mesh.addEdgeByVertPair( navmesh.vG, navmesh.vD ); navmesh.e8.annotation.tag = 'e8'; navmesh.e8.annotation.wall = false; 
navmesh.e9 = navmesh.mesh.addEdgeByVertPair( navmesh.vG, navmesh.vH ); navmesh.e9.annotation.tag = 'e9'; navmesh.e9.annotation.wall = false; 
navmesh.e10 = navmesh.mesh.addEdgeByVertPair( navmesh.vF, navmesh.vB ); navmesh.e10.annotation.tag = 'e10'; navmesh.e10.annotation.wall = false; 
navmesh.e11 = navmesh.mesh.addEdgeByVertPair( navmesh.vG, navmesh.vC ); navmesh.e11.annotation.tag = 'e11'; navmesh.e11.annotation.wall = false; 
navmesh.e12 = navmesh.mesh.addEdgeByVertPair( navmesh.vC, navmesh.vH ); navmesh.e12.annotation.tag = 'e12'; navmesh.e12.annotation.wall = true; 
navmesh.e13 = navmesh.mesh.addEdgeByVertPair( navmesh.vG, navmesh.vE ); navmesh.e13.annotation.tag = 'e13'; navmesh.e13.annotation.wall = true; 
navmesh.e14 = navmesh.mesh.addEdgeByVertPair( navmesh.vI, navmesh.vE ); navmesh.e14.annotation.tag = 'e14'; navmesh.e14.annotation.wall = true; 
navmesh.e15 = navmesh.mesh.addEdgeByVertPair( navmesh.vG, navmesh.vI ); navmesh.e15.annotation.tag = 'e15'; navmesh.e15.annotation.wall = false; 

navmesh.fAlpha = navmesh.mesh.addFaceByEdgeLoop( [ navmesh.e1, navmesh.e10, navmesh.e6, navmesh.e5 ] ); navmesh.fAlpha.annotation.tag = 'fAlpha';
navmesh.fBeta = navmesh.mesh.addFaceByEdgeLoop( [ navmesh.e2, navmesh.e11, navmesh.e7, navmesh.e10 ] ); navmesh.fBeta.annotation.tag = 'fBeta';
navmesh.fGamma = navmesh.mesh.addFaceByEdgeLoop( [ navmesh.e3, navmesh.e8, navmesh.e9 ]  ); navmesh.fGamma.annotation.tag = 'fGamma';
navmesh.fDelta = navmesh.mesh.addFaceByEdgeLoop( [ navmesh.e4, navmesh.e15, navmesh.e8 ] ); navmesh.fDelta.annotation.tag = 'fDelta';
navmesh.fEpsilon = navmesh.mesh.addFaceByEdgeLoop( [ navmesh.e12, navmesh.e9, navmesh.e11 ] ); navmesh.fEpsilon.annotation.tag = 'fEpsilon';
navmesh.fZeta = navmesh.mesh.addFaceByEdgeLoop( [ navmesh.e13, navmesh.e6, navmesh.e7 ] ); navmesh.fZeta.annotation.tag = 'fZeta';
navmesh.fEta = navmesh.mesh.addFaceByEdgeLoop( [ navmesh.e14, navmesh.e13, navmesh.e15 ] ); navmesh.fEta.annotation.tag = 'fEta';

navmesh.start = navmesh.mesh.addVertByCoords( 10+Math.random()*100, 10+Math.random()*100 ); navmesh.start.annotation.tag = 'start';
navmesh.goal = navmesh.mesh.addVertByCoords( 10+Math.random()*100, 10+Math.random()*100 ); navmesh.goal.annotation.tag = 'goal';
//navmesh.start = navmesh.mesh.addVertByCoords( 25, 50 ); navmesh.start.annotation.tag = 'start';
//navmesh.goal = navmesh.mesh.addVertByCoords( 100, 50 ); navmesh.goal.annotation.tag = 'goal';
navmesh.pathing = solvePath( navmesh.mesh, navmesh.start, navmesh.goal, navmesh.marginRadius );
import * as THREE from  '../build/three.module.js';
import { degreesToRadians } from "../libs/util/util.js";


function createFuselage(cube, loadingManager){

    var fuselageMaterial = new THREE.MeshPhongMaterial({
      color:'rgb(100,0,255)',
      specular:'#111111',
      shininess:57,
      flatShading:false,
      reflectivity:1,
      refractionRatio:1
    });
          
    // create fuselage body
    var fuselageBodyGeometry = new THREE.CylinderGeometry(5.5, 3.5, 22,32);
    var fuselage = new THREE.Mesh(fuselageBodyGeometry, fuselageMaterial);
    fuselage.castShadow = true;  
    fuselage.receiveShadow = true;  
    // add the fuselage body to the scene
    //fuselage.position.set(0, 0, 10);
    let textureLoader = new THREE.TextureLoader(loadingManager); 
    let wall01 = textureLoader.load('imgs/planePlate01.jpg', function ( wall01 ) {
      wall01.wrapS = wall01.wrapT = THREE.RepeatWrapping;
      wall01.offset.set( 0, 0);
      wall01.repeat.set( 5, 2 )
      wall01.rotation = 0;
    } ); 
    fuselage.material.map = wall01;
    cube.add(fuselage);
  
    // create cockpit base
    var cockpitBaseGeometry = new THREE.CylinderGeometry(4.5, 5.5, 7,32);
    var cockpitBase = new THREE.Mesh(cockpitBaseGeometry, fuselageMaterial);
    cockpitBase.castShadow = true;  
    cockpitBase.receiveShadow = true; 
    // add the cockpit base to the fuselage
    cockpitBase.position.set(0, 14.5, 0);
    fuselage.add(cockpitBase);
  
    // create front fuselage
    var frontFuselageGeometry = new THREE.CylinderGeometry(1.5, 4.5, 3,32);
    var frontFuselage = new THREE.Mesh(frontFuselageGeometry, fuselageMaterial);
    frontFuselage.castShadow = true;  
    frontFuselage.receiveShadow = true; 
    frontFuselage.material.map = wall01;
    // add the front to the fuselage
    frontFuselage.position.set(0, 19.5, 0);
    fuselage.add(frontFuselage);
  
    // create stabilizer base
    var stabilizerBaseGeometry = new THREE.CylinderGeometry(3.5, 2.0, 8,32);
    var stabilizerBase= new THREE.Mesh(stabilizerBaseGeometry,fuselageMaterial);
    stabilizerBase.castShadow = true;  
    stabilizerBase.receiveShadow = true; 
    stabilizerBase.material.map = wall01;
    // add the stabilizer base to the fuselage
    stabilizerBase.position.set(0.0, -15, 0);
    fuselage.add(stabilizerBase);
  
    // create fuselage back
    var fuselageBackGeometry = new THREE.CylinderGeometry(2.0, 0.5, 1,32);
    var fuselageBack= new THREE.Mesh(fuselageBackGeometry, fuselageMaterial);
    fuselageBack.castShadow = true;  
    fuselageBack.receiveShadow = true; 

    // add the back to the fuselage
    fuselageBack.position.set(0.0, -19.5, 0);
    fuselage.add(fuselageBack);
  
    // fuselage.translateX(50);
    return fuselage;
  }

  function createWings(loadingManager){

    //create Wing Shape
    const wingShape = new THREE.Shape();
    wingShape.moveTo( 0,0 );
    wingShape.lineTo( 0, -5 );
    wingShape.lineTo( 20, -3 );
    wingShape.lineTo( 20, 1 );
    wingShape.lineTo ( 6, 3 );
    wingShape.lineTo ( 0, 6);
    wingShape.lineTo( 0, 0 );
  
    const wingExtrudeSettings = {
      steps: 1,
      depth: 1,
      bevelEnabled: true,
      bevelThickness: 0,
      bevelSize: 0,
      bevelOffset: 0,
      bevelSegments: 5
    };
  
    //create wings
    const wingGeometry = new THREE.ExtrudeGeometry( wingShape, wingExtrudeSettings);
    wingGeometry.rotateX(degreesToRadians(180));
    const wingMaterial = new THREE.MeshPhongMaterial({
      color:'rgb(255,100,0)',
      specular:'#111111',
      shininess:57,
      flatShading:false,
      reflectivity:1,
      refractionRatio:1
    } );
    
    const leftWing = new THREE.Mesh( wingGeometry, wingMaterial ) ;
    wingGeometry.translate(0,0,0.5); // match wing height; required due to rotation
    const rightWing = new THREE.Mesh (wingGeometry, wingMaterial);
    leftWing.rotateY(degreesToRadians(180));
    leftWing.castShadow = true;  
    leftWing.receiveShadow = true; 
    rightWing.castShadow = true;  
    rightWing.receiveShadow = true; 
    //add the wings to the scene
    leftWing.position.set(0, 0, 0);
    rightWing.position.set(0, 0, 0);
    leftWing.rotateZ(degreesToRadians(-4.7))
    rightWing.rotateZ(degreesToRadians(-4.7))
    
    // Left wing texture  
  let textureLoader2 = new THREE.TextureLoader(loadingManager); 
  let wall01 = textureLoader2.load('imgs/planePlate01.jpg', function ( wall01 ) {
    wall01.wrapS = wall01.wrapT = THREE.RepeatWrapping;
    wall01.offset.set( 0, 0);
    wall01.repeat.set( 0.6, 0.3 )
    wall01.rotation = 0;
  } ); 
  leftWing.material.map = wall01;

  var leftDecalGeometry = new THREE.PlaneGeometry(5, 5);
  var leftDecalMaterial = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide});
  var leftDecal = new THREE.Mesh(leftDecalGeometry, leftDecalMaterial);
  leftDecal.translateZ(-0.59);
  leftDecal.translateX(10);
  leftDecal.translateY(1.0);
  leftDecal.rotateY(degreesToRadians(180));
  leftWing.add(leftDecal);
  let textureLoader = new THREE.TextureLoader(loadingManager);
  let ufjfDecal = textureLoader.load('imgs/texturaUFJF.jpg', function ( ufjfDecal ) {  } );   
  leftDecal.material.map = ufjfDecal;
  
  // right wing texture
  var rightDecalGeometry = new THREE.PlaneGeometry(5, 5);
  var rightDecalMaterial = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide});
  var rightDecal = new THREE.Mesh(rightDecalGeometry, rightDecalMaterial);
  rightDecal.translateZ(0.59);
  rightDecal.translateX(10);
  rightDecal.translateY(0.8);
  rightDecal.rotateY(degreesToRadians(180));
  rightWing.add(rightDecal);
  let dccDecal = textureLoader.load('imgs/texturaDCC.jpg', function ( ufjfDecal ) {  } );   
  rightDecal.material.map = dccDecal;


    return {leftWing, rightWing};
  }

  function createCockpit(cube, loadingManager){

    // create cockpit
    var cockpitGeometry = new THREE.CylinderGeometry(2.5, 2.5, 5,32);
    var cockpitMaterial = new THREE.MeshPhongMaterial({
      
      transparent:true,
      opacity: 0.33,
      depthTest: true,
      depthWrite: true,
      alphaTest: 0,
      visible: true,
      side: THREE.FrontSide,
      color:'rgb(92,86,92)',
      emissive:'#000000',
      specular:'#ffffff',
      shininess:57,
      flatShading:true,
      reflectivity:1,
      refractionRatio:1
    });
    var cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
    cockpit.castShadow = true;  
    cockpit.receiveShadow = true; 
    // add the cockpit to the scene
    cockpit.position.set(0, 0, 0);
    cube.add(cockpit);
  
    //add spheres to the cockpit
    var sphereGeometry = new THREE.SphereGeometry(2.5, 32, 32);
    var sphereMaterial = new THREE.MeshPhongMaterial({
      transparent:true,
      opacity: 0.33,
      depthTest: true,
      depthWrite: true,
      alphaTest: 0,
      visible: true,
      side: THREE.FrontSide,
      color:'rgb(92,86,92)',
      emissive:'#000000',
      specular:'#ffffff',
      shininess:57,
      flatShading:true,
      reflectivity:1,
      refractionRatio:1
    });
    
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    var sphere2 = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(0, 2.5, 0);
    sphere2.position.set(0, -2.5, 0);

    sphere.castShadow = true;  
    sphere.receiveShadow = true; 

    sphere2.castShadow = true;  
    sphere2.receiveShadow = true;

    cockpit.add(sphere);
    cockpit.add(sphere2);
  
    //inclinate cockpit
    cockpit.rotateX(degreesToRadians(5));
    return cockpit;
  }

  function createPropeller(cube, loadingManager){

    // create propellerBase
    var propellerBaseGeometry = new THREE.CylinderGeometry(0, 1.5, 5,32);
    var propellerBaseMaterial = new THREE.MeshPhongMaterial({
      color:'rgb(255,100,0)',
      specular:'#111111',
      shininess:57,
      flatShading:false,
      reflectivity:1,
      refractionRatio:1
    });
    var propellerBase = new THREE.Mesh(propellerBaseGeometry,propellerBaseMaterial);
    propellerBase.castShadow = true;  
    propellerBase.receiveShadow = true; 
  
    // add the propeller base to the scene
    propellerBase.position.set(0, 0, 0);
    cube.add(propellerBase);
  
    // create propellers
    var propellerGeometry = new THREE.CylinderGeometry(0.05, 0.2, 10,4);
    var propellerMaterial = new THREE.MeshPhongMaterial({
      color:'rgb(0,0,255)',
      specular:'#111111',
      shininess:57,
      flatShading:false,
      reflectivity:1,
      refractionRatio:1
    });
    var propeller1 = new THREE.Mesh(propellerGeometry, propellerMaterial);
    var propeller2 = new THREE.Mesh(propellerGeometry, propellerMaterial);
    var propeller3 = new THREE.Mesh(propellerGeometry, propellerMaterial);
  
    // position the propellers
    propeller1.position.set(-4.5, 0, -2.25);
    propeller1.rotateX(degreesToRadians(90));
    propeller1.rotateZ(degreesToRadians(120));
  
    propeller2.position.set(4.5, 0, -2.25);
    propeller2.rotateX(degreesToRadians(90));
    propeller2.rotateZ(degreesToRadians(240));
  
    propeller3.position.set(0, 0, 4.5);
    propeller3.rotateX(degreesToRadians(90));
    
    propeller1.castShadow = true;  
    propeller1.receiveShadow = true; 

    propeller2.castShadow = true;  
    propeller2.receiveShadow = true; 

    propeller3.castShadow = true;  
    propeller3.receiveShadow = true; 
    // add the propellers to the base
    propellerBase.add(propeller1);
    propellerBase.add(propeller2);
    propellerBase.add(propeller3);
  
    return propellerBase;
  
  }
 
  
  function createStabilizer(cube, loadingManager){
    //create vertical stabilizer shape
    
    let textureLoader2 = new THREE.TextureLoader(loadingManager); 
  let wall01 = textureLoader2.load('imgs/planePlate01.jpg', function ( wall01 ) {
    wall01.wrapS = wall01.wrapT = THREE.RepeatWrapping;
    wall01.offset.set( 0, 0);
    wall01.repeat.set( 0.6, 0.3 )
    wall01.rotation = 0;
  } ); 

    const vStabilizerShape = new THREE.Shape();
    vStabilizerShape.moveTo( 0,0 );
    vStabilizerShape.lineTo( 0, -3 );
    vStabilizerShape.lineTo( 8, -2.5 );
    vStabilizerShape.lineTo( 8, -1 );
    vStabilizerShape.lineTo (2, 2 );
    vStabilizerShape.lineTo ( 0, 8);
    vStabilizerShape.lineTo ( -3.5, -3);
    vStabilizerShape.lineTo ( 0, -3);
    vStabilizerShape.lineTo( 0, 0 );
  
    const vStabilizerExtrudeSettings = {
      steps: 1,
      depth: 1,
      bevelEnabled: true,
      bevelThickness: 0,
      bevelSize: 0,
      bevelOffset: 0,
      bevelSegments: 5
    };
  
    //create vertical stabilizer
    const vStabilizerGeometry = new THREE.ExtrudeGeometry( vStabilizerShape, vStabilizerExtrudeSettings);
    vStabilizerGeometry.rotateY(degreesToRadians(-90));
    const vStabilizerMaterial = new THREE.MeshPhongMaterial( {
      color:'rgb(255,100,0)',
      specular:'#111111',
      shininess:57,
      flatShading:false,
      reflectivity:1,
      refractionRatio:1
    });
    const stabilizer = new THREE.Mesh( vStabilizerGeometry, vStabilizerMaterial ) ;
  
    //add the stabilizer base to the scene
    stabilizer.castShadow = true;  
    stabilizer.receiveShadow = true; 

    stabilizer.rotateX(degreesToRadians(1))
    cube.add(stabilizer);
    
    stabilizer.material.map = wall01;

    //create horizontal stabilizer shape
    const hStabilizerShape = new THREE.Shape();
    hStabilizerShape.moveTo( 0,0 );
    hStabilizerShape.lineTo( 0, -3 );
    hStabilizerShape.lineTo( 10, -1 );
    hStabilizerShape.lineTo( 10, 0.5 );
    hStabilizerShape.lineTo ( 4, 1.5 );
    hStabilizerShape.lineTo ( 0, 3);
    hStabilizerShape.lineTo( 0, 0 );
  
    const hStabilizerExtrudeSettings = {
      steps: 1,
      depth: 1,
      bevelEnabled: true,
      bevelThickness: 0,
      bevelSize: 0,
      bevelOffset: 0,
      bevelSegments: 5
    };
  
  
    //create horizontal stabilizers
    const hStabilizerGeometry = new THREE.ExtrudeGeometry( hStabilizerShape, hStabilizerExtrudeSettings);
    hStabilizerGeometry.rotateX(degreesToRadians(180));
    const hStabilizerMaterial = new THREE.MeshPhongMaterial( {
      color:'rgb(255,100,0)',
      specular:'#111111',
      shininess:57,
      flatShading:false,
      reflectivity:1,
      refractionRatio:1
    } );
    const rightStabilizer = new THREE.Mesh(hStabilizerGeometry,hStabilizerMaterial);
    hStabilizerGeometry.translate(0,0,0.5); // match wing height; required due to rotation
    const leftStabilizer = new THREE.Mesh (hStabilizerGeometry,hStabilizerMaterial);
  
    rightStabilizer.material.map = wall01;
    leftStabilizer.material.map = wall01;

    //add the horizontal stbilizers to the stabilizer base
    leftStabilizer.rotateY(degreesToRadians(180));
    rightStabilizer.position.set(0,0.5, 1);
    leftStabilizer.position.set(-1,0.5, 1);

    leftStabilizer.castShadow = true;  
    leftStabilizer.receiveShadow = true; 

    rightStabilizer.castShadow = true;  
    rightStabilizer.receiveShadow = true; 
    stabilizer.add( rightStabilizer );
    stabilizer.add(leftStabilizer);
  
    return stabilizer;
  }
  
  
  function createAileron(loadingManager){
    // create first cube
    var aileronGeometry = new THREE.BoxGeometry(0.25, 1.5, 13.5);
    var aileronMaterial = new THREE.MeshPhongMaterial({
      color:'rgb(100,0,255)',
      specular:'#111111',
      shininess:57,
      flatShading:false,
      reflectivity:1,
      refractionRatio:1
    });
    aileronGeometry.rotateY(degreesToRadians(90));
  
  ;  var aileron = new THREE.Mesh(aileronGeometry, aileronMaterial);
  let textureLoader = new THREE.TextureLoader(loadingManager); 
  let wall01 = textureLoader.load('imgs/planePlate01.jpg', function ( wall01 ) {
    wall01.wrapS = wall01.wrapT = THREE.RepeatWrapping;
    wall01.offset.set( 0, 0);
    wall01.repeat.set( 8, 1 )
    wall01.rotation = 0;
  } ); 
  aileron.material.map = wall01;
    // position the first cube
    
    aileron.castShadow = true;  
    aileron.receiveShadow = true; 

    // add the fisrt cube to the scene
    return aileron;
  }
  

  function createElevator(loadingManager){
    // create first cube
    var elevatorGeometry = new THREE.BoxGeometry(0.25, 1.5, 6);
    var elevatorMaterial = new THREE.MeshPhongMaterial({
      color:'rgb(100,0,255)',
      specular:'#111111',
      shininess:57,
      flatShading:false,
      reflectivity:1,
      refractionRatio:1
    });
    elevatorGeometry.rotateY(degreesToRadians(90));
  
  ;  var elevator = new THREE.Mesh(elevatorGeometry, elevatorMaterial);
    // position the first cube
    
    elevator.castShadow = true;  
    elevator.receiveShadow = true; 
    let textureLoader = new THREE.TextureLoader(loadingManager); 
  let wall01 = textureLoader.load('imgs/planePlate01.jpg', function ( wall01 ) {
    wall01.wrapS = wall01.wrapT = THREE.RepeatWrapping;
    wall01.offset.set( 0, 0);
    wall01.repeat.set( 8, 1 )
    wall01.rotation = 0;
  } ); 
  elevator.material.map = wall01;
    // add the fisrt cube to the scene
    return elevator;
  }
  
  function createLandingGear(loadingManager){
    var lgearGeometry = new THREE.CylinderGeometry(0.5,0.5,8,32);
    var lgearMaterial = new THREE.MeshPhongMaterial({
      color:'rgb(100,0,255)',
      specular:'#111111',
      shininess:57,
      flatShading:false,
      reflectivity:1,
      refractionRatio:1
    });
    var lgear = new THREE.Mesh(lgearGeometry, lgearMaterial);
    //scene.add(lgear);
    lgear.castShadow = true;  
    lgear.receiveShadow = true; 

  
    var protectionGeometry = new THREE.CylinderGeometry(1.2,1.2,1.5,32,1,true,0,3)
    var protectionMaterial = new THREE.MeshPhongMaterial({
      color:'rgb(255,100,0)',
      specular:'#111111',
      shininess:57,
      flatShading:false,
      reflectivity:1,
      refractionRatio:1,
      side:THREE.DoubleSide
    });
  
    var protection = new THREE.Mesh(protectionGeometry, protectionMaterial);
    protection.rotateZ(degreesToRadians(90));
    protection.position.set(0,-4.75,0);

    protection.castShadow = true;  
    protection.receiveShadow = true; 

    lgear.add(protection);
  
    var wheelGeometry = new THREE.TorusGeometry(0.8,0.4, 32,32);
    var wheelMaterial = new THREE.MeshLambertMaterial({
      color:'rgb(30,30,30)',
      emissive:'#191414',
      reflectivity:1,
      refractionRatio:1,
      side:THREE.DoubleSide
    });
  
    var wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel.rotateY(degreesToRadians(90));
    wheel.position.set(0.45,-5,0);
    lgear.add(wheel);

    wheel.castShadow = true;  
    wheel.receiveShadow = true; 
  
    var wheel2 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel2.rotateY(degreesToRadians(90));
    wheel2.position.set(-0.45,-5,0);
    lgear.add(wheel2);

    wheel2.castShadow = true;  
    wheel2.receiveShadow = true; 
    
    let textureLoader = new THREE.TextureLoader(loadingManager); 
    let wall01 = textureLoader.load('imgs/wheel01.jpg', function ( wall01 ) {
      wall01.wrapS = wall01.wrapT = THREE.RepeatWrapping;
      wall01.offset.set( 0, 0);
      wall01.repeat.set( 8, 1 )
      wall01.rotation = 0;
    } ); 
    wheel.material.map = wall01;
    wheel2.material.map = wall01;

    lgear.rotateX(degreesToRadians(90));
    return lgear;
  }
  
  
export function airplaneAssembly (cube, inspection, loadingManager){

  var airplane = createFuselage(cube, loadingManager);
  var propeller = createPropeller(cube, loadingManager);
  propeller.position.set(0, 23.5, 0);
  airplane.add(propeller);

  var leftwing = createWings(loadingManager).leftWing;
  var rightwing = createWings(loadingManager).rightWing;
  leftwing.position.set(-4, 2, 0);
  leftwing.rotateY(degreesToRadians(7));
  rightwing.position.set(4, 2, 0);
  rightwing.rotateY(degreesToRadians(-7));

  var leftaileron = createAileron(loadingManager);
  var rightaileron = createAileron(loadingManager);
  leftaileron.position.set(13, -2.5, 0);
  leftaileron.rotateZ(degreesToRadians(9));
  leftwing.add(leftaileron);

  rightaileron.position.set(13, -2.5, 0);
  rightaileron.rotateZ(degreesToRadians(9));
  rightwing.add(rightaileron);
  airplane.add(leftwing);
  airplane.add(rightwing);

  var cockpit = createCockpit(cube, loadingManager);
  cockpit.position.set(0, 8, 5);
  airplane.add(cockpit);

  var stabilizer = createStabilizer(cube, loadingManager);
  stabilizer.position.set(0.5, -17.065, 3.5);
  airplane.add(stabilizer);

  var leftelevator = createElevator(loadingManager);
  var rightelevator = createElevator(loadingManager);
  leftelevator.rotateZ(degreesToRadians(-9));
  leftelevator.position.set(-8, -0.75, 1);
  stabilizer.add(leftelevator);

  rightelevator.rotateZ(degreesToRadians(9));
  rightelevator.position.set(7, -0.75, 1);
  stabilizer.add(rightelevator);

  var rudder = createElevator(loadingManager);
  rudder.rotateY(degreesToRadians(90));
  rudder.rotateZ(degreesToRadians(-2));
  rudder.position.set(-0.5, -3, 2.5);
  stabilizer.add(rudder);
  airplane.position.set(0, 0, 9.6);

  var frontLandingGear = createLandingGear(loadingManager);
  var leftLandingGear = createLandingGear(loadingManager);
  var rightLandingGear = createLandingGear(loadingManager);

  frontLandingGear.position.set(0, 8, -4);
  frontLandingGear.rotateX(degreesToRadians(15));
  airplane.add(frontLandingGear);

  leftLandingGear.position.set(-2, -8, -4);
  leftLandingGear.rotateX(degreesToRadians(-15));
  leftLandingGear.rotateZ(degreesToRadians(-15));
  airplane.add(leftLandingGear);

  rightLandingGear.position.set(2, -8, -4);
  rightLandingGear.rotateX(degreesToRadians(-15));
  rightLandingGear.rotateZ(degreesToRadians(15));
  airplane.add(rightLandingGear);

  airplane.rotateX(degreesToRadians(-90));
  airplane.rotateZ(degreesToRadians(180));
  airplane.translateY(50);

  if (inspection === true){
    
    airplane.visibile = false;
    airplane.position.set(0,0,0);
  }

  return ({airplane, propeller});
}
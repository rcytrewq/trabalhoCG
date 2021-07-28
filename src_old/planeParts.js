import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {initRenderer, 
        initCamera,       
        InfoBox,
        onWindowResize,
        degreesToRadians,
        initDefaultBasicLight} from "../libs/util/util.js";


export function createFuselage(cube){

    var fuselageMaterial = new THREE.MeshPhongMaterial({
      color:'rgb(100,0,255)',
      //emissive:'0x0',
      specular:'0x111111',
      shininess:57,
      flatShading:false,
      reflectivity:1,
      refractionRatio:1
    });
          
    // create fuselage body
    var fuselageBodyGeometry = new THREE.CylinderGeometry(5.5, 3.5, 22,32);
    var fuselage = new THREE.Mesh(fuselageBodyGeometry, fuselageMaterial);
  
    // add the fuselage body to the scene
    //fuselage.position.set(0, 0, 10);
    cube.add(fuselage);
  
    // create cockpit base
    var cockpitBaseGeometry = new THREE.CylinderGeometry(4.5, 5.5, 7,32);
    var cockpitBase = new THREE.Mesh(cockpitBaseGeometry, fuselageMaterial);
  
    // add the cockpit base to the fuselage
    cockpitBase.position.set(0, 14.5, 0);
    fuselage.add(cockpitBase);
  
    // create front fuselage
    var frontFuselageGeometry = new THREE.CylinderGeometry(1.5, 4.5, 3,32);
    var frontFuselage = new THREE.Mesh(frontFuselageGeometry, fuselageMaterial);
  
    // add the front to the fuselage
    frontFuselage.position.set(0, 19.5, 0);
    fuselage.add(frontFuselage);
  
    // create stabilizer base
    var stabilizerBaseGeometry = new THREE.CylinderGeometry(3.5, 2.0, 8,32);
    var stabilizerBase= new THREE.Mesh(stabilizerBaseGeometry, fuselageMaterial);
  
    // add the stabilizer base to the fuselage
    stabilizerBase.position.set(0.0, -15, 0);
    fuselage.add(stabilizerBase);
  
    // create fuselage back
    var fuselageBackGeometry = new THREE.CylinderGeometry(2.0, 0.5, 1,32);
    var fuselageBack= new THREE.Mesh(fuselageBackGeometry, fuselageMaterial);
  
    // add the back to the fuselage
    fuselageBack.position.set(0.0, -19.5, 0);
    fuselage.add(fuselageBack);
  
    // fuselage.translateX(50);
    return fuselage;
  }

  export function createWings(){

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
      //emissive:'0x0',
      specular:'0x111111',
      shininess:57,
      flatShading:false,
      reflectivity:1,
      refractionRatio:1
    } );
    const leftWing = new THREE.Mesh( wingGeometry, wingMaterial ) ;
    wingGeometry.translate(0,0,0.5); // match wing height; required due to rotation
    const rightWing = new THREE.Mesh (wingGeometry, wingMaterial);
    leftWing.rotateY(degreesToRadians(180));
  
    //add the wings to the scene
    leftWing.position.set(0, 0, 0);
    rightWing.position.set(0, 0, 0);
    leftWing.rotateZ(degreesToRadians(-4.7))
    rightWing.rotateZ(degreesToRadians(-4.7))
    
  
    return {leftWing, rightWing};
  }

  export function createCockpit(cube){

    // create cockpit
    var cockpitGeometry = new THREE.CylinderGeometry(2.5, 2.5, 5,32);
    var cockpitMaterial = new THREE.MeshPhongMaterial({
      color:'rgb(255,255,255)',
      //emissive:'0x0',
      specular:'0x111111',
      shininess:57,
      flatShading:true,
      reflectivity:1,
      refractionRatio:1
    });
    var cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
  
    // add the cockpit to the scene
    cockpit.position.set(0, 0, 0);
    cube.add(cockpit);
  
    //add spheres to the cockpit
    var sphereGeometry = new THREE.SphereGeometry(2.5, 32, 32);
    var sphereMaterial = new THREE.MeshPhongMaterial({
      color:'rgb(255,255,255)',
      //emissive:'0x0',
      specular:'0x111111',
      shininess:57,
      flatShading:true,
      reflectivity:1,
      refractionRatio:1
    });
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    var sphere2 = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(0, 2.5, 0);
    sphere2.position.set(0, -2.5, 0);
  
    cockpit.add(sphere);
    cockpit.add(sphere2);
  
    //inclinate cockpit
    cockpit.rotateX(degreesToRadians(5));
    return cockpit;
  }

  export function createPropeller(cube){

    // create propellerBase
    var propellerBaseGeometry = new THREE.CylinderGeometry(0, 1.5, 5,32);
    var propellerBaseMaterial = new THREE.MeshPhongMaterial({
      color:'rgb(255,100,0)',
      //emissive:'0x0',
      specular:'0x111111',
      shininess:57,
      flatShading:false,
      reflectivity:1,
      refractionRatio:1
    });
    var propellerBase = new THREE.Mesh(propellerBaseGeometry,propellerBaseMaterial);
  
  
    // add the propeller base to the scene
    propellerBase.position.set(0, 0, 0);
    cube.add(propellerBase);
  
    // create propellers
    var propellerGeometry = new THREE.CylinderGeometry(0.05, 0.2, 10,4);
    var propellerMaterial = new THREE.MeshPhongMaterial({
      color:'rgb(0,0,255)',
      //emissive:'0x0',
      specular:'0x111111',
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
  
    // add the propellers to the base
    propellerBase.add(propeller1);
    propellerBase.add(propeller2);
    propellerBase.add(propeller3);
  
    return propellerBase;
  
  }
 
  
  export function createStabilizer(cube){
    //create vertical stabilizer shape
  
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
      //emissive:'0x0',
      specular:'0x111111',
      shininess:57,
      flatShading:false,
      reflectivity:1,
      refractionRatio:1
    });
    const stabilizer = new THREE.Mesh( vStabilizerGeometry, vStabilizerMaterial ) ;
  
    //add the stabilizer base to the scene
  
    stabilizer.rotateX(degreesToRadians(1))
    cube.add(stabilizer);
  
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
      //emissive:'0x0',
      specular:'0x111111',
      shininess:57,
      flatShading:false,
      reflectivity:1,
      refractionRatio:1
    } );
    const rightStabilizer = new THREE.Mesh(hStabilizerGeometry,hStabilizerMaterial);
    hStabilizerGeometry.translate(0,0,0.5); // match wing height; required due to rotation
    const leftStabilizer = new THREE.Mesh (hStabilizerGeometry,hStabilizerMaterial);
  
    //add the horizontal stbilizers to the stabilizer base
    leftStabilizer.rotateY(degreesToRadians(180));
    rightStabilizer.position.set(0,0.5, 1);
    leftStabilizer.position.set(-1,0.5, 1);
    stabilizer.add( rightStabilizer );
    stabilizer.add(leftStabilizer);
  
    return stabilizer;
  }
  
  
  export function createAileron(){
    // create first cube
    var aileronGeometry = new THREE.BoxGeometry(0.25, 1.5, 13.5);
    var aileronMaterial = new THREE.MeshPhongMaterial({
      color:'rgb(100,0,255)',
      //emissive:'0x0',
      specular:'0x111111',
      shininess:57,
      flatShading:false,
      reflectivity:1,
      refractionRatio:1
    });
    aileronGeometry.rotateY(degreesToRadians(90));
  
  ;  var aileron = new THREE.Mesh(aileronGeometry, aileronMaterial);
    // position the first cube
    
    // add the fisrt cube to the scene
    return aileron;
  }
  

  export function createElevator(){
    // create first cube
    var elevatorGeometry = new THREE.BoxGeometry(0.25, 1.5, 6);
    var elevatorMaterial = new THREE.MeshPhongMaterial({
      color:'rgb(100,0,255)',
      //emissive:'0x0',
      specular:'0x111111',
      shininess:57,
      flatShading:false,
      reflectivity:1,
      refractionRatio:1
    });
    elevatorGeometry.rotateY(degreesToRadians(90));
  
  ;  var elevator = new THREE.Mesh(elevatorGeometry, elevatorMaterial);
    // position the first cube
    
    // add the fisrt cube to the scene
    return elevator;
  }
  
  export function createLandingGear(){
    var lgearGeometry = new THREE.CylinderGeometry(0.5,0.5,8,32);
    var lgearMaterial = new THREE.MeshPhongMaterial({
      color:'rgb(100,0,255)',
      //emissive:'0x0',
      specular:'0x111111',
      shininess:57,
      flatShading:false,
      reflectivity:1,
      refractionRatio:1
    });
    var lgear = new THREE.Mesh(lgearGeometry, lgearMaterial);
    //scene.add(lgear);
  
    var protectionGeometry = new THREE.CylinderGeometry(1.2,1.2,1.5,32,1,true,0,3)
    var protectionMaterial = new THREE.MeshBasicMaterial({
      color:'rgb(255,100,0)',
      //emissive:'0x0',
      specular:'0x111111',
      shininess:57,
      flatShading:false,
      reflectivity:1,
      refractionRatio:1,
      side:THREE.DoubleSide
    });
  
    var protection = new THREE.Mesh(protectionGeometry, protectionMaterial);
    protection.rotateZ(degreesToRadians(90));
    protection.position.set(0,-4.75,0);
    lgear.add(protection);
  
    var wheelGeometry = new THREE.CylinderGeometry(1,1,0.7,32,32)
    var wheelMaterial = new THREE.MeshBasicMaterial({
      color:'rgb(0,0,0)',
      //emissive:'0x0',
      specular:'0x111111',
      shininess:57,
      flatShading:true,
      reflectivity:1,
      refractionRatio:1,
      side:THREE.DoubleSide
    });
  
    var wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel.rotateZ(degreesToRadians(90));
    wheel.position.set(0.45,-5,0);
    lgear.add(wheel);
  
    var wheel2 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel2.rotateZ(degreesToRadians(90));
    wheel2.position.set(-0.45,-5,0);
    lgear.add(wheel2);
  
    lgear.rotateX(degreesToRadians(90));
    return lgear;
  }
  
  
import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {initRenderer, 
        initCamera,
        InfoBox,
        onWindowResize,
        degreesToRadians} from "../libs/util/util.js";

var stats = new Stats();          // To show FPS information
var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils


var camera = initCamera(new THREE.Vector3(-150, 150, 110)); // Init camera in this position
camera.up.set(0, 0, 1);
scene.background = new THREE.Color("rgb(0,0,0)");

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls( camera, renderer.domElement );

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 120 );
scene.add( axesHelper );

//LIGHTS
var light = new THREE.AmbientLight("rgb(255,255,255)", 0.5);
scene.add(light);

// create the ground plane
var planeGeometry = new THREE.PlaneGeometry(800, 800,50,50);
planeGeometry.translate(0.0, 0.0, -0.02); // To avoid conflict with the axeshelper
var planeMaterial = new THREE.MeshBasicMaterial({
    color: "rgba(0, 255, 0)",
    side: THREE.DoubleSide, wireframe:true
});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
// add the plane to the scene
scene.add(plane);


///////////////////////////////////////////////////////////////////////////////
////////////////////////////// CREATE COCKPIT /////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function createCockpit(){

  // create cockpit
  var cockpitGeometry = new THREE.CylinderGeometry(2.5, 2.5, 5,32);
  var cockpitMaterial = new THREE.MeshNormalMaterial({wireframe:false});
  var cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);

  // add the cockpit to the scene
  cockpit.position.set(0, 0, 0);
  scene.add(cockpit);

  //add spheres to the cockpit
  var sphereGeometry = new THREE.SphereGeometry(2.5, 32, 32);
  var sphereMaterial = new THREE.MeshNormalMaterial();
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

///////////////////////////////////////////////////////////////////////////////
////////////////////////////// CREATE PROPELLER ///////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function createPropeller(){

  // create propellerBase
  var propellerBaseGeometry = new THREE.CylinderGeometry(0, 1.5, 5,32);
  var propellerBaseMaterial = new THREE.MeshNormalMaterial({wireframe:false});
  var propellerBase = new THREE.Mesh(propellerBaseGeometry,propellerBaseMaterial);


  // add the propeller base to the scene
  propellerBase.position.set(0, 0, 0);
  scene.add(propellerBase);

  // create propellers
  var propellerGeometry = new THREE.CylinderGeometry(0.05, 0.2, 10,4);
  var propellerMaterial = new THREE.MeshNormalMaterial({wireframe:false});
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
///////////////////////////////////////////////////////////////////////////////
/////////////////////////////// CREATE FUSELAGE ///////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function createFuselage(){

  var fuselageMaterial = new THREE.MeshNormalMaterial();
        
  // create fuselage body
  var fuselageBodyGeometry = new THREE.CylinderGeometry(5.5, 3.5, 22,32);
  var fuselage = new THREE.Mesh(fuselageBodyGeometry, fuselageMaterial);

  // add the fuselage body to the scene
  fuselage.position.set(0, -24, 10);
  scene.add(fuselage);

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

  fuselage.position.set(0,0,0);
  return fuselage;
}

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// CREATE WINGS / ///////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function createWings(){

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
  const wingMaterial = new THREE.MeshNormalMaterial( { wireframe:false, color: "rgb(255,0,0)"} );
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

///////////////////////////////////////////////////////////////////////////////
///////////////////////////// CREATE STABILIZER ///////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function createStabilizer(){
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
  const vStabilizerMaterial = new THREE.MeshNormalMaterial( { wireframe:false} );
  const stabilizer = new THREE.Mesh( vStabilizerGeometry, vStabilizerMaterial ) ;

  //add the stabilizer base to the scene

  stabilizer.rotateX(degreesToRadians(1))
  scene.add(stabilizer);

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
  const hStabilizerMaterial = new THREE.MeshNormalMaterial( { wireframe: false, color: "rgb(255,0,0)"} );
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

///////////////////////////////////////////////////////////////////////////////
///////////////////////////// CREATE STABILIZER ///////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function createFlaps(){
  // create first cube
  var cubeGeometry = new THREE.BoxGeometry(0.5, 1.5, 18);
  var cubeMaterial = new THREE.MeshNormalMaterial();
  cubeGeometry.rotateY(degreesToRadians(90));

;  var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  // position the first cube
  cube.position.set(-14.0, -1.5, 51.25);
  cube.rotateY(degreesToRadians(7));
  cube.rotateZ(degreesToRadians(-3.5));
  // add the fisrt cube to the scene
  return cube;
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////// AIRPLANE ASSEMBLY ///////////////////////////////
///////////////////////////////////////////////////////////////////////////////

var airplane = createFuselage();
var propeller = createPropeller();
propeller.position.set(0,23.5,0);
airplane.add(propeller);
var leftwing = createWings().leftWing;
var rightwing = createWings().rightWing;
leftwing.position.set(-4,2,0);
leftwing.rotateY(degreesToRadians(7));
rightwing.position.set(4,2,0);
rightwing.rotateY(degreesToRadians(-7));
airplane.add(leftwing);
airplane.add(rightwing);
var cockpit = createCockpit();
cockpit.position.set(0,8,5);
airplane.add(cockpit);
var stabilizer = createStabilizer();
stabilizer.position.set(0.5,-17.065,3.5)
airplane.add(stabilizer);
var flap = createFlaps();
scene.add(flap);
airplane.position.set(0,0,50);


var angle = 0;
var speed = 0.15;
var animation = true;

function rotatePropeller(){
  propeller.matrixAutoUpdate = false;
  propeller.matrix.identity();
  ; 
  if (animation){
    angle += speed;
    var mat4 = new THREE.Matrix4();
    
    
    propeller.matrix.multiply(mat4.makeTranslation(0.0, 23.5, 0.0))
    propeller.matrix.multiply(mat4.makeRotationY(-angle)); // R1
    //propeller.matrix.multiply(mat4.makeTranslation(0.0, 1.0, 0.0)); // T1
  }
}

// Use this to show information onscreen
var controls = new InfoBox();
  controls.add("Basic Scene");
  controls.addParagraph();
  controls.add("Use mouse to interact:");
  controls.add("* Left button to rotate");
  controls.add("* Right button to translate (pan)");
  controls.add("* Scroll to zoom in/out.");
  controls.show();

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

render();
function render()
{
  stats.update(); // Update FPS
  trackballControls.update(); // Enable mouse movements
  rotatePropeller();
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}
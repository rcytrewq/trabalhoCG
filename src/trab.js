import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {initRenderer, 
        initCamera,       
        InfoBox,
        onWindowResize,
        degreesToRadians,
        initDefaultBasicLight,
        createGroundPlaneWired} from "../libs/util/util.js";
import {createFuselage,
        createWings,
        createCockpit,
        createPropeller,
        createStabilizer,
        createAileron,
        createLandingGear, 
        createElevator} from "./planeParts.js";
import {rotatePropeller,
        keyboardUpdate} from "./animations.js"

var stats = new Stats();          // To show FPS information
var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils

  

//main camera
var camera = initCamera(new THREE.Vector3(-110, 0, 160)); // Init camera in this position
camera.up.set(0, 0, 1);
scene.background = new THREE.Color("rgb(255,255,255)");

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls( camera, renderer.domElement );

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 120 );
scene.add( axesHelper );

//lights
initDefaultBasicLight(scene);

// create the ground plane
var plane = createGroundPlaneWired(800,800, 10, 10, "rgb(0,100,0)");
plane.rotateX(degreesToRadians(90));
scene.add(plane);


///////////////////////////////////////////////////////////////////////////////
///////////////////////////// AIRPLANE ASSEMBLY ///////////////////////////////
///////////////////////////////////////////////////////////////////////////////

var airplane = createFuselage(scene);
var propeller = createPropeller(scene);
propeller.position.set(0,23.5,0);
airplane.add(propeller);

var leftwing = createWings().leftWing;
var rightwing = createWings().rightWing;
leftwing.position.set(-4,2,0);
leftwing.rotateY(degreesToRadians(7));
rightwing.position.set(4,2,0);
rightwing.rotateY(degreesToRadians(-7));

var leftaileron = createAileron();
var rightaileron = createAileron();
leftaileron.position.set(13,-2.5,0)
leftaileron.rotateZ(degreesToRadians(9));
leftwing.add(leftaileron);

rightaileron.position.set(13,-2.5,0)
rightaileron.rotateZ(degreesToRadians(9));
rightwing.add(rightaileron);
airplane.add(leftwing);
airplane.add(rightwing);

var cockpit = createCockpit(scene);
cockpit.position.set(0,8,5);
airplane.add(cockpit);

var stabilizer = createStabilizer(scene);
stabilizer.position.set(0.5,-17.065,3.5)
airplane.add(stabilizer);

var leftelevator = createElevator();
var rightelevator = createElevator();
leftelevator.rotateZ(degreesToRadians(-9));
leftelevator.position.set(-8,-0.75,1);
stabilizer.add(leftelevator);

rightelevator.rotateZ(degreesToRadians(9));
rightelevator.position.set(7,-0.75,1);
stabilizer.add(rightelevator);

var rudder = createElevator();
rudder.rotateY(degreesToRadians(90));
rudder.rotateZ(degreesToRadians(-2));
rudder.position.set(-0.5,-3,2.5);
stabilizer.add(rudder);
airplane.position.set(0,0,50);

var frontLandingGear = createLandingGear();
var leftLandingGear = createLandingGear();
var rightLandingGear = createLandingGear();

frontLandingGear.position.set(0,8,-4);
frontLandingGear.rotateX(degreesToRadians(15));
airplane.add(frontLandingGear);

leftLandingGear.position.set(-2,-8,-4);
leftLandingGear.rotateX(degreesToRadians(-15));
leftLandingGear.rotateZ(degreesToRadians(-15));
airplane.add(leftLandingGear);

rightLandingGear.position.set(2,-8,-4);
rightLandingGear.rotateX(degreesToRadians(-15));
rightLandingGear.rotateZ(degreesToRadians(15));
airplane.add(rightLandingGear);




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
  rotatePropeller(propeller);
  keyboardUpdate(airplane, leftelevator, rightelevator, leftaileron, rightaileron, rudder);
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}
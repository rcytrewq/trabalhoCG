import * as THREE from "../build/three.module.js";
import Stats from "../build/jsm/libs/stats.module.js";
import { TrackballControls } from "../build/jsm/controls/TrackballControls.js";
import KeyboardState from "../libs/util/KeyboardState.js";
import {
  initRenderer,
  initCamera,
  InfoBox,
  onWindowResize,
  degreesToRadians,
  radiansToDegrees,
  initDefaultBasicLight,
  createGroundPlaneWired,
  InfoBox2,
} from "../libs/util/util.js";
import {
  createFuselage,
  createWings,
  createCockpit,
  createPropeller,
  createStabilizer,
  createAileron,
  createLandingGear,
  createElevator,
} from "./planeParts.js";
import { rotatePropeller, keyboardUpdate, movement } from "./animations.js";
// To use the keyboard
var keyboard = new KeyboardState();

var planePosition = new THREE.Vector3(0, 0, 9.6);

var stats = new Stats(); // To show FPS information
var scene = new THREE.Scene(); // Create main scene
var renderer = initRenderer(); // View function in util/utils
var simulationMode = false;



//main camera
var camera = initCamera(new THREE.Vector3(-250, 0, 100)); // Init camera in this position
camera.up.set(0, 0, 1);
//scene.background = new THREE.Color("rgb(255,255,255)");

//inspection camera
var inspectionCamera = initCamera(new THREE.Vector3(0, 0, 0)); // Init camera in this position
inspectionCamera.up.set(1, 0, 0);

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls(
  inspectionCamera,
  renderer.domElement
);




// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper(120);
scene.add(axesHelper);

//lights
initDefaultBasicLight(scene);

// create the ground plane
var plane = createGroundPlaneWired(4500, 4500, 100, 100, "rgb(0,100,0)");
plane.rotateX(degreesToRadians(90));
scene.add(plane);

// Use TextureLoader to load texture files
var textureLoader = new THREE.TextureLoader();
var grass = textureLoader.load("../assets/textures/grass.jpg");

plane.material.map = grass;


// create first cube
var cubeGeometry = new THREE.BoxGeometry(100, 100, 100);
var cubeMaterial = new THREE.MeshBasicMaterial({wireframe:true});
var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
// position the first cube
cube.position.set(0.0, 0.0, 1.5);
// add the fisrt cube to the scene
scene.add(cube);

cube.add(inspectionCamera);
inspectionCamera.translateZ(100);
inspectionCamera.translateY(-50);
// cube.translateY(-500);
// camera.translateZ(-50);

///////////////////////////////////////////////////////////////////////////////
///////////////////////////// AIRPLANE ASSEMBLY ///////////////////////////////
///////////////////////////////////////////////////////////////////////////////

var airplane = createFuselage(cube);
var propeller = createPropeller(cube);
propeller.position.set(0, 23.5, 0);
airplane.add(propeller);

var leftwing = createWings().leftWing;
var rightwing = createWings().rightWing;
leftwing.position.set(-4, 2, 0);
leftwing.rotateY(degreesToRadians(7));
rightwing.position.set(4, 2, 0);
rightwing.rotateY(degreesToRadians(-7));

var leftaileron = createAileron();
var rightaileron = createAileron();
leftaileron.position.set(13, -2.5, 0);
leftaileron.rotateZ(degreesToRadians(9));
leftwing.add(leftaileron);

rightaileron.position.set(13, -2.5, 0);
rightaileron.rotateZ(degreesToRadians(9));
rightwing.add(rightaileron);
airplane.add(leftwing);
airplane.add(rightwing);

var cockpit = createCockpit(cube);
cockpit.position.set(0, 8, 5);
airplane.add(cockpit);

var stabilizer = createStabilizer(cube);
stabilizer.position.set(0.5, -17.065, 3.5);
airplane.add(stabilizer);

var leftelevator = createElevator();
var rightelevator = createElevator();
leftelevator.rotateZ(degreesToRadians(-9));
leftelevator.position.set(-8, -0.75, 1);
stabilizer.add(leftelevator);

rightelevator.rotateZ(degreesToRadians(9));
rightelevator.position.set(7, -0.75, 1);
stabilizer.add(rightelevator);

var rudder = createElevator();
rudder.rotateY(degreesToRadians(90));
rudder.rotateZ(degreesToRadians(-2));
rudder.position.set(-0.5, -3, 2.5);
stabilizer.add(rudder);
airplane.position.set(0, 0, 9.6);

var frontLandingGear = createLandingGear();
var leftLandingGear = createLandingGear();
var rightLandingGear = createLandingGear();

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

airplane.rotateZ(degreesToRadians(-90));

airplane.translateY(50);
airplane.translateZ(-50);
cube.translateZ(50);

var virtualCameraWidth = 400;
var virtualCameraHeidth = 300;
var virtualCameraSimulation = new THREE.PerspectiveCamera(
  60,
  virtualCameraWidth / virtualCameraHeidth,
  1.0,
  50.0
);

scene.add(virtualCameraSimulation);
// virtualCameraSimulation.position.set(
//   1000,1000,1000
// );
//virtualCameraSimulation.lookAt(airplane.position);



// Enable mouse rotation, pan, zoom etc.
var trackballControls2 = new TrackballControls(
  virtualCameraSimulation,
  renderer.domElement
);

//-------------------------------------------------------------------------------
// Setting virtual camera
//-------------------------------------------------------------------------------
var lookAtVec = new THREE.Vector3( 0.0, 50.0, 0.0 );
var upVec = new THREE.Vector3( 0.0, 1.0, 0.0 );
var vcWidth = 400; // virtual camera width
var vcHeidth = 300; // virtual camera height
var virtualCamera = new THREE.PerspectiveCamera(45, vcWidth/vcHeidth, 1.0, 250.0);
virtualCamera.lookAt(lookAtVec);
virtualCamera.position.set(0,50,-250);
  
virtualCamera.up = upVec;

// Create helper for the virtual camera
const cameraHelper = new THREE.CameraHelper(virtualCamera);
scene.add(cameraHelper);

updateCamera();
render();

function updateCamera(){
  //-- Update virtual camera position --
  virtualCamera.lookAt(lookAtVec);        // Update camera position
  virtualCamera.updateProjectionMatrix(); // Necessary when updating FOV angle         
  cameraHelper.update();    

}


// Use this to show information onscreen
var instructions = new InfoBox();
instructions.add("Commands");
instructions.addParagraph();
instructions.add("Inspection Mode:");
instructions.add("* Left button to rotate");
instructions.add("* Right button to translate (pan)");
instructions.add("* Scroll to zoom in/out.");
instructions.addParagraph();
instructions.add("Simulation Mode:");
instructions.add("* q / a : accelerate/decelerate");
instructions.add("* ← / → : roll");
instructions.add("* ↓ / ↑ : pitch");
instructions.addParagraph();

instructions.add("Press space to enable/disable simulation mode");
instructions.addParagraph();
instructions.show();

// Listen window size changes
window.addEventListener(
  "resize",
  function () {
    onWindowResize(camera, renderer);
  },
  false
);

render();

// function renderSimulation() {
//   var width = window.innerWidth;
//   var height = window.innerHeight;
//   plane.visible = true;
//   // Set simulation mode camera
//   renderer.setViewport(0, 0, width, height); // Set virtual camera viewport
//   renderer.setClearColor("rgb(0, 50, 150)"); // Use a darker clear color in the small viewport
//   renderer.clear(); // Clean the small viewport
//   renderer.render(scene, virtualCameraSimulation); // Render scene of the virtual camera
// }

// function switchCamera() {
//   keyboard.update();
//   if (keyboard.down("space")) {
//     planePosition = airplane.getWorldPosition();
//     simulationMode = !simulationMode;
//     airplane.position.set(planePosition.x, planePosition.y, planePosition.z);
//     axesHelper.position.set(planePosition.x, planePosition.y, planePosition.z);
//     inspectionCamera.position.set(
//       airplane.position.x*1.5,
//       airplane.position.y,
//       airplane.position.z*1.5
//     );
//     inspectionCamera.lookAt(airplane.position);
//   }
// }

function render() {
  renderSimulationMode();
  //switchCamera();
  //simulationMode ? renderSimulationMode() : renderInspectionMode();
}

// function renderInspectionMode() {
//   scene.background = new THREE.Color("rgb(220,220,220)");
//   renderer.clear(); // Clean the small viewport
  
//   stats.update(); // Update FPS
//   rotatePropeller(propeller);
//   instructions.show();
//   var width = window.innerWidth;
//   var height = window.innerHeight;
//   trackballControls.update(); // Enable mouse movements
//   plane.visible = false;
//   axesHelper.visible = true;
    
//   // Set inspection mode camera
//   renderer.setViewport(0, 0, width, height); // Set virtual camera viewport

//   requestAnimationFrame(render);
//   renderer.render(scene, inspectionCamera); // Render scene of the virtual camera
// }


function renderSimulationMode() {
  var infoOnScreen = new InfoBox2();
  
  scene.background = new THREE.Color("rgb(0,10,255)");
  
  renderer.clear();
  trackballControls.update();
  plane.visible = true;
  axesHelper.visible = false;
  //camera.lookAt(airplane.position);
  stats.update(); // Update FPS
  rotatePropeller(propeller);
  
  speedOnScreen = keyboardUpdate(
    airplane,
    leftelevator,
    rightelevator,
    leftaileron,
    rightaileron,
    rudder,
    camera
  ).speedOnScreen;

  rollAngle = keyboardUpdate(
    airplane,
    leftelevator,
    rightelevator,
    leftaileron,
    rightaileron,
    rudder,
    camera
  ).rollAngle;

  pitchAngle = keyboardUpdate(
    airplane,
    leftelevator,
    rightelevator,
    leftaileron,
    rightaileron,
    rudder,
    camera
  ).pitchAngle;

  altitude = keyboardUpdate(
    airplane,
    leftelevator,
    rightelevator,
    leftaileron,
    rightaileron,
    rudder,
    camera
  ).altitude;
  console.log("Chama movement");
  movement(
    airplane,
    leftelevator,
    rightelevator,
    leftaileron,
    rightaileron,
    rudder,
    camera,
    cube
  );

  

  infoOnScreen.add("Speed: " + speedOnScreen + " kt");
  infoOnScreen.add(
    "Roll Angle: " + radiansToDegrees(rollAngle).toFixed(2) + "º"
  );
  infoOnScreen.add(
    "Pitch Angle: " + radiansToDegrees(pitchAngle.toFixed(2)) + "º"
  );
  infoOnScreen.add("Altitude: " + altitude.toFixed(2) + "ft");
  infoOnScreen.show();
  

  camera.position.set(
    airplane.position.x - 100,
    airplane.position.y,
    airplane.position.z + 20
  );
  camera.lookAt(airplane.position);

  requestAnimationFrame(render);
  var offset = 20; 
  renderer.setViewport(5, 600, 400, 300);  // Set virtual camera viewport  
  renderer.setScissor(5, 600, 400, 300); // Set scissor with the same size as the viewport
  renderer.setScissorTest(true); // Enable scissor to paint only the scissor are (i.e., the small viewport)
  renderer.setClearColor("rgb(60, 50, 150)");  // Use a darker clear color in the small viewport 
  renderer.clear(); // Clean the small viewport
  renderer.render(scene,virtualCameraSimulation);  // Render scene of the virtual camera
  

  var offset = 20; 
  renderer.setViewport(5, 600, 400, 300);  // Set virtual camera viewport  
  renderer.setScissor(5, 600, 400, 300); // Set scissor with the same size as the viewport
  renderer.setScissorTest(true); // Enable scissor to paint only the scissor are (i.e., the small viewport)
  renderer.setClearColor("rgb(60, 50, 150)");  // Use a darker clear color in the small viewport 
  renderer.clear(); // Clean the small viewport
  renderer.render(scene,inspectionCamera);  // Render scene of the virtual camera

}
import * as THREE from "../build/three.module.js";
import Stats from "../build/jsm/libs/stats.module.js";
import { TrackballControls } from "../build/jsm/controls/TrackballControls.js";
import {GLTFLoader} from '../build/jsm/loaders/GLTFLoader.js';
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
  createLightSphere,
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
  airplaneAssembly
} from "./planeParts.js";
import { rotatePropeller, keyboardUpdate, movement } from "./animations.js";
import {loadCactusRandom,
        loadMountains,
        loadBasePlane } from "./ambient.js";
import {createSimulationCamera,
        createCockpitCamera,
        createInspectionCamera} from "./cameras.js";
import { createSun } from "./lighting.js";
import {renderSimulation,
        renderInspection,
        renderSimulationCockpit,
        initParameters } from "./rendering.js";
import { createPath } from "./path.js";


/********************
        SCENE
*********************/
var stats = new Stats(); // To show FPS information

// Create main scene
var scene = new THREE.Scene();    // Create main scene
scene.background = new THREE.Color('rgb(10,10,50)');

// Create main scene
var sceneInsp = new THREE.Scene();    // Create main scene
sceneInsp.background = new THREE.Color('rgb(100,100,100)');

// Map size
var mapSize = 70000;

// To use the keyboard
var keyboard2 = new KeyboardState();

var simulationMode = true; // Alterna entre os modos de simulação e inspeção
var cockpitMode = false; // Ativa e desativa o modo cockpit



///////////////////////////////////////////////////////////////////////////////
 //                  RENDER SETTINGS
///////////////////////////////////////////////////////////////////////////////

var renderer = initRenderer(); 
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.antialias = true;


///////////////////////////////////////////////////////////////////////////////
//  INSPECTION CAMERA SETTINGS
///////////////////////////////////////////////////////////////////////////////

var inspectionCamera = createInspectionCamera();


// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls(inspectionCamera, renderer.domElement );

// Show world axes
var axesHelper = new THREE.AxesHelper( 1000000 );
scene.add( axesHelper );
sceneInsp.add(axesHelper);

///////////////////////////////////////////////////////////////////////////////
// create auxiliar cube
///////////////////////////////////////////////////////////////////////////////

var cubeGeometry = new THREE.BoxGeometry(1000, 1000, 1000);
var cubeMaterial = new THREE.MeshBasicMaterial({wireframe:false, transparent:true, opacity:0.0});
var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(0.0, 1000, 0);
scene.add(cube);


///////////////////////////////////////////////////////////////////////////////
///////////////////////////// AIRPLANE ASSEMBLY ///////////////////////////////
///////////////////////////////////////////////////////////////////////////////


//var parts = airplaneAssembly(cube);
var assembledAirplane = airplaneAssembly(cube, false);
//var propeller = parts.propeller;
var assembledAirplaneInspection = airplaneAssembly(sceneInsp, true);

var simulationCamera = createSimulationCamera(mapSize);
var cockpitCamera = createCockpitCamera(mapSize);
cube.add(simulationCamera);
assembledAirplane.airplane.add(cockpitCamera);


///////////////////////////////////////////////////////////////////////////////
// reescale objects
///////////////////////////////////////////////////////////////////////////////

cube.scale.set(200,200,200);
cube.translateY(1850);
cube.position.set(1.1*mapSize, cube.position.y, -1.35*mapSize);

createPath(scene, mapSize);
var clock = new THREE.Clock(false);
var currentCheckpoint = 0;
///////////////////////////////////////////////////////////////////////////////
// check if the plane crossed the checkpoint 
///////////////////////////////////////////////////////////////////////////////




/********************
  BASE PLANE PLACEMENT
*********************/

loadBasePlane(mapSize, scene);

/********************
  MOUNTAIN PLACEMENT
*********************/

loadMountains(mapSize,scene);

/********************
  RANDOM TREE PLACEMENT
*********************/

var numTrees = 150;
loadCactusRandom(numTrees,mapSize, scene);

/********************
  RENDERING
*********************/

//updateCamera();
render();

/********************
  LIGHTING
*********************/
createSun(scene, mapSize);
initDefaultBasicLight(sceneInsp);
/********************
  CAMERA AND RENDERING
*********************/

function keyboardCommands(){
  keyboard2.update();
  
  if (keyboard2.down("C") && simulationMode){
    cockpitMode = !cockpitMode;
    
  }
  if (keyboard2.down("enter") && simulationMode){
    curveObject.visible = !curveObject.visible;
    
  }
  if (keyboard2.down("space")){
    inspectionCamera.lookAt(0, 0, 0.2);
    inspectionCamera.position.set(-10000,10000,200)
    inspectionCamera.up.set( 0,1, 0, );
    simulationMode = !simulationMode;
    
  }
  
}

function render()
{
  let parameters = {"clock": clock,
                    "assembledAirplane":  assembledAirplane, "assembledAirplaneInspection": assembledAirplaneInspection,
                    "renderer": renderer,
                    "stats": stats,
                    "scene": scene,
                    "axesHelper": axesHelper,
                    "currentCheckpoint": currentCheckpoint,
                    "trackballControls": trackballControls,
                    "simulationCamera": simulationCamera,
                    "inspectionCamera": inspectionCamera,
                    "cockpitCamera": cockpitCamera,
                    "cube": cube,
                    "sceneInsp": sceneInsp,
                    "render": render
                  };
  initParameters(parameters);
  keyboardCommands();
  if (simulationMode) {
    cockpitMode ? renderSimulationCockpit() : renderSimulation();
  } else {
    renderInspection();
  }
}
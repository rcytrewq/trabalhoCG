import * as THREE from "../build/three.module.js";
import Stats from "../build/jsm/libs/stats.module.js";
import KeyboardState from "../libs/util/KeyboardState.js";
import {
  initRenderer,
  initDefaultBasicLight,
  InfoBox,
  createGroundPlane,
  degreesToRadians} from "../libs/util/util.js";
import {airplaneAssembly} from "./planeParts.js";
import { createSun, setLights } from "./lighting.js";
import {renderSimulation,
        renderInspection,
        renderSimulationCockpit,
        initParameters,
        renderLoadingScreen,} from "./rendering.js";
import { createPath } from "./path.js";
import { cityGround, createSkybox, positionBuildings, positionFactory, positionSidewalks } from "./city.js";
import { createExternalGround,
         positionRoads,
        loadCactusRandom } from "./externalAmbient.js"; 
import { TrackballControls } from "../build/jsm/controls/TrackballControls.js";

/********************
        SCENE
*********************/

// To show FPS information
var stats = new Stats(); 

// Create main scene
var scene = new THREE.Scene();    
// scene.background = new THREE.Color('rgb(10,10,50)');

// Create main scene
var sceneInsp = new THREE.Scene();    // Create main scene
sceneInsp.background = new THREE.Color('rgb(0,0,0)');
var ground = createGroundPlane(100,100, color = "rgb(244,244,244)");
ground.rotateX(degreesToRadians(90));
sceneInsp.add(ground);

// Create loading scene
var loadingScene = new THREE.Scene();    // Create main scene
loadingScene.background = new THREE.Color('rgb(0,0,0)');
// Map size
var mapSize = 50000;
var citySize = 1000;

// To use the keyboard
var keyboard2 = new KeyboardState();

var simulationMode = false; // switch simulation/inspection modes 
var cockpitMode = false; // Turn on/off cockpit mode
var loading = true;

var music = false;
///////////////////////////////////////////////////////////////////////////////
 //                  RENDER SETTINGS
///////////////////////////////////////////////////////////////////////////////
var renderer = initRenderer(); 
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.antialias = true;


var info = new InfoBox();
info.add("CONTROLS");
info.addParagraph();
info.add("← ↑ ↓ → : Controls the airplane");
info.add("Q : speed up");
info.add("A : speed down");
info.addParagraph();
info.add("space : inspection mode on/off");
info.add("C : cockpit mode on/off");
info.add("enter : path on/off");
info.addParagraph();
info.add("mouse : rotation, pan, zoom on inspection mode");
info.addParagraph();
info.add("H : show/hide tips");
info.show();

const infoBox = document.getElementById("InfoxBox");
infoBox.style.display = "none";
/**************************************************************************** */

var vcWidth = 400; // virtual camera width
var vcHeidth = 300; // virtual camera height 

var lookAtVec1 = new THREE.Vector3( 0.0, 0.0, 1.0 );
var upVec1 = new THREE.Vector3( 0.0, 0.0, 1.0 );

var simulationCamera = new THREE.PerspectiveCamera(45, vcWidth/vcHeidth, 1.0, mapSize*10);
simulationCamera.lookAt(lookAtVec1);
simulationCamera.position.set(0,20 ,-50);    
simulationCamera.up = upVec1;


var lookAtVec2 = new THREE.Vector3( 0,10,0 );
var upVec2 = new THREE.Vector3( 0.0, 1.0, 1.0 );
var cockpitCamera = new THREE.PerspectiveCamera(45, vcWidth/vcHeidth, 1.0, mapSize*10);
cockpitCamera.lookAt(lookAtVec2);
cockpitCamera.position.set(0,-5 ,10);
cockpitCamera.up = upVec2;



var auxiliarCamera = new THREE.PerspectiveCamera(45, vcWidth/vcHeidth, 0.1, 10000000);
auxiliarCamera.lookAt(0, 0, 0.2);
auxiliarCamera.position.set(60,30,-60);
auxiliarCamera.up.set(0, 1, 0);
/**************************************************************************** */

///////////////////////////////////////////////////////////////////////////////
//  INSPECTION CAMERA SETTINGS
///////////////////////////////////////////////////////////////////////////////

var lookAtVec_ = new THREE.Vector3( 0, 0, 0.2);
  var upVec_ = new THREE.Vector3( 0, 1, 0 );
  

  var inspectionCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000000);
  inspectionCamera.lookAt( lookAtVec_);
  inspectionCamera.up.set(upVec_);
  inspectionCamera.position.set(-10000,10000,200)

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls(auxiliarCamera, renderer.domElement );

// Show world axes
var axesHelper = new THREE.AxesHelper( 1000000 );
scene.add( axesHelper );
sceneInsp.add(axesHelper);

/////////////////////////////////////////////////////////////////////
var listener = new THREE.AudioListener();
simulationCamera.add( listener );

const soundCp = new THREE.Audio( listener );  
const soundFinish = new THREE.Audio( listener );  
const soundPlane = new THREE.Audio( listener ); 
const soundGame = new THREE.Audio( listener ); 


///////////////////////////////////////////////////////////////////////////////
// create auxiliar cube
///////////////////////////////////////////////////////////////////////////////

var cubeGeometry = new THREE.BoxGeometry(1000, 1000, 1000);
var cubeMaterial = new THREE.MeshBasicMaterial({wireframe:false, transparent:true, opacity:0.0});
var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(0.0, 0, 0);
scene.add(cube);

///////////////////////////////////////////////////////////////////////////////
// reescale objects
///////////////////////////////////////////////////////////////////////////////

cube.scale.set(0.5,0.5,0.5);
cube.translateY(1850);
cube.position.set(0, 6, -500);

var path = createPath(scene);
scene.add(path);
var clock = new THREE.Clock(false);
var currentCheckpoint = 0;
///////////////////////////////////////////////////////////////////////////////
// check if the plane crossed the checkpoint 
///////////////////////////////////////////////////////////////////////////////


function init() {
  const loaderScreen = document.querySelector(".score"); 
  const loadingManager = new THREE.LoadingManager();

  loadingManager.onProgress = function (url, itemsLoaded, itemsTotal ) {
    loaderScreen.innerHTML = ("<section id=\"loading-screen\">\n<div id=\"loader\"></div>\n<div class=\"title\">\n\nLoading\n" + itemsLoaded + " of  550  files. </div>\n</section>");
  };
	
	loadingManager.onLoad = function ( ) {
    loaderScreen.innerHTML = ("<section id=\"loading-screen\">\n<div id=\"loader\"></div>\n<div class=\"title\">\n\nPress ENTER to continue!</div>\n</section>");
	};
	

window.assembledAirplane = airplaneAssembly(cube, false, loadingManager);
window.assembledAirplaneInspection = airplaneAssembly(sceneInsp, true, loadingManager);

cube.add(simulationCamera);
assembledAirplane.airplane.add(cockpitCamera);

/********************
  RENDERING
*********************/
cityGround(scene, loadingManager);
createSkybox(mapSize, 'yonder', scene, loadingManager);
positionSidewalks(scene, loadingManager);
positionBuildings(scene, loadingManager);
positionFactory(scene, loadingManager);
createExternalGround(scene, loadingManager);
positionRoads(scene, loadingManager);
loadCactusRandom(200, citySize*5, scene, loadingManager, cube);

/********************
  LIGHTING
*********************/
window.dirLight = setLights(scene, mapSize, cube);
scene.add(dirLight);
createSun(scene, mapSize, loadingManager);
initDefaultBasicLight(sceneInsp, loadingManager);


var audioLoader = new THREE.AudioLoader(loadingManager);
var audioLoader2 = new THREE.AudioLoader(loadingManager);
var audioLoader3 = new THREE.AudioLoader(loadingManager);
var audioLoader4 = new THREE.AudioLoader(loadingManager);

audioLoader.load( "sounds/success.wav", function( buffer ) {
	soundCp.setBuffer( buffer );
	soundCp.setLoop( false );
	soundCp.setVolume( 0.5 );
});

audioLoader2.load( "sounds/finish.wav", function( buffer ) {
	soundFinish.setBuffer( buffer );
	soundFinish.setLoop( false );
	soundFinish.setVolume( 0.5 );
});

audioLoader3.load( "sounds/soundPlane.wav", function( buffer ) {
	soundPlane.setBuffer( buffer );
	soundPlane.setLoop( true );
	soundPlane.setVolume( 0.2 );
});

audioLoader4.load( "sounds/gameplay.mp3", function( buffer ) {
	soundGame.setBuffer( buffer );
	soundGame.setLoop( true );
	soundGame.setVolume( 0.2 );
});



keyboard2.update()
}


var color = "rgb(255,255,255)";
var spotLight1 = new THREE.SpotLight(color);
spotLight1.intensity = 3;
spotLight1.distance = 500;
spotLight1.position.set(auxiliarCamera.position.x,auxiliarCamera.position.y, auxiliarCamera.position.z);
sceneInsp.add(spotLight1);


init();
render();

// Switch cameras
function keyboardCommands(){
  keyboard2.update();
  
  if (keyboard2.down("C") && simulationMode){
    cockpitMode = !cockpitMode;
    
  }
  if (keyboard2.down("enter") && simulationMode){
    path.visible = !path.visible;
    
  }
  if (keyboard2.down("space")){
    simulationMode = !simulationMode;
    
  }
  if (keyboard2.down("enter") && loading === true){
    if (!music){
      soundGame.play();
      music = true;
    }
    infoBox.style.display = 'block';
    simulationMode = true;
    loading = false;
  }
  if(keyboard2.up("H")) {
    
    if(infoBox.style.display == "none") {
         infoBox.style.display = "block";
     } else {
         infoBox.style.display = 'none';
     }
  }
  
}


function render()
{
  let parameters = {"clock": clock,
                    "assembledAirplane":  assembledAirplane, 
                    "assembledAirplaneInspection": assembledAirplaneInspection,
                    "renderer": renderer,
                    "stats": stats,
                    "scene": scene,
                    "axesHelper": axesHelper,
                    "currentCheckpoint": currentCheckpoint,
                    "trackballControls": trackballControls,
                    "simulationCamera": simulationCamera,
                    "inspectionCamera": inspectionCamera,
                    "cockpitCamera": cockpitCamera,
                    "auxiliarCamera": auxiliarCamera,
                    "cube": cube,
                    "sceneInsp": sceneInsp,
                    "loadingScene": loadingScene,
                    "render": render
                  };
  initParameters(parameters);
  keyboardCommands();
  
  if (loading){
    renderLoadingScreen();
  }
  else if (simulationMode) {
    cockpitMode ? renderSimulationCockpit(soundCp, soundFinish, soundPlane, dirLight) : renderSimulation(soundCp, soundFinish, soundPlane, dirLight);
  } else {
    renderInspection(soundPlane,spotLight1);
  }
}
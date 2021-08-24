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
import { checkPosition } from "./path.js";

// To use the keyboard
var keyboard = new KeyboardState();
var simulationMode = true; // Alterna entre os modos de simulação e inspeção
var cockpitMode = false; // Ativa e desativa o modo cockpit
const timer = document.querySelector(".timer"); //Show timer

var currentCheckpoint =0;
//const timer = document.querySelector(".timer"); //Show timer


function controlledRender(simulationCamera, scene){ //Simulation Mode
  var width = window.innerWidth;
  var height = window.innerHeight;

  // Set main viewport
  renderer.setViewport(0, 0, width, height); // Reset viewport    
  renderer.setScissorTest(false); // Disable scissor to paint the entire window
  renderer.setClearColor("rgb(80, 70, 170)");    
  renderer.clear();   // Clean the window
  renderer.render(scene, simulationCamera);  
}

function controlledRenderInspection(){ //Inspection Mode
  var width = window.innerWidth;
  var height = window.innerHeight;

  // Set main viewport
  renderer.setViewport(0, 0, width, height); // Reset viewport    
  renderer.setScissorTest(false); // Disable scissor to paint the entire window
  renderer.setClearColor("rgb(80, 70, 170)");    
  renderer.clear();   // Clean the window
  renderer.render(sceneInsp, inspectionCamera);   
}



function controlledRenderCockpit(){ //Cockpit Mode
  var width = window.innerWidth;
  var height = window.innerHeight;

  // Set main viewport
  renderer.setViewport(0, 0, width, height); // Reset viewport    
  renderer.setScissorTest(false); // Disable scissor to paint the entire window
  renderer.setClearColor("rgb(80, 70, 170)");    
  renderer.clear();   // Clean the window
  renderer.render(scene, cockpitCamera);   

}

export function renderInspection(){
  
  
  assembledAirplane.airplane.visible = false;
  assembledAirplaneInspection.airplane.visible = true;
  
  renderer.clear();
  stats.update();
  scene.background = new THREE.Color("rgb(220,220,220)");
  
  axesHelper.visible = true;
  var infoOnScreen = new InfoBox2();
  trackballControls.update();
  controlledRenderInspection();
  rotatePropeller(assembledAirplaneInspection.propeller);
  var output = keyboardUpdate(cube, assembledAirplane.airplane);
  
  
  infoOnScreen.add("Speed: " + output.speedOnScreen + " kt");
  infoOnScreen.add(
    "Roll Angle: " + radiansToDegrees(-output.rollAngle).toFixed(2) + "º"
  );
  infoOnScreen.add(
    "Pitch Angle: " + radiansToDegrees(-output.pitchAngle).toFixed(2) + "º"
  );
  infoOnScreen.add("Altitude: " + output.altitude.toFixed(2) + "ft");
  infoOnScreen.show();



  requestAnimationFrame(render);
}

export function renderSimulation(){

  timer.innerText = (`Cronômetro: ${clock.getElapsedTime().toFixed(2)}`);
  assembledAirplane.airplane.visible = true;
  assembledAirplaneInspection.airplane.visible = false;
  renderer.clear();
  stats.update();
  scene.background = new THREE.Color("rgb(0,0,100)");
  axesHelper.visible = true;
  var infoOnScreen = new InfoBox2();
  trackballControls.update();
  controlledRender(simulationCamera, scene);
  rotatePropeller(assembledAirplane.propeller);
  var output = keyboardUpdate(cube, assembledAirplane.airplane);
  movement(
    assembledAirplane.airplane,
    cube
  );
  currentCheckpoint = checkPosition(currentCheckpoint);
  infoOnScreen.add("Speed: " + output.speedOnScreen + " kt");
  infoOnScreen.add(
    "Roll Angle: " + radiansToDegrees(-output.rollAngle).toFixed(2) + "º"
  );
  infoOnScreen.add(
    "Pitch Angle: " + radiansToDegrees(-output.pitchAngle).toFixed(2) + "º"
  );
  infoOnScreen.add("Altitude: " + output.altitude.toFixed(2) + "ft");
  infoOnScreen.show();

  requestAnimationFrame(render);
}

export function renderSimulationCockpit(){
  
  assembledAirplane.airplane.visible = true;
  assembledAirplaneInspection.airplane.visible = false;
  renderer.clear();
  stats.update();
  scene.background = new THREE.Color("rgb(0,0,100)");
  axesHelper.visible = true;
  var infoOnScreen = new InfoBox2();
  trackballControls.update();
  controlledRenderCockpit();
  rotatePropeller(assembledAirplane.propeller);
  var output = keyboardUpdate(cube, assembledAirplane.airplane);
  movement(
    assembledAirplane.airplane,
    cube
  );
  currentCheckpoint = checkPosition(currentCheckpoint);
  infoOnScreen.add("Speed: " + output.speedOnScreen + " kt");
  infoOnScreen.add(
    "Roll Angle: " + radiansToDegrees(-output.rollAngle).toFixed(2) + "º"
  );
  infoOnScreen.add(
    "Pitch Angle: " + radiansToDegrees(-output.pitchAngle).toFixed(2) + "º"
  );
  infoOnScreen.add("Altitude: " + output.altitude.toFixed(2) + "ft");
  infoOnScreen.show();



  requestAnimationFrame(render);
}




export function initParameters(parameters){

  window.clock = parameters.clock;
  window.assembledAirplane = parameters.assembledAirplane;
  window.assembledAirplaneInspection = parameters.assembledAirplaneInspection;
  window.renderer = parameters.renderer;
  window.stats = parameters.stats;
  window.scene = parameters.scene;
  window.axesHelper = parameters.axesHelper;
  window.currentChekpoint = parameters.currentCheckpoint;
  window.trackballControls = parameters.trackballControls;
  window.simulationCamera = parameters.simulationCamera;
  window.inspectionCamera = parameters.inspectionCamera;
  window.cockpitCamera = parameters.cockpitCamera;
  window.cube = parameters.cube;
  window.render = parameters.render;
  window.sceneInsp = parameters.sceneInsp;

}
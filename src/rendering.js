import * as THREE from "../build/three.module.js";
import {  radiansToDegrees,
          initRenderer } from "../libs/util/util.js";
import { InfoBox2 } from "./assistants.js";
import { rotatePropeller, keyboardUpdate, movement } from "./animations.js";
import { checkPosition } from "./path.js";

const timer = document.querySelector(".timer"); //Show timer

var currentCheckpoint =0;

function controlledRender(simulationCamera, scene){ //Simulation Mode
  var width = window.innerWidth;
  var height = window.innerHeight;

  // Set main viewport
  renderer.setViewport(0, 0, width, height); // Reset viewport    
  renderer.setScissorTest(false); // Disable scissor to paint the entire window
  // renderer.setClearColor("rgb(80, 70, 170)");    
  renderer.clear();   // Clean the window
  renderer.render(scene, simulationCamera); 
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
}


function controlledRenderInspection(){ //Inspection Mode
  var width = window.innerWidth;
  var height = window.innerHeight;

  // Set main viewport
  renderer.setViewport(0, 0, width, height); // Reset viewport    
  renderer.setScissorTest(false); // Disable scissor to paint the entire window
  renderer.setClearColor("rgb(80, 70, 170)");    
  renderer.clear();   // Clean the window
  renderer.render(sceneInsp, auxiliarCamera);   
}



function controlledRenderCockpit(){ //Cockpit Mode
  var width = window.innerWidth;
  var height = window.innerHeight;

  // Set main viewport
  renderer.setViewport(0, 0, width, height); // Reset viewport    
  renderer.setScissorTest(false); // Disable scissor to paint the entire window
  //renderer.setClearColor("rgb(80, 70, 170)");    
  renderer.clear();   // Clean the window
  renderer.render(scene, cockpitCamera);   

}

export function renderLoading(){
  assembledAirplane.airplane.visible = false;
  assembledAirplaneInspection.airplane.visible = false;
  const loader = new THREE.FontLoader();

  renderer.clear();
  stats.update();
  
  
  axesHelper.visible = false;   
}

export function renderInspection(soundPlane, spotLight1){
  soundPlane.pause();
  spotLight1.position.set(auxiliarCamera.position.x,auxiliarCamera.position.y, auxiliarCamera.position.z);
  assembledAirplane.airplane.visible = false;
  assembledAirplaneInspection.airplane.visible = true;
  
  renderer.clear();
  stats.update();
  sceneInsp.background = new THREE.Color("rgb(0,0,0)");
  
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


export function renderSimulation(soundCp, soundFinish, soundPlane, dirLight){

  timer.innerText = (`Cronômetro: ${clock.getElapsedTime().toFixed(2)}`);
  assembledAirplane.airplane.visible = true;
  assembledAirplaneInspection.airplane.visible = false;
  renderer.clear();
  stats.update();
  axesHelper.visible = true;
  var infoOnScreen = new InfoBox2();
  trackballControls.update();
  controlledRender(simulationCamera, scene);
  rotatePropeller(assembledAirplane.propeller);
  var output = keyboardUpdate(cube, assembledAirplane.airplane, dirLight);
  movement(
    assembledAirplane.airplane,
    cube,
    soundPlane,
    dirLight
  );
  
  currentCheckpoint = checkPosition(currentCheckpoint, assembledAirplane.airplane, soundCp, soundFinish);
  infoOnScreen.add("Speed: " + output.speedOnScreen + " kt");
  infoOnScreen.add(
    "Roll Angle: " + radiansToDegrees(-output.rollAngle).toFixed(2) + "º"
  );
  infoOnScreen.add(
    "Pitch Angle: " + radiansToDegrees(-output.pitchAngle).toFixed(2) + "º"
  );
  infoOnScreen.add("Altitude: " + output.altitude.toFixed(2) + "ft");
  infoOnScreen.show();
  const info = document.getElementById("InfoxBox2");
  info.style.display = "none";

  requestAnimationFrame(render);
}


export function renderSimulationCockpit(soundCp, soundFinish, soundPlane, dirLight){
  
  assembledAirplane.airplane.visible = true;
  assembledAirplaneInspection.airplane.visible = false;
  renderer.clear();
  stats.update();
  // scene.background = new THREE.Color("rgb(0,0,100)");
  axesHelper.visible = true;
  var infoOnScreen = new InfoBox2();
  trackballControls.update();
  controlledRenderCockpit();
  rotatePropeller(assembledAirplane.propeller);
  var output = keyboardUpdate(cube, assembledAirplane.airplane, dirLight);
  movement(
    assembledAirplane.airplane,
    cube,
    soundPlane, 
    dirLight
  );
  currentCheckpoint = checkPosition(currentCheckpoint, assembledAirplane.airplane, soundCp, soundFinish);
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

export function renderLoadingScreen(){
  assembledAirplane.airplane.visible = false;
  assembledAirplaneInspection.airplane.visible = false;
  renderer.clear();
  stats.update();
  var width = window.innerWidth;
  var height = window.innerHeight;

  // Set main viewport
  renderer.setViewport(0, 0, width, height); // Reset viewport    
  renderer.setScissorTest(false); // Disable scissor to paint the entire window
  renderer.clear();   // Clean the window
  renderer.render(loadingScene, auxiliarCamera);  
  
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
  window.auxiliarCamera = parameters.auxiliarCamera;
  window.cube = parameters.cube;
  window.airplane = parameters.airplane;
  window.render = parameters.render;
  window.sceneInsp = parameters.sceneInsp;
  window.loadingScene = parameters.loadingScene;

}
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

        
const score = document.querySelector(".score"); //Show score
//////////////////////////////////////////////////////////////////////////////
//Create Checkpoints
///////////////////////////////////////////////////////////////////////////////

function createCheckPoint(vec){
  
  const torusGeometry = new THREE.TorusGeometry( 3000, 500, 32, 200 );
  const torusMaterial = new THREE.MeshPhongMaterial( {
        transparent:true,
        opacity: 0.49,
        depthTest: true,
        depthWrite: true,
        alphaTest: 0,
        visible: true,
        side: THREE.FrontSide,
        color:0xffc600,
        emissive:0xffc600,
        shininess:30,
        flatShading:true,
        wireframe: false,
        reflectivity:1,
        refractionRatio:1
      } );

  const torus = new THREE.Mesh( torusGeometry, torusMaterial );
  torus.translateZ(50);
  torus.position.set(vec.x,vec.y,vec.z);

  return torus;
}

function getRandomInt(min, max){
  return Math.floor(Math.random() * (max - min + 2000) ) + min; 
}

function createVectors(mapSize){
  var airplaneInitialPosition = new THREE.Vector3(1.1*mapSize, 2200,-mapSize);
  var vectors = [];
  var numberOfPoints = 13;

  vectors.push(airplaneInitialPosition);
  for (let point = 0; point < numberOfPoints-1; point++) {
    // var x = getRandomInt(-70000, 70000);
    // var y = getRandomInt(10000, 30000);
    // var z = getRandomInt(-70000, 70000);
    var x = airplaneInitialPosition.x;
    var y = getRandomInt(10000, 30000);
    var z = airplaneInitialPosition.z+(point*100000);
    var vector = new THREE.Vector3(x, y, z);
    vectors.push(vector);
    
  }
  vectors.push(airplaneInitialPosition);
  return vectors
}

export function createPath(scene, mapSize){
  var pointsPositions = createVectors(mapSize);

  window.checkPointsPositions = pointsPositions;
  
  window.checkpoints = checkPointsPositions.map(x => createCheckPoint(x));
  for (var i=0; i<checkpoints.length; i++){
    if (i != checkpoints.length-1){
      //checkpoints[i].rotateY((Math.asin( (checkpoints[i+1].position.y - checkpoints[i].position.y)/(Math.sqrt(Math.pow((checkpoints[i+1].position.y - checkpoints[i].position.y), 2 ) + Math.pow( (checkpoints[i+1].position.x - checkpoints[i].position.x), 2 )  )) )));
    }
    scene.add(checkpoints[i]);
  }
  for (i=1; i<checkpoints.length; i++){
    checkpoints[i].visible= true;
  }
  ///////////////////////////////////////////////////////////////////////////////
  //Create a closed wavey loop
  ///////////////////////////////////////////////////////////////////////////////

  const curve = new THREE.CatmullRomCurve3( checkPointsPositions);
  const points = curve.getPoints( 250 );
  const geometry = new THREE.BufferGeometry().setFromPoints( points );
  const material = new THREE.LineBasicMaterial( { color : 0xff0000, linewidth: 2} );

  // Create the final object to add to the scene
  const curveObject = new THREE.Line( geometry, material );
  scene.add(curveObject);

  
}



export function checkPosition(currentCheckpoint){
  
  score.innerText = (`Score: ${currentCheckpoint}`);
  if(currentCheckpoint == "Fim de caminho") return currentCheckpoint;

  if (cube.position.x >= checkPointsPositions[currentCheckpoint].x-5000 && cube.position.x <=checkPointsPositions[currentCheckpoint].x + 5000){

    if (cube.position.y >= checkPointsPositions[currentCheckpoint].y - 5000 && cube.position.y <= checkPointsPositions[currentCheckpoint].y + 5000){
      
      if (cube.position.z + 8000>=checkPointsPositions[currentCheckpoint].z - 5000 && cube.position.z + 8000 <= checkPointsPositions[currentCheckpoint].z + 5000){
        if (currentCheckpoint == 0){
          clock.start();
        }
        checkpoints[currentCheckpoint].visible=  false;
        if (currentCheckpoint == checkpoints.length - 1){
          clock.stop();
          currentCheckpoint = "Fim de caminho";
          return currentCheckpoint;
        }
        
        checkpoints[currentCheckpoint+1].visible = true;
        
        
        currentCheckpoint+=1;
      }
    }
  }
  return currentCheckpoint;
}

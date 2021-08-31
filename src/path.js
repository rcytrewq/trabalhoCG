import * as THREE from "../build/three.module.js";
import { degreesToRadians } from "../libs/util/util.js";
        
const score = document.querySelector(".score"); 

//////////////////////////////////////////////////////////////////////////////
//Create Checkpoints
///////////////////////////////////////////////////////////////////////////////
var airplanePosition = new THREE.Vector3();
var checkpointPosition = new THREE.Vector3();
function createCheckPoint(vec){
  
  const torusGeometry = new THREE.TorusGeometry( 20, 1.5, 16, 200);
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
  torus.translateX(50);
  torus.position.set(vec.x,vec.y,vec.z);

  return torus;
}


function getRandomInt(min, max){
  return Math.floor(Math.random() * (max - min + 13) ) + min; 
}


function createVectors(){
  var airplaneInitialPosition = new THREE.Vector3(0, 45, -300);
  var vectors = [];
  var numberOfPoints = 2;

  vectors.push(airplaneInitialPosition);

  var position2 =  new THREE.Vector3(150, 80, -200);
  vectors.push(position2);

  var position3 = new THREE.Vector3(400, 100, -150);
  vectors.push(position3);

  var position4 = new THREE.Vector3(10, 100, -50);
  vectors.push(position4);

  var position5 = new THREE.Vector3(50, 200, 50);
  vectors.push(position5);

  var position6 = new THREE.Vector3(400, 250, 400);
  vectors.push(position6);

  var position7 = new THREE.Vector3(-400, 250, 400);
  vectors.push(position7);

  var position8 = new THREE.Vector3(-150, 300, 300);
  vectors.push(position8);

  var position9 = new THREE.Vector3(-250, 100, 200);
  vectors.push(position9);

  var position10 = new THREE.Vector3(-400, 45, -300);
  vectors.push(position10);

  var position11 = new THREE.Vector3(-500, 200, -50);
  vectors.push(position11);

  var position12 = new THREE.Vector3(-200, 100, -100);
  vectors.push(position12);

  var airplaneFinalPosition = new THREE.Vector3(-250, 45, -300);
  vectors.push(airplaneFinalPosition);
  return vectors
}


export function createPath(scene){
  var pointsPositions = createVectors();

  window.checkPointsPositions = pointsPositions;
  
  window.checkpoints = checkPointsPositions.map(x => createCheckPoint(x));
  checkpoints[1].rotateY(degreesToRadians(90));
  for (var i=0; i<checkpoints.length; i++){
    scene.add(checkpoints[i]);
  }
  for (i=1; i<checkpoints.length; i++){
    checkpoints[i].visible= false;
  }

  /////////////////////////////////////////////////////////////////////////////
  //Create a closed wavey loop
  /////////////////////////////////////////////////////////////////////////////

  const curve = new THREE.CatmullRomCurve3( checkPointsPositions);
  const points = curve.getPoints( 250 );
  const geometry = new THREE.BufferGeometry().setFromPoints( points );
  const material = new THREE.LineBasicMaterial( { color : 0xff0000, linewidth: 2} );

  // Create the final object to add to the scene
  const curveObject = new THREE.Line( geometry, material );
  return(curveObject);

  
}

export function checkPosition(currentCheckpoint, airplane, soundCp, soundFinish){
  
  score.innerText = (`Score: ${currentCheckpoint}/${checkPointsPositions.length}`);
  if(currentCheckpoint == "Fim de caminho") return currentCheckpoint;
  airplane.getWorldPosition(airplanePosition);
  checkpoints[currentCheckpoint].getWorldPosition(checkpointPosition);
  // console.log(cube.position);
  if (airplanePosition.x >= checkpointPosition.x-20 && airplanePosition.x <=checkpointPosition.x + 20){

    if (airplanePosition.y >= checkpointPosition.y - 20 && airplanePosition.y <= checkpointPosition.y + 20){
      
      if (airplanePosition.z + 40>=checkpointPosition.z - 20 && airplanePosition.z + 40 <= checkpointPosition.z + 20){
        
        soundCp.play();
        if (currentCheckpoint == 0){
          clock.start();
        }
        checkpoints[currentCheckpoint].visible=  false;
        if (currentCheckpoint == checkpoints.length - 1){
          clock.stop();
          currentCheckpoint = "Fim de caminho";
          soundFinish.play();
          return currentCheckpoint;
        }
        
        checkpoints[currentCheckpoint+1].visible = true;
        
        
        currentCheckpoint+=1;
      }
    }
  }
  return currentCheckpoint;
}

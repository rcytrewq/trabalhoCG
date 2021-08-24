import * as THREE from "../build/three.module.js";

var vcWidth = 400; // virtual camera width
var vcHeidth = 300; // virtual camera height

export function createSimulationCamera(mapSize){

  var lookAtVec = new THREE.Vector3( 0.0, 0.0, 70.0 );
  var upVec = new THREE.Vector3( 0.0, 0.0, 1.0 );
  
  var camera = new THREE.PerspectiveCamera(45, vcWidth/vcHeidth, 1.0, mapSize);
  camera.lookAt(lookAtVec);
  camera.position.set(0,20 ,-50);    
  camera.up = upVec;

  return camera;
}


export function createCockpitCamera(mapSize){

  var lookAtVec = new THREE.Vector3( 0,10,0 );
  var upVec = new THREE.Vector3( 0.0, 1.0, 1.0 );

  var camera = new THREE.PerspectiveCamera(45, vcWidth/vcHeidth, 1.0, 1000000);
  camera.lookAt(lookAtVec);
  camera.position.set(0,-5 ,10);
  camera.up = upVec;

  return camera;
}


export function createInspectionCamera(){

  var lookAtVec = new THREE.Vector3( 0, 0, 0.2);
  var upVec = new THREE.Vector3( 0,1, 0, );

  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000000);
  camera.lookAt(lookAtVec);
  camera.position.set(-10000,10000,200)
  camera.up.set(upVec);
  
  return camera;
}
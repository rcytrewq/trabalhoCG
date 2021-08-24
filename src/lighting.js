import * as THREE from  '../build/three.module.js';
import {createLightSphere} from "../libs/util/util.js";


///////////////////////////////////////////////////////////////////////////////
 // LIGHTING SETTINGS
///////////////////////////////////////////////////////////////////////////////

export function createSun(scene, mapSize){
  const hemLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 0.3 );
  hemLight.castShadow = false;
  scene.add(hemLight);  

  var sunPos = new THREE.Vector3(mapSize*0.53,mapSize*0.67,mapSize*1.3);
  var dirLight = setDirectionalLighting(sunPos,0.9, mapSize);
  dirLight.castShadow = true;
  scene.add(dirLight);
  createLightSphere(scene,100,20,20,sunPos);
}


function setDirectionalLighting(position,intensity, mapSize)
{
  var dirLight = new THREE.DirectionalLight("rgb(255,255,255)",intensity);
  dirLight.translateX(position.x);
  dirLight.translateY(position.y);
  dirLight.translateZ(position.z);
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  dirLight.castShadow = true;
  
  dirLight.decay = 2;
  dirLight.penumbra = 0.5;

  dirLight.shadow.camera.position.set = position;
  dirLight.shadow.camera.left = -mapSize;
  dirLight.shadow.camera.right = mapSize;
  dirLight.shadow.camera.top = mapSize;
  dirLight.shadow.camera.bottom = - mapSize;
  dirLight.shadow.camera.near = .2;    
  dirLight.shadow.camera.far = 10*mapSize;        

  dirLight.name = "Direction Light";
  dirLight.visible = true;
  
  return dirLight;
}

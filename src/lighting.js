import * as THREE from  '../build/three.module.js';
import {createLightSphere,
        degreesToRadians} from "../libs/util/util.js";



export function createSun(scene, mapSize, loadingManager){
  const hemLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 0.3 );
  hemLight.castShadow = false;
  scene.add(hemLight);  

  var sunPos = new THREE.Vector3(mapSize*0.53,mapSize*0.67,mapSize*1.3);
  var dirLight = setDirectionalLighting(sunPos,0.9, mapSize);
  dirLight.castShadow = true;
  scene.add(dirLight);
  createLightSphere(scene,1000,200,20,sunPos);
}


function setDirectionalLighting(position,intensity, mapSize, loadingManager)
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

export function setLights(scene, mapSize, airplane) 
{ 

    var position = new THREE.Vector3(mapSize, mapSize, 0);
    var dirLight = new THREE.DirectionalLight("rgb(255,255,255)",1);
    dirLight.translateX(position.x);
    dirLight.translateY(position.y);
    dirLight.translateZ(position.z);
    dirLight.shadow.mapSize.width = 8192;
    dirLight.shadow.mapSize.height = 8192;
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
    scene.add(dirLight);
    

    var position2 = new THREE.Vector3(50,50,0);
    var dirLightDynamic = new THREE.DirectionalLight("rgb(255,255,255)",0.5);
    dirLightDynamic.translateX(position2.x);
    dirLightDynamic.translateY(position2.y);
    dirLightDynamic.translateZ(position2.z);
    dirLightDynamic.shadow.mapSize.width = 1024;
    dirLightDynamic.shadow.mapSize.height = 1024;
    dirLightDynamic.castShadow = true;
    
    dirLightDynamic.decay = 2;
    dirLightDynamic.penumbra = 0.5;
  
    dirLightDynamic.shadow.camera.position.set = position2;
    dirLightDynamic.shadow.camera.left = -100;
    dirLightDynamic.shadow.camera.right = 100;
    dirLightDynamic.shadow.camera.top = 100;
    dirLightDynamic.shadow.camera.bottom = - 100;
    dirLightDynamic.shadow.camera.near = .2;    
    dirLightDynamic.shadow.camera.far = 10*100;
    translateSpot(135, 150, -400, dirLightDynamic);     
    
    dirLightDynamic.name = "Direction Light Dynamic";
    dirLightDynamic.visible = true;

  

  return dirLightDynamic;
}

export function translateSpot(x, y, z, light){
  light.translateX(x);
  light.translateY(y);
  light.translateZ(z);
  light.target.translateX(x);
  light.target.translateY(y);
  light.target.translateZ(z);
  light.target.updateMatrixWorld();
}

export function rotateSpot(x, y, z, light){
  light.rotateX(x);
  light.rotateY(y);
  light.rotateZ(z);
  light.target.rotateX(x);
  light.target.rotateY(y);
  light.target.rotateZ(z);
  light.target.updateMatrixWorld();
}



export function createLightSphereSpot(radius, widthSegments, heightSegments, position, color, scene) {
  var geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments, 0, Math.PI * 2, 0, Math.PI);
  geometry.rotateZ(degreesToRadians(90));
  var material = new THREE.MeshBasicMaterial({ color: color });
  var object = new THREE.Mesh(geometry, material);
  object.visible = true;
  object.position.copy(position);
  scene.add(object);
  return object;
}


export function setSpotLight(position, sl) {
    sl.intensity = 5;
    sl.distance = 50000;
    sl.position.copy(position);
    sl.shadow.mapSize.width = 5120;
    sl.shadow.mapSize.height = 5120;
    sl.angle = degreesToRadians(45);
    sl.castShadow = true;
    sl.decay = 2;
    sl.penumbra = 0.5;

    
}
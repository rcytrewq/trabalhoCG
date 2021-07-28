import * as THREE from  '../build/three.module.js';
import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {ConvexGeometry} from '../build/jsm/geometries/ConvexGeometry.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {GLTFLoader} from '../build/jsm/loaders/GLTFLoader.js';
import {OBJLoader} from '../build/jsm/loaders/OBJLoader.js';
import {MTLLoader} from '../build/jsm/loaders/MTLLoader.js';
import {initRenderer, 
        InfoBox,
        onWindowResize, 
        degreesToRadians,
        getMaxSize,
        createLightSphere} from "../libs/util/util.js";

var mapSize = 70000;
//loadBasePlane(mapSize);



export function loadGLTFFile(modelPath, modelName, visibility, desiredScale, myObj)
{
  var loader = new GLTFLoader( );
  loader.load( modelPath + modelName + '.gltf', function ( gltf ) {
    var obj = gltf.scene;
    myObj = gltf.scene;
    obj.name = modelName;
    obj.visible = visibility;
    obj.traverse( function ( child ) {
      if ( child ) {
          child.castShadow = true;
      }
    });
    obj.traverse( function( node )
    {
      if( node.material ) node.material.side = THREE.DoubleSide;
    });

    var obj = normalizeAndRescale(obj, desiredScale);
    var obj = fixPosition(obj);

    scene.add ( myObj );
    objectArray.push( obj );

    }, onProgress, onError);
}

export function onError() { };

export function onProgress ( xhr, model ) {
    if ( xhr.lengthComputable ) {
      var percentComplete = xhr.loaded / xhr.total * 100;

    }
}

export function normalizeAndRescale(obj, newScale)
{
  var scale = getMaxSize(obj); // Available in 'utils.js'
  obj.scale.set(newScale * (1.0/scale),
                newScale * (1.0/scale),
                newScale * (1.0/scale));
  return obj;
}

export function fixPosition(obj)
{
  // Fix position of the object over the ground plane
  var box = new THREE.Box3().setFromObject( obj );
  if(box.min.y > 0)
    obj.translateY(-box.min.y);
  else
    obj.translateY(-1*box.min.y);
  return obj;
}

/********************
  LIGHTING
*********************/

export function setDirectionalLighting(position,intensity)
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

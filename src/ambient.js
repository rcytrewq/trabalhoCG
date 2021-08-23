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

export function loadCactusRandom(numTrees, mapSize, scene)
{
  var cactusModels = ['cactus01','cactus02','cactus03','cactus04'];
  var modelPath = '../assets/objects/';
  
  for(let i = 0; i<numTrees; i++)
  {
    
    let rands1; //sinal
    if(Math.random() > 0.5)
      rands1 = -1;
    else
      rands1 = 1;
    let rands2; //sinal
    if(Math.random() > 0.5)
      rands2 = -1;
    else
      rands2 = 1;
    
    let randx = Math.random(); //position x
    let randz = Math.random(); //position z
    let randr = Math.random(); //rotation 

    let min = 0.9;
    let randscale = Math.random() + min;
    
    let treePosition = new THREE.Vector3(randx*rands1*mapSize,mapSize*(0.0065*Math.sqrt((1-randscale)*(1-randscale))) ,randz*rands2*mapSize);
    let treeRotation = degreesToRadians(360*randr);

    var modelName = cactusModels[i%4];

    var loader = new GLTFLoader( );
    loader.load( modelPath + modelName + '.gltf', function ( gltf ) {
    var obj = gltf.scene;
    obj.name = modelName;
    obj.visible = true;
    obj.traverse( function ( child ) {
      if ( child ) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.material = new THREE.MeshLambertMaterial({color: 0x8c9444});
      }
    });
    obj.traverse( function( node )
    {

      if( node.material ) node.material.side = THREE.DoubleSide;
    });

    scene.add ( obj );
    obj.translateX(treePosition.x);
    obj.translateY(treePosition.y);
    obj.translateZ(treePosition.z);

    obj.rotateOnAxis(new THREE.Vector3(0,1,0),  treeRotation );

    let proportionalScale = (mapSize/750);

    obj.scale.set(randscale*(proportionalScale - 1)*1.3, randscale*proportionalScale, randscale*proportionalScale*1.3);
    obj.translateY(-700);
    //obj.position.set(treePosition);
    
    }, onProgress, onError);

  }
}


export function loadMountains(mapSize, scene)
{
  var modelPath = '../assets/objects/';
  var mountainModels = ['mountain01','mountain02','mountain01']
  var mountainPositions = [ new THREE.Vector3( 0 ,           mapSize/14,     mapSize/10), 
                            new THREE.Vector3(-2*mapSize/3,  mapSize/21,  -2*mapSize/3),
                            new THREE.Vector3( 2*mapSize/3,  mapSize/24,  -2*mapSize/3)];
  var mountainScales = [1.8,1.4,1.0];

  for(let i=0; i<3; i++)
  {
    let modelName = mountainModels[i];
    let mountainPosition = mountainPositions[i];
    let mountainScale = mountainScales[i];

    var loader = new GLTFLoader( );
    loader.load( modelPath + modelName + '.gltf', function ( gltf ) {
    var obj = gltf.scene;
    obj.name = modelName;
    obj.visible = true;
    obj.traverse( function ( child ) {
      if ( child ) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.material = new THREE.MeshLambertMaterial({color: 0xcc692b});

      }
    });
    obj.traverse( function( node )
    {

      //if( node.material ) node.material.side = THREE.DoubleSide;
    });

    scene.add ( obj );
    obj.translateX(mountainPosition.x);
    obj.translateY(mountainPosition.y);
    obj.translateZ(mountainPosition.z);

    //obj.rotateOnAxis(new THREE.Vector3(0,1,0),  treeRotation );
    obj.clipShadows = true;
    

    var sizeAdjust = mapSize*7/9000;
    obj.translateY(-900);

    obj.scale.set(sizeAdjust*mountainScale,sizeAdjust*mountainScale,sizeAdjust*mountainScale);
  }, onProgress, onError);
 
  }
}

export function loadBasePlane(mapSize, scene)
{
  var modelPath = '../assets/objects/';

  var mountainPositions = [new THREE.Vector3(0,0,mapSize/10), 
                          new THREE.Vector3(-2*mapSize/3,0,-2*mapSize/3),
                          new THREE.Vector3(2*mapSize/3,0,-2*mapSize/3)];
  var mountainScales = [1.7,1.4,1.0];

  let modelName = 'basePlaneIrregular';
  let basePlaneScale = mapSize/100;

  var loader = new GLTFLoader( );
  loader.load( modelPath + modelName + '.gltf', function ( gltf ) {
  var obj = gltf.scene;
  obj.name = modelName;
  obj.visible = true;
  obj.traverse( function ( child ) {
    if ( child ) {
        child.castShadow = false;
        child.receiveShadow = true;
        child.material = new THREE.MeshPhongMaterial({color: 0xda9a52});

    }
  });
  obj.traverse( function( node )
  {

    if( node.material ) node.material.side = THREE.DoubleSide;
  });

  scene.add ( obj );


  obj.clipShadows = true;
  

  obj.scale.set(basePlaneScale*100,basePlaneScale/5,basePlaneScale*100);
  obj.translateY(-1000);
}, onProgress, onError);


}

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

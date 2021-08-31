import * as THREE from  '../build/three.module.js';
import {degreesToRadians} from "../libs/util/util.js";
import {GLTFLoader} from '../build/jsm/loaders/GLTFLoader.js';

var citySize = 1000;


export function createExternalGround(scene, loadingManager)
{
  //-- Scene Objects -----------------------------------------------------------
  // Outskirts ground
  var planeGeometry2 = new THREE.PlaneGeometry(citySize*5, citySize*5);
  var planeMaterial2 = new THREE.MeshPhongMaterial({
      color: "rgba(255,255,255)",
      side: THREE.DoubleSide,
  });
  var groundPlane2 = new THREE.Mesh(planeGeometry2, planeMaterial2)
  groundPlane2.rotateX(degreesToRadians(-90));
  groundPlane2.position.set(0,-5,0);
  groundPlane2.castShadow = true;  
  groundPlane2.receiveShadow = true; 
  scene.add(groundPlane2);

  // Outside Ground
  var planeGeometry3 = new THREE.PlaneGeometry(citySize*50, citySize*50);
  var planeMaterial3 = new THREE.MeshBasicMaterial({
      color: 0xc08c49,
      side: THREE.DoubleSide,
  });
  var groundPlane3 = new THREE.Mesh(planeGeometry3, planeMaterial3);
  groundPlane3.rotateX(degreesToRadians(-90));
  groundPlane3.position.set(0,-20,0)
  groundPlane3.castShadow = true;  
  groundPlane3.receiveShadow = true; 
  scene.add(groundPlane3);
  //----------------------------------------------------------------------------
  //-- Use TextureLoader to load texture files
  var textureLoader = new THREE.TextureLoader(loadingManager);

  var textureLoader = new THREE.TextureLoader(loadingManager);
  var asphalt = textureLoader.load('imgs/asphalt03.jpg', function ( asphalt ) {
    asphalt.wrapS = asphalt.wrapT = THREE.RepeatWrapping;
    asphalt.offset.set( 0, 0 );
    asphalt.repeat.set( 100, 100 )
    asphalt.rotation = 0;
  } ); 
 
  var sand01 = textureLoader.load('imgs/sand01.jpg', function ( asphalt ) {
    asphalt.wrapS = asphalt.wrapT = THREE.RepeatWrapping;
    asphalt.offset.set( 0, 0 );
    asphalt.repeat.set( 100, 100 )
    asphalt.rotation = 0;
  } ); 

  groundPlane2.material.map = sand01;
  
}


export function loadCactusRandom(numTrees, mapSize,scene, loadingManager, cube, proportionalScale = 2)
{
  var cactusModels = ['cactus01','cactus02','cactus03','cactus04'];
  var modelPath = 'models/';
  
  for(let i = 0; i<numTrees; i++)
  {
          
    let randx = Math.random(); //position x
    let randz = Math.random(); //position z
    
    if(randx < 0.2 && randz < 0.2)
    {
      i--;
      continue;
    }
     
    let randr = Math.random(); //rotation 
      
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

    let min = 0.9;
    let randscale = Math.random() + min;
    
    let treePosition = new THREE.Vector3(randx*rands1*mapSize,0,randz*rands2*mapSize);
    let treeRotation = degreesToRadians(360*randr);

    var modelName = cactusModels[i%4];

    var loader = new GLTFLoader(loadingManager);
    loader.load( modelPath + modelName + '.gltf', function ( gltf ) {
    var obj = gltf.scene;
    obj.name = modelName;
    obj.visible = true;
    obj.traverse( function ( child ) {
      if ( child ) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.material = new THREE.MeshLambertMaterial({color: 0x859f5e
          });
      }
    });
    obj.traverse( function( node )
    {

      if( node.material ) node.material.side = THREE.DoubleSide;
    });

    obj.castShadow = true;  
    obj.receiveShadow = true; 

    scene.add ( obj );
    obj.translateX(treePosition.x);
    obj.translateY(treePosition.y);
    obj.translateZ(treePosition.z);

    obj.rotateOnAxis(new THREE.Vector3(0,1,0),  treeRotation );    

    obj.scale.set(randscale*(proportionalScale - 1)*1.3, randscale*proportionalScale, randscale*proportionalScale*1.3);
    
    
    }, onProgress, onError); 
  }
}

function createRoad01(scene, loadingManager)
{
  var openSpline = new THREE.CatmullRomCurve3( [
    new THREE.Vector3( -30, 0,  500 ),
    new THREE.Vector3( -61,   0,  773 ),
    new THREE.Vector3( -197, 0,  1013 ),
    new THREE.Vector3(  -402,   0, 1209 ),
    new THREE.Vector3(  -637, 0, 1373 ),
    new THREE.Vector3(  -980, 0, 1576 ),
    new THREE.Vector3(  -1247, 0, 1708 ),
    new THREE.Vector3(  -1703, 0, 1900 ),
    new THREE.Vector3(  -2530, 0, 2197 ),
    new THREE.Vector3(  -17577,0 , 7457)
  ] );
  openSpline.type = 'catmullrom';
  openSpline.closed = false;
  var extrudeSettings = {
    steps           : 100,
    bevelEnabled    : false,
    extrudePath     : openSpline
  };
  
  var pts = [];
  pts.push( new THREE.Vector2 ( 0, 0 ));
  pts.push( new THREE.Vector2 ( 5, 0 ) );
  pts.push( new THREE.Vector2 ( 5,  60) );
  pts.push( new THREE.Vector2 ( 0, 60 ));
  
  var shape = new THREE.Shape( pts );
  var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
  var material = new THREE.MeshLambertMaterial({side: THREE.DoubleSide});
  
  var mesh = new THREE.Mesh( geometry, material );
  mesh.castShadow = true;  
  mesh.receiveShadow = true; 
  let textureLoader = new THREE.TextureLoader(loadingManager);
  let road01 = textureLoader.load('imgs/dirt02.jpg', function ( road01 ) {
    road01.wrapS = road01.wrapT = THREE.RepeatWrapping;
    road01.minFilter = THREE.LinearMipMapLinearFilter;
    road01.offset.set( 0, 0 );
    road01.repeat.set( 0.08, 0.08 )
    road01.rotation = degreesToRadians(90);
  } ); 
  
  mesh.material.map = road01;
 
  scene.add(mesh);
}

function createRoad02(scene, loadingManager)
{
  var openSpline = new THREE.CatmullRomCurve3( [
    new THREE.Vector3(  -30,   0, -500 ),
    new THREE.Vector3( -88, 0,  -1560 ),
    new THREE.Vector3( -202,   0,  -2404 ),
    new THREE.Vector3( -221, 0,-2514 ),    
    new THREE.Vector3(  -3148, 0, -15916 ),
    new THREE.Vector3(  -4760, 0, -22151 )
  ] );
  openSpline.type = 'catmullrom';
  openSpline.closed = false;
  var extrudeSettings = {
    steps           : 100,
    bevelEnabled    : false,
    extrudePath     : openSpline
  };
  
  var pts = [];
  pts.push( new THREE.Vector2 ( 0, 0 ));
  pts.push( new THREE.Vector2 ( 5, 0 ) );
  pts.push( new THREE.Vector2 ( 5,  60) );
  pts.push( new THREE.Vector2 ( 0, 60 ));
  
  var shape = new THREE.Shape( pts );
  var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
  var material = new THREE.MeshLambertMaterial({side: THREE.DoubleSide});
  
  var mesh = new THREE.Mesh( geometry, material );
  mesh.castShadow = true;  
  mesh.receiveShadow = true; 
  let textureLoader = new THREE.TextureLoader(loadingManager);
  let road01 = textureLoader.load('imgs/dirt03.jpg', function ( road01 ) {
    road01.wrapS = road01.wrapT = THREE.RepeatWrapping;
    road01.minFilter = THREE.LinearMipMapLinearFilter;
    road01.offset.set( 0, 0 );
    road01.repeat.set( 0.08, 0.08 )
    road01.rotation = degreesToRadians(90);
  } ); 
  mesh.material.map = road01;
  mesh.translateX(60);

 
  scene.add(mesh);
}

function createRoad03(scene, loadingManager)
{
  var openSpline = new THREE.CatmullRomCurve3( [
    new THREE.Vector3(  -510,   0, 264 ),
    new THREE.Vector3( -619, 0,  229 ),
    new THREE.Vector3( -666,   0,  125 ),
    new THREE.Vector3( -644, 0, -50 ),
    new THREE.Vector3( -610, 0, -14 ),
    new THREE.Vector3( -510, 0, 14 ),
  ] );
  openSpline.type = 'catmullrom';
  openSpline.closed = false;
  var extrudeSettings = {
    steps           : 100,
    bevelEnabled    : false,
    extrudePath     : openSpline
  };
  
  var pts = [];
  pts.push( new THREE.Vector2 ( 0, 0 ));
  pts.push( new THREE.Vector2 ( 5, 0 ) );
  pts.push( new THREE.Vector2 ( 5,  28) );
  pts.push( new THREE.Vector2 ( 0, 28 ));
  
  var shape = new THREE.Shape( pts );
  var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
  var material = new THREE.MeshLambertMaterial({side: THREE.DoubleSide});
  
  var mesh = new THREE.Mesh( geometry, material );
  mesh.castShadow = true;  
  mesh.receiveShadow = true; 

  let textureLoader = new THREE.TextureLoader(loadingManager);
  let road01 = textureLoader.load('imgs/dirt02.jpg', function ( road01 ) {
    road01.wrapS = road01.wrapT = THREE.RepeatWrapping;
    road01.minFilter = THREE.LinearMipMapLinearFilter;
    road01.offset.set( 0, 0 );
    road01.repeat.set( 0.08, 0.08 )
    road01.rotation = degreesToRadians(90);
  } ); 
  mesh.material.map = road01;
  mesh.translateX(60);
 
  scene.add(mesh);
}

function createRoad04(scene, loadingManager)
{
  let textureLoader = new THREE.TextureLoader(loadingManager);

  let bottomGeometry = new THREE.BoxGeometry(229, 5, 28);
  let bottomMaterial = new THREE.MeshLambertMaterial();
  let bottom = new THREE.Mesh(bottomGeometry, bottomMaterial);
  bottom.castShadow = true;  
  bottom.receiveShadow = true; 
  bottom.position.set(-624, 0, 0);
  
  scene.add(bottom);

  let wall01 = textureLoader.load('imgs/asphalt03.jpg', function ( wall01 ) {
    wall01.wrapS = wall01.wrapT = THREE.RepeatWrapping;
    wall01.offset.set( 0, 0);
    wall01.repeat.set( 1, 2 )
    wall01.rotation = 0;
  } ); 
  bottom.material.map = wall01;
}


function createArea01(scene, loadingManager)
{
  var closedSpline = new THREE.CatmullRomCurve3( [
    new THREE.Vector3( 1230,  0,  87 ),
    new THREE.Vector3(  1455, 0, 13 ),
    new THREE.Vector3( 1548,  0,  45 ),
    new THREE.Vector3( 1600,  0,  -448 ),
    new THREE.Vector3(  1286, 0, 624 ),
    new THREE.Vector3(  957,  0, 566 ),
    new THREE.Vector3(  749,  0 , 254)
  ] );
  closedSpline.type = 'catmullrom';
  closedSpline.closed = true;

  var points = closedSpline.getPoints(100);
 
  //var geometry = new ConvexGeometry(points);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
    var material = new THREE.MeshLambertMaterial({side: THREE.DoubleSide});
  
  var mesh = new THREE.Mesh( geometry, material );
  mesh.castShadow = true;  
  mesh.receiveShadow = true; 

  let textureLoader = new THREE.TextureLoader(loadingManager);
  let road01 = textureLoader.load('imgs/dirt02.jpg', function ( road01 ) {
    road01.wrapS = road01.wrapT = THREE.RepeatWrapping;
    road01.minFilter = THREE.LinearMipMapLinearFilter;
    road01.offset.set( 0, 0 );
    road01.repeat.set( 0.08, 0.08 )
    road01.rotation = degreesToRadians(90);
  } ); 
  mesh.material.map = road01;
  
  scene.add(mesh);
}



export function positionRoads(scene, loadingManager)
{
  createRoad01(scene, loadingManager);
  createRoad02(scene, loadingManager);
  createRoad03(scene, loadingManager);
  createRoad04(scene, loadingManager);
}


function onError() { };

function onProgress ( xhr, model ) {};

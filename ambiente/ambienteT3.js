import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {TeapotGeometry} from '../build/jsm/geometries/TeapotGeometry.js';
import {initRenderer, 
        createGroundPlane,
        createLightSphere,        
        onWindowResize, 
        degreesToRadians} from "../libs/util/util.js";
import {OBJLoader} from '../build/jsm/loaders/OBJLoader.js';
import {GLTFLoader} from '../build/jsm/loaders/GLTFLoader.js';
import {MTLLoader} from '../build/jsm/loaders/MTLLoader.js';
import {ConvexGeometry} from '../build/jsm/geometries/ConvexGeometry.js';

var scene = new THREE.Scene();    // Create main scene
var stats = new Stats();          // To show FPS information  var renderer = initRenderer();    // View function in util/utils
var renderer = initRenderer({antialias: true,
  preserveDrawingBuffer: true});    // View function in util/utils
  renderer.setClearColor("rgb(30, 30, 42)");
var mapSize = 50000;
var citySize = 1000;
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100000);
  camera.lookAt(0, 0, 0);
  camera.position.set(0.5*citySize, 0.4*citySize, 0.9*citySize);
  camera.up.set( 0, 1, 0 );

var ambientLight = new THREE.AmbientLight("rgb(255, 255, 255)");
scene.add(ambientLight);


/********************
  LIGHTING SETTINGS
*********************/
const hemLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 0.3 );
hemLight.castShadow = false;
scene.add(hemLight);  

//createLightSphere(scene,100,20,20,sunPos);

// Set angles of rotation
var angle = 0;
var speed = 0.01;
var animationOn = false; // control if animation is on or of

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls( camera, renderer.domElement );

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 1.5 );
  axesHelper.visible = false;
scene.add( axesHelper );





createSkybox(mapSize, 'yonder');
createGround();
positionSidewalks();
positionBuildings();
positionRoads();
loadCactusRandom(200, citySize*5);



render();


function createGround()
{
  //-- Scene Objects -----------------------------------------------------------
  // City Ground
  var planeGeometry = new THREE.PlaneGeometry(citySize, citySize);
  var planeMaterial = new THREE.MeshPhongMaterial({
      color: "rgba(150, 150, 150)",
      side: THREE.DoubleSide,
  });
  var groundPlane = new THREE.Mesh(planeGeometry, planeMaterial)
  groundPlane.rotateX(degreesToRadians(-90));
  groundPlane.position.set(0,1,0);
  groundPlane.receiveShadow = true;
  scene.add(groundPlane);

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
  scene.add(groundPlane3);
  //----------------------------------------------------------------------------
  //-- Use TextureLoader to load texture files
  var textureLoader = new THREE.TextureLoader();
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

  // Apply texture to the 'map' property of the respective materials' objects
  groundPlane.material.map = asphalt;
  groundPlane2.material.map = sand01;
}

function createSkybox(size, name)
{
  let materialArray = []; 
  
  let texture_ft = new THREE.TextureLoader().load( 'imgs/' + name + '_ft.jpg');
  let texture_bk = new THREE.TextureLoader().load( 'imgs/' + name + '_bk.jpg');
  let texture_up = new THREE.TextureLoader().load( 'imgs/' + name + '_up.jpg');
  let texture_dn = new THREE.TextureLoader().load( 'imgs/' + name + '_dn.jpg');
  let texture_rt = new THREE.TextureLoader().load( 'imgs/' + name + '_rt.jpg');
  let texture_lf = new THREE.TextureLoader().load( 'imgs/' + name + '_lf.jpg');
  


    
  materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf }));
    
  for (let i = 0; i < 6; i++)
    materialArray[i].side = THREE.BackSide;
    
  let skyboxGeo = new THREE.BoxGeometry( size, size, size);
  let skybox = new THREE.Mesh( skyboxGeo, materialArray );
  scene.add( skybox );
}

function createBuilding01(scale = 1.0, posx, posz)
{
  // Predio 1  
  let textureLoader = new THREE.TextureLoader();
  let size = scale*72;
  let bottomGeometry = new THREE.BoxGeometry(size, 1.8*size, size);
  let bottomMaterial = new THREE.MeshLambertMaterial();
  let bottom = new THREE.Mesh(bottomGeometry, bottomMaterial);
  bottom.castShadow = true;
  bottom.position.set(posx, 0.9*size, posz);
  scene.add(bottom);

  let wall01 = textureLoader.load('imgs/wall01.jpg', function ( wall01 ) {
    wall01.wrapS = wall01.wrapT = THREE.RepeatWrapping;
    wall01.offset.set( 0, 0 );
    wall01.repeat.set( 1, 2 )
    wall01.rotation = 0;
  } ); 
  bottom.material.map = wall01;

  let midGeometry = new THREE.BoxGeometry(size*1.1, size/20, size*1.1);
  let midMaterial = new THREE.MeshLambertMaterial({color: 0x909090});
  let mid = new THREE.Mesh(midGeometry, midMaterial);
  mid.castShadow = true;
  bottom.add(mid);
  

  let topGeometry = new THREE.BoxGeometry(size*1.1, size/20, size*1.1);
  let topMaterial = new THREE.MeshPhongMaterial({color: 0x909090});
  let top = new THREE.Mesh(topGeometry, topMaterial);
  top.castShadow = true;
  top.position.set(0, 0.9*size, 0);
  bottom.add(top);

  let asphalt2 = textureLoader.load('imgs/asphalt2.jpg', function ( asphalt2 ) {
    asphalt2.wrapS = asphalt2.wrapT = THREE.RepeatWrapping;
    asphalt2.minFilter = THREE.LinearMipMapLinearFilter;
    asphalt2.offset.set( 0, 0 );
    asphalt2.repeat.set( 8, 8 )
    asphalt2.rotation = 0;
  } ); 
  top.material.map = asphalt2;
  mid.material.map = asphalt2;
}

function createBuilding02(scale = 1.0, posx, posz, rotation = false)
{
  var size = 80*scale;
  // Predio 1  
  let textureLoader = new THREE.TextureLoader();

  let bottomGeometry = new THREE.BoxGeometry(size*1.5, 1.8*size, size);
  let bottomMaterial = new THREE.MeshLambertMaterial();
  let bottom = new THREE.Mesh(bottomGeometry, bottomMaterial);
  bottom.castShadow = true;
  bottom.position.set(posx, 0.9*size, posz);
  scene.add(bottom);
  if(rotation)
    bottom.rotateY(degreesToRadians(90));

  let wall01 = textureLoader.load('imgs/wall02.jpg', function ( wall01 ) {
    wall01.wrapS = wall01.wrapT = THREE.RepeatWrapping;
    wall01.offset.set( 0, 0);
    wall01.repeat.set( 1, 1 )
    wall01.rotation = 0;
  } ); 
  bottom.material.map = wall01;

  //top
  let topGeometry = new THREE.BoxGeometry(size*1.5*1.05, size/20, size*1.05);
  let topMaterial = new THREE.MeshLambertMaterial();
  let top = new THREE.Mesh(topGeometry, topMaterial);
  top.castShadow = true;
  top.position.set(0, 0.9*size, 0);
  bottom.add(top);

  let rooftop01 = textureLoader.load('imgs/rooftop01.jpg' );
  top.material.map = rooftop01;
}

function createBuilding03(scale = 1.0, posx, posz, rotation = false)
{
  var size = 100*scale;
  // Predio 1  
  let textureLoader = new THREE.TextureLoader();

  let bottomGeometry = new THREE.BoxGeometry(size, 2*size, size);
  let bottomMaterial = new THREE.MeshLambertMaterial();
  let bottom = new THREE.Mesh(bottomGeometry, bottomMaterial);
  bottom.castShadow = true;
  bottom.position.set(posx, size, posz);
  scene.add(bottom);

  let wall01 = textureLoader.load('imgs/wall06.jpg', function ( wall01 ) {
    wall01.wrapS = wall01.wrapT = THREE.RepeatWrapping;
    wall01.offset.set( 0, 0);
    wall01.repeat.set( 1, 2 )
    wall01.rotation = 0;
  } ); 
  bottom.material.map = wall01;
  if(rotation)
    bottom.rotateY(degreesToRadians(90));

  //top
  let topGeometry = new THREE.BoxGeometry(size, size/5, size);
  let topMaterial = new THREE.MeshLambertMaterial();
  let top = new THREE.Mesh(topGeometry, topMaterial);
  top.castShadow = true;
  bottom.add(top);
  top.position.set(0, 11*size/10, 0);
  let rooftop01 = textureLoader.load('imgs/brick.jpg', function ( rooftop01 ) {
    rooftop01.wrapS = rooftop01.wrapT = THREE.RepeatWrapping;
    rooftop01.offset.set( 0, 0);
    rooftop01.repeat.set( 4, 1 )
    rooftop01.rotation = 0;
  } ); 
  top.material.map = rooftop01;
  //top
  let topGeometry2 = new THREE.BoxGeometry(size*0.95, size/200, size*0.95);
  let topMaterial2 = new THREE.MeshLambertMaterial();
  let top2 = new THREE.Mesh(topGeometry2, topMaterial2);
  top2.castShadow = true;
  top.add(top2);
  top2.position.set(0, size/10 , 0);
  let rooftop02 = textureLoader.load('imgs/gravel02.jpg', function ( rooftop02 ) {
    rooftop02.wrapS = rooftop02.wrapT = THREE.RepeatWrapping;
    rooftop02.offset.set( 0, 0);
    rooftop02.minFilter = THREE.LinearMipMapLinearFilter;
    rooftop02.repeat.set( 15, 15 )
    rooftop02.rotation = 0;
  } ); 
  top2.material.map = rooftop02;
    

  // caixa dagua
  let modelName = 'ac';
  let modelPath = 'models/ac/'
  var manager = new THREE.LoadingManager( );

  var mtlLoader = new MTLLoader( manager );
  mtlLoader.setPath( modelPath );
  mtlLoader.load( 'ac.mtl', function ( materials ) 
  {
      materials.preload();
      var objLoader = new OBJLoader( manager );
      objLoader.setMaterials(materials);
      objLoader.setPath(modelPath);
      objLoader.load( modelName + ".obj", function ( obj ) 
      {
        obj.visible = true;
        obj.name = 'watertank';
        // Set 'castShadow' property for each children of the group
        obj.traverse( function (child)
        {
          child.castShadow = true;
        });

        obj.traverse( function( node )
        {
          if( node.material ) node.material.side = THREE.DoubleSide;
        });
        
        obj.position.set(-size/4,0,-size/4)
        obj.translateY(1);
        obj.scale.set(size/20,size/20,size/20);        

        top2.add ( obj );
      }, onProgress, onError );
    });    

}

function createBuilding04(scale = 1.0, posx, posz, height)
{
  var size = 80*scale; //ht = 1.8*size
  // Predio 1  
  let textureLoader = new THREE.TextureLoader();

  let bottomGeometry4 = new THREE.BoxGeometry(size*3.0, height, size);
  let bottomMaterial4 = new THREE.MeshLambertMaterial();
  let bottom4 = new THREE.Mesh(bottomGeometry4, bottomMaterial4);
  bottom4.castShadow = true;
  bottom4.position.set(posx, height/2, posz);
  scene.add(bottom4);

  bottom4.rotateY(degreesToRadians(90))

  let wall04 = textureLoader.load('imgs/wall04.jpg', function ( wall04 ) {
    wall04.wrapS = wall04.wrapT = THREE.RepeatWrapping;
    wall04.offset.set( 0, 0);
    wall04.repeat.set( 2, 1 )
    wall04.rotation = 0;
    
  } ); 
  bottom4.material.map = wall04;

  //front
  let frontGeometry = new THREE.CylinderGeometry( size/2, size/2, height*0.96 , 32,32 );
  let frontMaterial = new THREE.MeshLambertMaterial({color : 0xFAF0F0});
  let front = new THREE.Mesh(frontGeometry, frontMaterial);
  front.castShadow = true;
  bottom4.add(front);
  front.position.set(0, 0, size/2)
  let rooftop01 = textureLoader.load('imgs/wall06.jpg' );
  front.material.map = rooftop01;

  //front top top
  let fronttGeometry = new THREE.CylinderGeometry( size/1.80, size/1.80, size/10, 32,32 );
  let fronttMaterial = new THREE.MeshLambertMaterial();
  let frontt = new THREE.Mesh(fronttGeometry, fronttMaterial);
  frontt.castShadow = true;
  front.add(frontt);
  frontt.position.set(0, height/2 , 0)
  let rooftop02 = textureLoader.load('imgs/concrete01.jpg', function ( rooftop02 ) {
    rooftop02.wrapS = rooftop02.wrapT = THREE.RepeatWrapping;
    rooftop02.offset.set( 0, 0);
    rooftop02.repeat.set( 4, 4);
    rooftop02.rotation = 0;    
  } ); 
  frontt.material.map = rooftop02;

  //bottom top
  let bottomGeometry4t = new THREE.BoxGeometry(size*3.12, height/10, size);
  let bottomMaterial4t = new THREE.MeshLambertMaterial();
  let bottom4t = new THREE.Mesh(bottomGeometry4t, bottomMaterial4t);
  bottom4t.castShadow = true;
  bottom4t.position.set(0, 11*height/20, 0);
  let rooftop03 = textureLoader.load('imgs/concrete01.jpg', function ( rooftop03 ) {
    rooftop03.wrapS = rooftop03.wrapT = THREE.RepeatWrapping;
    rooftop03.offset.set( 0, 0);
    rooftop03.repeat.set( 8, 4);
    rooftop03.rotation = 0;    
  } );
  bottom4.add(bottom4t);
  bottom4t.material.map = rooftop03;
}

function createBuilding05(scale = 1.0, posx, posz)
{
  var size = 100*scale;
  // Predio 1  
  let textureLoader = new THREE.TextureLoader();
  let height = size*8/3
  let bottomGeometry = new THREE.BoxGeometry(size, height, size);
  let bottomMaterial = new THREE.MeshLambertMaterial();
  let bottom = new THREE.Mesh(bottomGeometry, bottomMaterial);
  bottom.castShadow = true;
  bottom.position.set(posx, height/2, posz);
  scene.add(bottom);

  let wall01 = textureLoader.load('imgs/wall07.jpg', function ( wall01 ) {
    wall01.wrapS = wall01.wrapT = THREE.RepeatWrapping;
    wall01.offset.set( 0, 0);
    wall01.repeat.set( 1, 2.5)
    wall01.rotation = 0;
  } ); 
  bottom.material.map = wall01;

  //top
  let topGeometry = new THREE.BoxGeometry(size, size/10, size);
  let topMaterial = new THREE.MeshLambertMaterial();
  let top = new THREE.Mesh(topGeometry, topMaterial);
  top.castShadow = true;
  bottom.add(top);
  top.position.set(0, height/2 + size/19, 0);
  let rooftop01 = textureLoader.load('imgs/asphalt.jpg', function ( rooftop01 ) {
    rooftop01.wrapS = rooftop01.wrapT = THREE.RepeatWrapping;
    rooftop01.offset.set( 0, 0);
    rooftop01.repeat.set( 5, 1 )
    rooftop01.rotation = 0;
  } ); 
  top.material.map = rooftop01;

  //dome
  let domeGeometry = new THREE.CylinderGeometry(size/6,size/6,size/2,50,50);
  let domeMaterial = new THREE.MeshLambertMaterial();
  let dome = new THREE.Mesh(domeGeometry, domeMaterial);

  dome.castShadow = true;
  top.add(dome);
  dome.position.set(0, size/4, 0);
  let drooftop01 = textureLoader.load('imgs/plate01.jpg', function ( drooftop01 ) {
    drooftop01.wrapS = rooftop01.wrapT = THREE.RepeatWrapping;
    drooftop01.offset.set( 0, 0);
    drooftop01.repeat.set( 2*Math.PI, 1 )
    drooftop01.rotation = 0;
  } ); 
  dome.material.map = drooftop01;
    

}

function createBuilding06(scale = 1.0, posx, posz, rotation = false)
{
  var size = 80*scale;
  // Predio 1  
  let textureLoader = new THREE.TextureLoader();

  let bottomGeometry = new THREE.BoxGeometry(size*1.5, 2.2*size, size);
  let bottomMaterial = new THREE.MeshLambertMaterial();
  let bottom = new THREE.Mesh(bottomGeometry, bottomMaterial);
  bottom.castShadow = true;
  bottom.position.set(posx, 1.1*size, posz);
  scene.add(bottom);

  let wall01 = textureLoader.load('imgs/wall08.jpg', function ( wall01 ) {
    wall01.wrapS = wall01.wrapT = THREE.RepeatWrapping;
    wall01.offset.set( 0, 0);
    wall01.repeat.set( 1, 1 )
    wall01.rotation = 0;
  } ); 
  bottom.material.map = wall01;
  if(rotation == true)
    bottom.rotateY(degreesToRadians(90));

  //top
  let topGeometry = new THREE.BoxGeometry(size*1.5*1.05, size/20, size*1.05);
  let topMaterial = new THREE.MeshLambertMaterial({color: 0x7A7A7A});
  let top = new THREE.Mesh(topGeometry, topMaterial);
  top.castShadow = true;
  top.position.set(0, 1.1*size, 0);
  bottom.add(top);

  let rooftop01 = textureLoader.load('imgs/rooftop01.jpg' );
  top.material.map = rooftop01;
}

function createBuilding07(scale = 1.0, posx, posz, rotation = false)
{
  var size = 80*scale;
  // Predio 1  
  let textureLoader = new THREE.TextureLoader();

  let bottomGeometry = new THREE.BoxGeometry(size*1.5, 2.0*size, size);
  let bottomMaterial = new THREE.MeshLambertMaterial();
  let bottom = new THREE.Mesh(bottomGeometry, bottomMaterial);
  bottom.castShadow = true;
  bottom.position.set(posx, 1.1*size, posz);
  scene.add(bottom);

  let wall01 = textureLoader.load('imgs/wall09.jpg', function ( wall01 ) {
    wall01.wrapS = wall01.wrapT = THREE.RepeatWrapping;
    wall01.offset.set( 0, 0);
    wall01.repeat.set( 1, 1 )
    wall01.rotation = degreesToRadians(180);
  } ); 
  bottom.material.map = wall01;
  if(rotation == true)
    bottom.rotateY(degreesToRadians(90));

  //top
  let topGeometry = new THREE.BoxGeometry(size*1.5*1.05, size/20, size*1.05);
  let topMaterial = new THREE.MeshLambertMaterial({color: 0x4B4B4B});
  let top = new THREE.Mesh(topGeometry, topMaterial);
  top.castShadow = true;
  top.position.set(0, 1.0*size, 0);
  bottom.add(top);

  let rooftop01 = textureLoader.load('imgs/rooftop01.jpg' );
  top.material.map = rooftop01;
}

function createBuilding08(scale = 1.0, posx, posz, rotation = false)
{
  var size = 100*scale;
  // Predio 1  
  let textureLoader = new THREE.TextureLoader();

  let bottomGeometry = new THREE.BoxGeometry(size, 2*size, size);
  let bottomMaterial = new THREE.MeshLambertMaterial();
  let bottom = new THREE.Mesh(bottomGeometry, bottomMaterial);
  bottom.castShadow = true;
  bottom.position.set(posx, size, posz);
  scene.add(bottom);

  let wall01 = textureLoader.load('imgs/wall10.jpg', function ( wall01 ) {
    wall01.wrapS = wall01.wrapT = THREE.RepeatWrapping;
    wall01.offset.set( 0, 0);
    wall01.repeat.set( 1, 2 )
    wall01.rotation = 0;
  } ); 
  bottom.material.map = wall01;
  if(rotation)
    bottom.rotateY(degreesToRadians(90));

  //top
  let topGeometry = new THREE.BoxGeometry(size, size/5, size);
  let topMaterial = new THREE.MeshLambertMaterial({color : 0x9B9B9B});
  let top = new THREE.Mesh(topGeometry, topMaterial);
  top.castShadow = true;
  bottom.add(top);
  top.position.set(0, 11*size/10, 0);
  let rooftop01 = textureLoader.load('imgs/brick.jpg', function ( rooftop01 ) {
    rooftop01.wrapS = rooftop01.wrapT = THREE.RepeatWrapping;
    rooftop01.offset.set( 0, 0);
    rooftop01.repeat.set( 4, 1 )
    rooftop01.rotation = 0;
  } ); 
  top.material.map = rooftop01;
  //top
  let topGeometry2 = new THREE.BoxGeometry(size*0.95, size/200, size*0.95);
  let topMaterial2 = new THREE.MeshLambertMaterial({color : 0x6B6B6B});
  let top2 = new THREE.Mesh(topGeometry2, topMaterial2);
  top2.castShadow = true;
  top.add(top2);
  top2.position.set(0, size/10 , 0);
  let rooftop02 = textureLoader.load('imgs/gravel02.jpg', function ( rooftop02 ) {
    rooftop02.wrapS = rooftop02.wrapT = THREE.RepeatWrapping;
    rooftop02.minFilter = THREE.NearestMipmapLinearFilter;
    rooftop02.offset.set( 0, 0);
    rooftop02.repeat.set( 20, 20 )
    rooftop02.rotation = 0;
  } ); 
  top2.material.map = rooftop02;
    
}

function createFactory(scale = 1.0, posx, posz)
{
  var size = 80*scale;
  // bottom 
  let textureLoader = new THREE.TextureLoader();

  let bottomGeometry = new THREE.BoxGeometry(size*2.4, size, size*2);
  let bottomMaterial = new THREE.MeshLambertMaterial();
  let bottom = new THREE.Mesh(bottomGeometry, bottomMaterial);
  bottom.castShadow = true;
  bottom.position.set(posx, 0.5*size, posz);
  scene.add(bottom);

  let wall01 = textureLoader.load('imgs/brick02.jpg', function ( wall01 ) {
    wall01.wrapS = wall01.wrapT = THREE.RepeatWrapping;
    wall01.offset.set( 0, 0);
    wall01.repeat.set( 3, 1 )
    wall01.rotation = 0;
  } ); 
  bottom.material.map = wall01;

  //bottom top
  
  let bottomGeometry4t = new THREE.BoxGeometry(size*2.5, size/10, size*2.08);
  let bottomMaterial4t = new THREE.MeshLambertMaterial();
  let bottom4t = new THREE.Mesh(bottomGeometry4t, bottomMaterial4t);
  bottom4t.castShadow = true;
  bottom4t.position.set(0, 11*size/20, 0);
  let rooftop03 = textureLoader.load('imgs/brick.jpg', function ( rooftop03 ) {
    rooftop03.wrapS = rooftop03.wrapT = THREE.RepeatWrapping;
    rooftop03.offset.set( 0, 0);
    rooftop03.repeat.set( 20, 0.5);    
  } );
  bottom.add(bottom4t);
  bottom4t.material.map = rooftop03;



  // inclined roof
  let incRoofGeometry = new THREE.BoxGeometry(1.2*size/Math.sqrt(3.0), size/80, 2*size);
  let incRoofMaterial = new THREE.MeshBasicMaterial();
  for(let i = 0; i < 4; i++)
  {
    let incRoof = new THREE.Mesh(incRoofGeometry, incRoofMaterial);
    incRoof.castShadow = true;
    incRoof.position.set(-0.9*size + (0.6*size)*i, 0 , 0)
    incRoof.translateY(0.3*size/Math.sqrt(3) + size/40)
    incRoof.rotateZ(degreesToRadians(-30))
    bottom4t.add(incRoof);

    let roof = textureLoader.load('imgs/metalroof.jpg', function ( roof ) {
      roof.wrapS = roof.wrapT = THREE.RepeatWrapping;
      roof.offset.set( 0, 0);
      roof.repeat.set( 1, 5);  
      roof.rotation = degreesToRadians(90);
    } );   
    
    incRoof.material.map = roof;
  }
  // windows
  let windowGeometry = new THREE.BoxGeometry(0.6*size/Math.sqrt(3.0), size/20, 2*size);
  let windowMaterial = new THREE.MeshBasicMaterial({color : 0x8A8A8A});
  for(let i = 0; i < 4; i++)
  {
    let window = new THREE.Mesh(windowGeometry, windowMaterial);
    window.castShadow = true;
    window.rotateZ(degreesToRadians(90))
    window.position.set(-1.2*size + (0.6*size)*i - size/50, size/40 + 0.3*size/Math.sqrt(3) , 0);
    let roof = textureLoader.load('imgs/window01.jpg', function ( roof ) {
      roof.wrapS = roof.wrapT = THREE.RepeatWrapping;
      roof.offset.set( 0, 0);
      roof.repeat.set( 5, 1);  
      roof.rotation = degreesToRadians(-90);
    } );       
    window.material.map = roof;
    
    bottom4t.add(window);
  }

}

function createSideWalk(posx, posz, sizex, sizez)
{
  let textureLoader = new THREE.TextureLoader();
  let sidewalkGeometry = new THREE.BoxGeometry(sizex, citySize/300, sizez);
  let sidewalkMaterial = new THREE.MeshLambertMaterial();
  let sidewalk = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
  sidewalk.castShadow = true;
  sidewalk.receiveShadow = true;
  sidewalk.position.set(posx, 3 , posz);
  scene.add(sidewalk);

  let wall01 = textureLoader.load('imgs/pavement01.jpg', function ( wall01 ) {
    wall01.wrapS = wall01.wrapT = THREE.RepeatWrapping;
    wall01.offset.set( 0, 0);
    wall01.repeat.set( 0.04*sizex, 0.04*sizez)
    wall01.rotation = 0;
  } ); 
  sidewalk.material.map = wall01;
}

function positionSidewalks()
{
  createSideWalk(  260, -257,  460, 486);
  createSideWalk( -138, -257,  216, 486);
  createSideWalk( -392, -257,  216, 486);
  createSideWalk( -392,  125,  216, 222);
  createSideWalk( -392,  385,  216, 222);
  createSideWalk( -138,  125,  216, 222);
  createSideWalk( -138,  385,  216, 222);
  createSideWalk(  260,  125,  460, 222);
  createSideWalk(  260,  385,  460, 222);
}

function positionBuildings()
{
  createFactory(1.5, 350, -350);

  //quarteirao 01
  createBuilding01(1.0, -451, 77);
  createBuilding02(0.8, -341, 77);
  createBuilding03(1.0, -451, 173);
  createBuilding01(1.2, -340, 173);

  //quarteirao 02
  createBuilding05(1.0, -91, 173);
  createBuilding01(1.0, -184, 77);
  createBuilding03(0.7, -184, 173);
  createBuilding02(0.7, -91, 77);

  //quarteirao 03
  createBuilding08(1.0, -451, 332, true);
  createBuilding01(1.0, -341, 332);
  createBuilding06(0.7, -451, 443);
  createBuilding02(0.7, -341, 440, true);

  //quarteirao 04
  createBuilding03(1.0, -185, 442);
  createBuilding01(1.0, -185, 332);
  createBuilding06(0.7, -91, 442, true);
  createBuilding02(0.7, -92, 332);

  //quarteirao 05
  createBuilding06(1.0, 126, 77);
  createBuilding01(1.0, 99, 173);
  createBuilding07(1.0, 270, 77);
  createBuilding02(1.0, 233, 173);
  createBuilding01(1.3, 433, 125);

  //quarteirao 06
  createBuilding07(1.2, 99, 385, true);
  createBuilding08(1.0, 260, 442, true);
  createBuilding05(0.7, 318, 332, true);
  createBuilding02(1.2, 404, 385, true);

  //quarteirao 07
  createBuilding04(1.0, -138, -196,200);
  createBuilding03(1.0, -120, -409);

  //quarteirao 08
  createBuilding02(0.8, -451, -75);
  createBuilding08(0.8, -333, -72);
  createBuilding06(1.5, -333, -257, true);
  createBuilding05(0.9, -421, -408);
}

function loadCactusRandom(numTrees, mapSize,proportionalScale = 3)
{
  var cactusModels = ['cactus01','cactus02','cactus03','cactus04'];
  var modelPath = '../assets/objects/';
  
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

    var loader = new GLTFLoader( );
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

    scene.add ( obj );
    obj.translateX(treePosition.x);
    obj.translateY(treePosition.y);
    obj.translateZ(treePosition.z);

    obj.rotateOnAxis(new THREE.Vector3(0,1,0),  treeRotation );    

    obj.scale.set(randscale*(proportionalScale - 1)*1.3, randscale*proportionalScale, randscale*proportionalScale*1.3);

    //obj.position.set(treePosition);
    
    }, onProgress, onError); 
  }
}

function createRoad01()
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

  let textureLoader = new THREE.TextureLoader();
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

function createRoad02()
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

  let textureLoader = new THREE.TextureLoader();
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

function createRoad03()
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

  let textureLoader = new THREE.TextureLoader();
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

function createRoad04()
{
  let textureLoader = new THREE.TextureLoader();

  let bottomGeometry = new THREE.BoxGeometry(229, 5, 28);
  let bottomMaterial = new THREE.MeshLambertMaterial();
  let bottom = new THREE.Mesh(bottomGeometry, bottomMaterial);
  bottom.castShadow = true;
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


function createArea01()
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

  let textureLoader = new THREE.TextureLoader();
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



function positionRoads()
{
  createRoad01();
  createRoad03();
}


function onError() { };

function onProgress ( xhr, model ) {};


function render()
{
  trackballControls.update();
  requestAnimationFrame(render);
  renderer.render(scene, camera)
}

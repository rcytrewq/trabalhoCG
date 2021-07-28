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
} from "./planeParts.js";
import { rotatePropeller, keyboardUpdate, movement } from "./animations.js";


/********************
        SCENE
*********************/
var stats = new Stats(); // To show FPS information

// Create main scene
var scene = new THREE.Scene();    // Create main scene
scene.background = new THREE.Color('rgb(10,10,50)');


// Create main scene
var sceneInsp = new THREE.Scene();    // Create main scene
sceneInsp.background = new THREE.Color('rgb(100,100,100)');

// Map size
var mapSize = 70000;

// To use the keyboard
var keyboard2 = new KeyboardState();

var simulationMode = true;
var cockpitMode = false;

/********************
  RENDER SETTINGS
*********************/
var renderer = initRenderer(); 
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.antialias = true;



/********************
  LIGHTING SETTINGS
*********************/
const hemLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 0.3 );
hemLight.castShadow = false;
scene.add(hemLight);  

var sunPos = new THREE.Vector3(mapSize*0.53,mapSize*0.67,mapSize*1.3);
var dirLight = setDirectionalLighting(sunPos,0.9);
dirLight.castShadow = true;
scene.add(dirLight);
createLightSphere(scene,100,20,20,sunPos);
initDefaultBasicLight(sceneInsp);

/********************
  CAMERA SETTINGS
*********************/

var originVec = new THREE.Vector3( 0.0, 0.0, 0.0 );
var upVec = new THREE.Vector3( 0.0, 1.0, 0.0 );
var vcWidth = 400; // virtual camera width
var vcHeidth = 300; // virtual camera height
var virtualCameraI = new THREE.PerspectiveCamera(60, vcWidth/vcHeidth, 1.0, mapSize*5);

virtualCameraI.lookAt(originVec);
virtualCameraI.position.set(0,20 ,-50);
  
virtualCameraI.up = upVec;


/*****************************************/

// Main camera
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000000);
  camera.lookAt(0, 0, 0.2);
  camera.position.set(-10000,10000,200)
  camera.up.set( 0,1, 0, );
/********************************* */

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls(camera, renderer.domElement );

// Show world axes
var axesHelper = new THREE.AxesHelper( 1000000 );
scene.add( axesHelper );
sceneInsp.add(axesHelper);
// create first cube
var cubeGeometry = new THREE.BoxGeometry(1000, 1000, 1000);
var cubeMaterial = new THREE.MeshBasicMaterial({wireframe:false, transparent:true, opacity:0.0});
var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
// position the first cube
cube.position.set(0.0, 1000, 0);
// add the fisrt cube to the scene
scene.add(cube);

cube.add(virtualCameraI);

///////////////////////////////////////////////////////////////////////////////
///////////////////////////// AIRPLANE ASSEMBLY ///////////////////////////////
///////////////////////////////////////////////////////////////////////////////

var airplane = createFuselage(cube);
var propeller = createPropeller(cube);
propeller.position.set(0, 23.5, 0);
airplane.add(propeller);

var leftwing = createWings().leftWing;
var rightwing = createWings().rightWing;
leftwing.position.set(-4, 2, 0);
leftwing.rotateY(degreesToRadians(7));
rightwing.position.set(4, 2, 0);
rightwing.rotateY(degreesToRadians(-7));

var leftaileron = createAileron();
var rightaileron = createAileron();
leftaileron.position.set(13, -2.5, 0);
leftaileron.rotateZ(degreesToRadians(9));
leftwing.add(leftaileron);

rightaileron.position.set(13, -2.5, 0);
rightaileron.rotateZ(degreesToRadians(9));
rightwing.add(rightaileron);
airplane.add(leftwing);
airplane.add(rightwing);

var cockpit = createCockpit(cube);
cockpit.position.set(0, 8, 5);
airplane.add(cockpit);

var stabilizer = createStabilizer(cube);
stabilizer.position.set(0.5, -17.065, 3.5);
airplane.add(stabilizer);

var leftelevator = createElevator();
var rightelevator = createElevator();
leftelevator.rotateZ(degreesToRadians(-9));
leftelevator.position.set(-8, -0.75, 1);
stabilizer.add(leftelevator);

rightelevator.rotateZ(degreesToRadians(9));
rightelevator.position.set(7, -0.75, 1);
stabilizer.add(rightelevator);

var rudder = createElevator();
rudder.rotateY(degreesToRadians(90));
rudder.rotateZ(degreesToRadians(-2));
rudder.position.set(-0.5, -3, 2.5);
stabilizer.add(rudder);
airplane.position.set(0, 0, 9.6);

var frontLandingGear = createLandingGear();
var leftLandingGear = createLandingGear();
var rightLandingGear = createLandingGear();

frontLandingGear.position.set(0, 8, -4);
frontLandingGear.rotateX(degreesToRadians(15));
airplane.add(frontLandingGear);

leftLandingGear.position.set(-2, -8, -4);
leftLandingGear.rotateX(degreesToRadians(-15));
leftLandingGear.rotateZ(degreesToRadians(-15));
airplane.add(leftLandingGear);

rightLandingGear.position.set(2, -8, -4);
rightLandingGear.rotateX(degreesToRadians(-15));
rightLandingGear.rotateZ(degreesToRadians(15));
airplane.add(rightLandingGear);

// airplane.rotateZ(degreesToRadians(-90));
// airplane.rotateY(degreesToRadians(-90));
airplane.rotateX(degreesToRadians(-90));
airplane.rotateZ(degreesToRadians(180));
airplane.translateY(50);
// airplane.translateZ(-50);

///////////////////////////////////////////////////////////////////////////////
///////////////////////////// AIRPLANE ASSEMBLY ///////////////////////////////
///////////////////////////////////////////////////////////////////////////////

var airplaneInspection = createFuselage(sceneInsp);
var propeller2 = createPropeller(cube);
propeller2.position.set(0, 23.5, 0);
airplaneInspection.add(propeller2);

var leftwing2 = createWings().leftWing;
var rightwing2 = createWings().rightWing;
leftwing2.position.set(-4, 2, 0);
leftwing2.rotateY(degreesToRadians(7));
rightwing2.position.set(4, 2, 0);
rightwing2.rotateY(degreesToRadians(-7));

var leftaileron2 = createAileron();
var rightaileron2 = createAileron();
leftaileron2.position.set(13, -2.5, 0);
leftaileron2.rotateZ(degreesToRadians(9));
leftwing2.add(leftaileron2);

rightaileron2.position.set(13, -2.5, 0);
rightaileron2.rotateZ(degreesToRadians(9));
rightwing2.add(rightaileron);
airplaneInspection.add(leftwing2);
airplaneInspection.add(rightwing2);

var cockpit2 = createCockpit(cube);
cockpit2.position.set(0, 8, 5);
airplaneInspection.add(cockpit2);

var stabilizer2 = createStabilizer(cube);
stabilizer2.position.set(0.5, -17.065, 3.5);
airplaneInspection.add(stabilizer2);

var leftelevator2 = createElevator();
var rightelevator2 = createElevator();
leftelevator2.rotateZ(degreesToRadians(-9));
leftelevator2.position.set(-8, -0.75, 1);
stabilizer2.add(leftelevator2);

rightelevator2.rotateZ(degreesToRadians(9));
rightelevator2.position.set(7, -0.75, 1);
stabilizer2.add(rightelevator2);

var rudder2 = createElevator();
rudder2.rotateY(degreesToRadians(90));
rudder2.rotateZ(degreesToRadians(-2));
rudder2.position.set(-0.5, -3, 2.5);
stabilizer2.add(rudder2);
airplaneInspection.position.set(0, 0, 9.6);

var frontLandingGear2 = createLandingGear();
var leftLandingGear2 = createLandingGear();
var rightLandingGear2 = createLandingGear();

frontLandingGear2.position.set(0, 8, -4);
frontLandingGear2.rotateX(degreesToRadians(15));
airplaneInspection.add(frontLandingGear);

leftLandingGear2.position.set(-2, -8, -4);
leftLandingGear2.rotateX(degreesToRadians(-15));
leftLandingGear2.rotateZ(degreesToRadians(-15));
airplaneInspection.add(leftLandingGear2);

rightLandingGear2.position.set(2, -8, -4);
rightLandingGear2.rotateX(degreesToRadians(-15));
rightLandingGear2.rotateZ(degreesToRadians(15));
airplaneInspection.add(rightLandingGear2);

// airplane.rotateZ(degreesToRadians(-90));
// airplane.rotateY(degreesToRadians(-90));
airplaneInspection.rotateX(degreesToRadians(-90));
airplaneInspection.rotateZ(degreesToRadians(180));
airplaneInspection.translateY(50);
// airplane.translateZ(-50);

cube.add(virtualCameraI);



sceneInsp.add(airplaneInspection);
airplaneInspection.scale.set(200,200,200);
airplaneInspection.visibile= false;

//-------------------------------------------------------------------------------
// Setting virtual camera
//-------------------------------------------------------------------------------
var lookAtVec2 = new THREE.Vector3( 0.0, 0.0, 70.0 );
var upVec2 = new THREE.Vector3( 0.0, 0.0, 1.0 );
var vcWidth2 = 400; // virtual camera width
var vcHeidth2 = 300; // virtual camera height
var virtualCamera = new THREE.PerspectiveCamera(45, vcWidth2/vcHeidth2, 1.0, mapSize);
virtualCamera.lookAt(lookAtVec2);
virtualCamera.position.set(0,20 ,-50);
  
virtualCamera.up = upVec2;

// Create helper for the virtual camera
const cameraHelper = new THREE.CameraHelper(virtualCamera);
cube.add(cameraHelper);
cube.add(virtualCamera);

var lookAtVec3 = new THREE.Vector3( 0,10,0 );
var upVec3 = new THREE.Vector3( 0.0, 1.0, 1.0 );

var virtualCameraPilot = new THREE.PerspectiveCamera(45, vcWidth2/vcHeidth2, 1.0, 1000000);
virtualCameraPilot.lookAt(lookAtVec3);
virtualCameraPilot.position.set(0,-5 ,10);
  
virtualCameraPilot.up = upVec3;


airplane.add(virtualCameraPilot);

// Create helper for the virtual camera
const cameraHelperPilot = new THREE.CameraHelper(virtualCameraPilot);
airplane.add(cameraHelperPilot);

function updateCamera2(){
  //-- Update virtual camera position --
  virtualCamera.lookAt(lookAtVec2);        // Update camera position
  virtualCamera.updateProjectionMatrix(); // Necessary when updating FOV angle         
  cameraHelper.update();    

}


cube.scale.set(200,200,200);
cube.translateY(1850);
cube.position.set(1.1*mapSize, cube.position.y, -1.35*mapSize);

function createCheckPoint(vec){
  
  const torusGeometry = new THREE.TorusGeometry( 3000, 500, 32, 200 );
  const torusMaterial = new THREE.MeshPhongMaterial( {
        transparent:true,
        opacity: 0.49,
        depthTest: true,
        depthWrite: true,
        alphaTest: 0,
        visible: true,
        side: THREE.frontSide,
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


function createVectors(){
  var airplaneInitialPosition = new THREE.Vector3(1.1*mapSize, 2200,-mapSize);
  var vectors = [];
  var numberOfPoints = 13;

  vectors.push(airplaneInitialPosition);
  for (let point = 0; point < numberOfPoints-1; point++) {
    var x = getRandomInt(-70000, 70000);
    var y = getRandomInt(10000, 30000);
    var z = getRandomInt(-70000, 70000);
    var vector = new THREE.Vector3(x, y, z);
    vectors.push(vector);
    
  }
  vectors.push(airplaneInitialPosition);
  return vectors
}
 var pointsPositions = createVectors();

var checkPointsPositions = pointsPositions;



var checkpoints = checkPointsPositions.map(x => createCheckPoint(x));
for (var i=0; i<checkpoints.length; i++){
  if (i != checkpoints.length-1){
    checkpoints[i].rotateY((Math.asin( (checkpoints[i+1].position.y - checkpoints[i].position.y)/(Math.sqrt(Math.pow((checkpoints[i+1].position.y - checkpoints[i].position.y), 2 ) + Math.pow( (checkpoints[i+1].position.x - checkpoints[i].position.x), 2 )  )) )));
  }
  scene.add(checkpoints[i]);
}
for (i=1; i<checkpoints.length; i++){
  checkpoints[i].visible= false;
}

//Create a closed wavey loop
const curve = new THREE.CatmullRomCurve3( checkPointsPositions);
const points = curve.getPoints( 250 );
const geometry = new THREE.BufferGeometry().setFromPoints( points );
const material = new THREE.LineBasicMaterial( { color : 0xff0000, linewidth: 2} );

// Create the final object to add to the scene
const curveObject = new THREE.Line( geometry, material );
scene.add(curveObject);


var atual = 0;
function namefunction(atual){
  var clock = new THREE.Clock();
  if (cube.position.x >= checkPointsPositions[atual].x-5000 && cube.position.x <=checkPointsPositions[atual].x + 5000){

    if (cube.position.y >= checkPointsPositions[atual].y - 5000 && cube.position.y <= checkPointsPositions[atual].y + 5000){
      
      if (cube.position.z + 8000>=checkPointsPositions[atual].z - 5000 && cube.position.z + 8000 <= checkPointsPositions[atual].z + 5000){
        
        checkpoints[atual].visible=  false;
        checkpoints[atual+1].visible = true;
        
        if (atual == 0) clock.start();
        if (atual == checkpoints.length - 1) clock.stop();
        atual+=1;
      }
    }
  }
  return atual;
}


/********************
  BASE PLANE PLACEMENT
*********************/

loadBasePlane(mapSize);

/********************
  MOUNTAIN PLACEMENT
*********************/

loadMountains(mapSize);

/********************
  RANDOM TREE PLACEMENT
*********************/

var numTrees = 150;
loadCactusRandom(numTrees,mapSize);

/********************
  RENDERING
*********************/

//updateCamera();
render();

/************************************************************************************************************************/

/********************
  IMPORTING
*********************/

function loadCactusRandom(numTrees, mapSize)
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
    obj.translateY(-1000);
    //obj.position.set(treePosition);
    
    }, onProgress, onError);

  }
}

function loadMountains(mapSize)
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
    obj.translateY(-1200);

    obj.scale.set(sizeAdjust*mountainScale,sizeAdjust*mountainScale,sizeAdjust*mountainScale);
  }, onProgress, onError);
 
  }
}

function loadBasePlane(mapSize)
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
  

  obj.scale.set(basePlaneScale,basePlaneScale/5,basePlaneScale);
  obj.translateY(-1000);
}, onProgress, onError);


}

function loadGLTFFile(modelPath, modelName, visibility, desiredScale, myObj)
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

function onError() { };

function onProgress ( xhr, model ) {
    if ( xhr.lengthComputable ) {
      var percentComplete = xhr.loaded / xhr.total * 100;

    }
}

function normalizeAndRescale(obj, newScale)
{
  var scale = getMaxSize(obj); // Available in 'utils.js'
  obj.scale.set(newScale * (1.0/scale),
                newScale * (1.0/scale),
                newScale * (1.0/scale));
  return obj;
}

function fixPosition(obj)
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

function setDirectionalLighting(position,intensity)
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

/********************
  CAMERA AND RENDERING
*********************/

function updateCamera(){
  //-- Update virtual camera position --
  virtualCameraI.position.set(mapSize*1.5,mapSize,-mapSize*0.9)  
  virtualCameraI.lookAt(originVec);   
     
}

function controlledRender(){
  var width = window.innerWidth;
  var height = window.innerHeight;

  // Set main viewport
  renderer.setViewport(0, 0, width, height); // Reset viewport    
  renderer.setScissorTest(false); // Disable scissor to paint the entire window
  renderer.setClearColor("rgb(80, 70, 170)");    
  renderer.clear();   // Clean the window
  renderer.render(scene, virtualCamera);  
}

function controlledRenderCockpit(){
  var width = window.innerWidth;
  var height = window.innerHeight;

  // Set main viewport
  renderer.setViewport(0, 0, width, height); // Reset viewport    
  renderer.setScissorTest(false); // Disable scissor to paint the entire window
  renderer.setClearColor("rgb(80, 70, 170)");    
  renderer.clear();   // Clean the window
  renderer.render(scene, virtualCameraPilot);   

  // // Set virtual camera viewport 
  // var offset = 20; 
  // renderer.setViewport(25, 500, 300, 300);  // Set virtual camera viewport  
  // renderer.setScissor(25, 500, 300, 300); // Set scissor with the same size as the viewport
  // renderer.setScissorTest(true); // Enable scissor to paint only the scissor are (i.e., the small viewport)
  // renderer.setClearColor("rgb(60, 50, 150)");  // Use a darker clear color in the small viewport 
  // renderer.clear(); // Clean the small viewport
  // renderer.render(scene, camera);  // Render scene of the virtual camera
}

function controlledRenderInspection(){
  var width = window.innerWidth;
  var height = window.innerHeight;

  // Set main viewport
  renderer.setViewport(0, 0, width, height); // Reset viewport    
  renderer.setScissorTest(false); // Disable scissor to paint the entire window
  renderer.setClearColor("rgb(80, 70, 170)");    
  renderer.clear();   // Clean the window
  renderer.render(sceneInsp, camera);   
}




function renderSimulation(){
  
  airplane.visible = true;
  airplaneInspection.visible = false;
  renderer.clear();
  stats.update();
  scene.background = new THREE.Color("rgb(220,220,220)");
  axesHelper.visible = true;
  var infoOnScreen = new InfoBox2();
  trackballControls.update();
  controlledRender();
  rotatePropeller(propeller);
  var output = keyboardUpdate(cube, airplane);
  movement(
    airplane,
    leftelevator,
    rightelevator,
    leftaileron,
    rightaileron,
    rudder,
    camera,
    cube
  );
  atual = namefunction(atual);
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

function renderSimulationCockpit(){
  
  airplane.visible = true;
  airplaneInspection.visible = false;
  renderer.clear();
  stats.update();
  scene.background = new THREE.Color("rgb(220,220,220)");
  axesHelper.visible = true;
  var infoOnScreen = new InfoBox2();
  trackballControls.update();
  controlledRenderCockpit();
  rotatePropeller(propeller);
  var output = keyboardUpdate(cube, airplane);
  movement(
    airplane,
    leftelevator,
    rightelevator,
    leftaileron,
    rightaileron,
    rudder,
    camera,
    cube
  );
  atual = namefunction(atual);
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

function renderInspection(){
  
  
  airplane.visible = false;
  airplaneInspection.visible = true;
  
  renderer.clear();
  stats.update();
  scene.background = new THREE.Color("rgb(220,220,220)");
  
  axesHelper.visible = true;
  var infoOnScreen = new InfoBox2();
  trackballControls.update();
  controlledRenderInspection();
  rotatePropeller(propeller2);
  var output = keyboardUpdate(cube, airplane);
  
  
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

function keyboardCommands(){
  keyboard2.update();
  
  if (keyboard2.down("C") && simulationMode){
    cockpitMode = !cockpitMode;
    
  }
  if (keyboard2.down("enter") && simulationMode){
    curveObject.visible = !curveObject.visible;
    
  }
  if (keyboard2.down("space")){
    camera.lookAt(0, 0, 0.2);
    camera.position.set(-10000,10000,200)
    camera.up.set( 0,1, 0, );
    simulationMode = !simulationMode;
    
  }
  
}

function render()
{
  keyboardCommands();
  if (simulationMode) {
    cockpitMode ? renderSimulationCockpit() : renderSimulation();
  } else {
    renderInspection();
  }
}
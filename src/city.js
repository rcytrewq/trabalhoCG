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
import {MTLLoader} from '../build/jsm/loaders/MTLLoader.js';


var mapSize = 50000;
var citySize = 1000;

// Set angles of rotation
var angle = 0;
var speed = 0.01;
var animationOn = false; // control if animation is on or of


// City Ground
export function cityGround (scene){
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


  // Outside Ground
  var planeGeometry2 = new THREE.PlaneGeometry(mapSize, mapSize);
  var planeMaterial2 = new THREE.MeshBasicMaterial({
      color: "rgba(150, 150, 150)",
      side: THREE.DoubleSide,
  });
  var groundPlane2 = new THREE.Mesh(planeGeometry2, planeMaterial2)
  groundPlane2.rotateX(degreesToRadians(-90));
  groundPlane2.position.set(0,-20,0)
  groundPlane2.castShadow = true;  
  groundPlane2.receiveShadow = true;  
  scene.add(groundPlane2);
}


//-- Use TextureLoader to load texture files
var textureLoader = new THREE.TextureLoader();
var floor  = textureLoader.load('../assets/textures/floor-wood.jpg');
var glass  = textureLoader.load('../assets/textures/glass.png');
var stone = textureLoader.load('../assets/textures/stone.jpg');
var sun = textureLoader.load('../assets/textures/sun.jpg');
var asphalt = textureLoader.load('imgs/asphalt03.jpg', function ( asphalt ) {
  asphalt.wrapS = asphalt.wrapT = THREE.RepeatWrapping;
  asphalt.offset.set( 0, 0 );
  asphalt.repeat.set( 100, 100 )
  asphalt.rotation = 0;
} ); 



export function createSkybox(size, name, scene, loadingManager)
{
  let materialArray = []; 
  
  let texture_ft = new THREE.TextureLoader(loadingManager).load( 'imgs/' + name + '_ft.jpg');
  let texture_bk = new THREE.TextureLoader(loadingManager).load( 'imgs/' + name + '_bk.jpg');
  let texture_up = new THREE.TextureLoader(loadingManager).load( 'imgs/' + name + '_up.jpg');
  let texture_dn = new THREE.TextureLoader(loadingManager).load( 'imgs/' + name + '_dn.jpg');
  let texture_rt = new THREE.TextureLoader(loadingManager).load( 'imgs/' + name + '_rt.jpg');
  let texture_lf = new THREE.TextureLoader(loadingManager).load( 'imgs/' + name + '_lf.jpg');
  


    
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
  scene.add ( skybox );
}



function createBuilding01(scale = 1.0, posx, posz, scene, loadingManager)
{
  // Predio 1  
  let textureLoader = new THREE.TextureLoader(loadingManager);
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
  mid.receiveShadow = true; 
  bottom.add(mid);
  

  let topGeometry = new THREE.BoxGeometry(size*1.1, size/20, size*1.1);
  let topMaterial = new THREE.MeshPhongMaterial({color: 0x909090});
  let top = new THREE.Mesh(topGeometry, topMaterial);
  top.castShadow = true;  
  top.receiveShadow = true; 
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

function createBuilding02(scale = 1.0, posx, posz, scene, loadingManager, rotation = false)
{
  var size = 80*scale;
  // Predio 1  
  let textureLoader = new THREE.TextureLoader(loadingManager);

  let bottomGeometry = new THREE.BoxGeometry(size*1.5, 1.8*size, size);
  let bottomMaterial = new THREE.MeshLambertMaterial();
  let bottom = new THREE.Mesh(bottomGeometry, bottomMaterial);
  bottom.castShadow = true;  
  bottom.receiveShadow = true; 
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
  top.receiveShadow = true; 
  top.position.set(0, 0.9*size, 0);
  bottom.add(top);

  let rooftop01 = textureLoader.load('imgs/rooftop01.jpg' );
  top.material.map = rooftop01;
}

function createBuilding03(scale = 1.0, posx, posz, scene, loadingManager, rotation = false)
{
  var size = 100*scale;
  // Predio 1  
  let textureLoader = new THREE.TextureLoader(loadingManager);

  let bottomGeometry = new THREE.BoxGeometry(size, 2*size, size);
  let bottomMaterial = new THREE.MeshLambertMaterial();
  let bottom = new THREE.Mesh(bottomGeometry, bottomMaterial);
  bottom.castShadow = true;
  bottom.receiveShadow = true; 
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
  top.receiveShadow = true; 
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
  top2.receiveShadow = true; 
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
  let modelName = 'watertank';
  let modelPath = 'models/watertank/'
  var manager = new THREE.LoadingManager( );

  var mtlLoader = new MTLLoader( loadingManager );
  mtlLoader.setPath( modelPath );
  mtlLoader.load( 'watertank.mtl', function ( materials ) 
  {
      materials.preload();
      var objLoader = new OBJLoader( loadingManager );
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
          child.receiveShadow = true; 
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



function createBuilding04(scale = 1.0, posx, posz, height, scene, loadingManager)
{
  var size = 80*scale; //ht = 1.8*size
  // Predio 1  
  let textureLoader = new THREE.TextureLoader(loadingManager);

  let bottomGeometry4 = new THREE.BoxGeometry(size*3.0, height, size);
  let bottomMaterial4 = new THREE.MeshLambertMaterial();
  let bottom4 = new THREE.Mesh(bottomGeometry4, bottomMaterial4);
  bottom4.castShadow = true;
  bottom4.receiveShadow = true; 
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
  front.receiveShadow = true; 
  bottom4.add(front);
  front.position.set(0, 0, size/2)
  let rooftop01 = textureLoader.load('imgs/wall06.jpg' );
  front.material.map = rooftop01;

  //front top top
  let fronttGeometry = new THREE.CylinderGeometry( size/1.80, size/1.80, size/10, 32,32 );
  let fronttMaterial = new THREE.MeshLambertMaterial();
  let frontt = new THREE.Mesh(fronttGeometry, fronttMaterial);
  frontt.castShadow = true;
  frontt.receiveShadow = true; 
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
  bottom4t.receiveShadow = true; 
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

function createBuilding05(scale = 1.0, posx, posz, scene, loadingManager)
{
  var size = 100*scale;
  // Predio 1  
  let textureLoader = new THREE.TextureLoader(loadingManager);
  let height = size*8/3
  let bottomGeometry = new THREE.BoxGeometry(size, height, size);
  let bottomMaterial = new THREE.MeshLambertMaterial();
  let bottom = new THREE.Mesh(bottomGeometry, bottomMaterial);
  bottom.castShadow = true;
  bottom.receiveShadow = true; 
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
  top.receiveShadow = true; 
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
  dome.receiveShadow = true; 
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

function createBuilding06(scale = 1.0, posx, posz, scene,loadingManager,  rotation = false)
{
  var size = 80*scale;
  // Predio 1  
  let textureLoader = new THREE.TextureLoader(loadingManager);

  let bottomGeometry = new THREE.BoxGeometry(size*1.5, 2.2*size, size);
  let bottomMaterial = new THREE.MeshLambertMaterial();
  let bottom = new THREE.Mesh(bottomGeometry, bottomMaterial);
  bottom.castShadow = true;
  bottom.receiveShadow = true; 
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
  top.receiveShadow = true; 
  top.position.set(0, 1.1*size, 0);
  bottom.add(top);

  let rooftop01 = textureLoader.load('imgs/rooftop01.jpg' );
  top.material.map = rooftop01;
}

function createBuilding07(scale = 1.0, posx, posz, scene, loadingManager, rotation = false )
{
  var size = 80*scale;
  // Predio 1  
  let textureLoader = new THREE.TextureLoader(loadingManager);

  let bottomGeometry = new THREE.BoxGeometry(size*1.5, 2.0*size, size);
  let bottomMaterial = new THREE.MeshLambertMaterial();
  let bottom = new THREE.Mesh(bottomGeometry, bottomMaterial);
  bottom.castShadow = true;
  bottom.receiveShadow = true; 
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
  top.receiveShadow = true; 
  top.position.set(0, 1.0*size, 0);
  bottom.add(top);

  let rooftop01 = textureLoader.load('imgs/rooftop01.jpg' );
  top.material.map = rooftop01;
}

function createBuilding08(scale = 1.0, posx, posz, scene, loadingManager, rotation = false)
{
  var size = 100*scale;
  // Predio 1  
  let textureLoader = new THREE.TextureLoader(loadingManager);

  let bottomGeometry = new THREE.BoxGeometry(size, 2*size, size);
  let bottomMaterial = new THREE.MeshLambertMaterial();
  let bottom = new THREE.Mesh(bottomGeometry, bottomMaterial);
  bottom.castShadow = true;
  bottom.receiveShadow = true; 
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
  top.receiveShadow = true; 
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
  top2.receiveShadow = true; 
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

function createFactory(scale = 1.0, posx, posz, scene, loadingManager)
{
  var size = 80*scale;
  // bottom 
  let textureLoader = new THREE.TextureLoader(loadingManager);

  let bottomGeometry = new THREE.BoxGeometry(size*2.4, size, size*2);
  let bottomMaterial = new THREE.MeshLambertMaterial();
  let bottom = new THREE.Mesh(bottomGeometry, bottomMaterial);
  bottom.castShadow = true;
  bottom.receiveShadow = true; 
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
  bottom4t.receiveShadow = true; 
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
    incRoof.receiveShadow = true; 
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
  let windowMaterial = new THREE.MeshBasicMaterial();
  for(let i = 0; i < 4; i++)
  {
    let window = new THREE.Mesh(windowGeometry, windowMaterial);
    window.castShadow = true;
    window.receiveShadow = true; 
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

function createSideWalk(posx, posz, sizex, sizez, scene, loadingManager)
{
  let textureLoader = new THREE.TextureLoader(loadingManager);
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

export function positionFactory(scene, loadingManager){
  createFactory(1.0, 350, -350, scene, loadingManager);
}

export function positionSidewalks(scene, loadingManager)
{
  createSideWalk(  260, -257,  460, 486, scene, loadingManager);
  createSideWalk( -138, -257,  216, 486, scene, loadingManager);
  createSideWalk( -392, -257,  216, 486, scene, loadingManager);
  createSideWalk( -392,  125,  216, 222, scene, loadingManager);
  createSideWalk( -392,  385,  216, 222, scene, loadingManager);
  createSideWalk( -138,  125,  216, 222, scene, loadingManager);
  createSideWalk( -138,  385,  216, 222, scene, loadingManager);
  createSideWalk(  260,  125,  460, 222, scene, loadingManager);
  createSideWalk(  260,  385,  460, 222, scene, loadingManager);
}

export function positionBuildings(scene, loadingManager)
{
  //quarteirao 01
  createBuilding01(1.0, -451, 77, scene, loadingManager);
  createBuilding02(0.8, -341, 77, scene, loadingManager);
  createBuilding03(1.0, -451, 173, scene, loadingManager);
  createBuilding01(1.2, -340, 173, scene, loadingManager);

  //quarteirao 02
  createBuilding05(1.0, -91, 173, scene, loadingManager);
  createBuilding01(1.0, -184, 77, scene, loadingManager);
  createBuilding03(0.7, -184, 173, scene, loadingManager);
  createBuilding02(0.7, -91, 77, scene, loadingManager);

  //quarteirao 03
  createBuilding08(1.0, -451, 332, scene, loadingManager, true);
  createBuilding01(1.0, -341, 332, scene, loadingManager);
  createBuilding06(0.7, -451, 443, scene, loadingManager);
  createBuilding02(0.7, -341, 440, scene, loadingManager, true);

  //quarteirao 04
  createBuilding03(1.0, -185, 442, scene, loadingManager);
  createBuilding01(1.0, -185, 332, scene, loadingManager);
  createBuilding06(0.7, -91, 442, scene, loadingManager, true);
  createBuilding02(0.7, -92, 332, scene, loadingManager);

  //quarteirao 05
  createBuilding06(1.0, 126, 77, scene, loadingManager);
  createBuilding01(1.0, 99, 173, scene, loadingManager);
  createBuilding07(1.0, 270, 77, scene, loadingManager);
  createBuilding02(1.0, 233, 173, scene, loadingManager);
  createBuilding01(1.3, 433, 125, scene, loadingManager);

  //quarteirao 06
  createBuilding07(1.2, 99, 385, scene, loadingManager, true);
  createBuilding08(1.0, 260, 442, scene, loadingManager, true);
  createBuilding05(0.7, 318, 332, scene, loadingManager, true);
  createBuilding02(1.2, 404, 385, scene, loadingManager, true);

  //quarteirao 07
  createBuilding04(1.0, -138, -196,200, scene, loadingManager);
  createBuilding03(1.0, -120, -409, scene, loadingManager);

  //quarteirao 08
  createBuilding02(0.8, -451, -75, scene, loadingManager);
  createBuilding08(0.8, -333, -72, scene, loadingManager);
  createBuilding06(1.5, -333, -257, scene, loadingManager, true);
  createBuilding05(0.9, -421, -408, scene, loadingManager);
}



function onError() { };

function onProgress ( xhr, model ) {};




import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {initRenderer, 
        initCamera,       
        InfoBox,
        onWindowResize,
        degreesToRadians,
        initDefaultBasicLight} from "../libs/util/util.js";
// To use the keyboard
var keyboard = new KeyboardState(); 

var propellerAngle = 0.00;
var rotateAngle = 0.00;
var speed = 0.00;
var animation = true;

var rotateIncrease = 0.001;
export function rotatePropeller(propeller){
    

    propeller.matrixAutoUpdate = false;
    propeller.matrix.identity();
    if (animation){
        propellerAngle += speed;
        var mat4 = new THREE.Matrix4();
        propeller.matrix.multiply(mat4.makeTranslation(0.0, 23.5, 0.0))
        propeller.matrix.multiply(mat4.makeRotationY(-propellerAngle)); // R1
    }
 }

 export function movement(airplane, leftelevator, rightelevator, leftaileron, rightaileron, rudder){
  airplane.translateY(speed);
  if (rotateAngle>0){
    rotateAngle-=rotateIncrease;
    airplane.rotateY(rotateIncrease);
    leftaileron.rotateX(-rotateIncrease);
    leftaileron.translateZ(0.0005);
    rightaileron.rotateX(-rotateIncrease);
    rightaileron.translateZ(0.0005);
  }
 }

 var angleRD = 0.0;
var vel = 0.0001;

export function keyboardUpdate(airplane, leftelevator, rightelevator, leftaileron, rightaileron, rudder) {

  keyboard.update();
  
  var angle = 0.01;
  //var angleRD = 0.01;//rudder angle
  var angleRA = 0.01;//right aileron angle
  var angleLA = 0.01;//left aileron angle
  var angleRE = 0.01;//right elevator angle
  var angleLE = 0.01;//left elevator angle
 
  
  var rotAxis1 = new THREE.Vector3(1,0,0); // Set X axis
  var rotAxis2 = new THREE.Vector3(0,1,0); // Set Y axis
  var rotAxis3 = new THREE.Vector3(0,0,1); // Set Z axis

   
  if ( keyboard.pressed("Q")){ 
    if(speed<=1) speed+=0.005;
  }  
  if ( keyboard.pressed("A")){ 
    if(speed>0.0) speed-=0.005;
  } 

  if ( keyboard.pressed("down")) {
    airplane.rotateX(angle);
    leftelevator.rotateX(-0.001);
    leftelevator.translateZ(0.0002);
    rightelevator.rotateX(-0.001);
    rightelevator.translateZ(0.0002);
  }

  if ( keyboard.pressed("up")) {
    airplane.rotateX(-angle);
    leftelevator.rotateX(0.001);
    leftelevator.translateZ(-0.0002);
    rightelevator.rotateX(0.001);
    rightelevator.translateZ(-0.0002);
    
  }

  if ( keyboard.pressed("left")) {
    rotateAngle+=rotateIncrease;
    airplane.rotateY(-rotateIncrease);
    leftaileron.rotateX(rotateIncrease);
    leftaileron.translateZ(-0.0005);
    rightaileron.rotateX(rotateIncrease);
    rightaileron.translateZ(-0.0005);
  }

  if ( keyboard.pressed("right")) {
    airplane.rotateY(angle);
    leftaileron.rotateX(-rotateIncrease);
    leftaileron.translateZ(0.0005);
    rightaileron.rotateX(-rotateIncrease);
    rightaileron.translateZ(0.0005);
  }

  if ( keyboard.pressed(",")) {
    airplane.rotateZ(angle);
    rudder.rotateX(0.001);
    rudder.translateZ(-0.0002);
    
  }

  if ( keyboard.pressed(".")) {
    airplane.rotateZ(-angle);
    rudder.rotateX(-0.001);
    rudder.translateZ(0.0002);
    
  }
  
  return {speed, rotateAngle};
  // Use this to show information onscreen
  // var controls = new InfoBox();
  // controls.add("Information");
  // controls.addParagraph();
  // controls.add("Speed: ${speed}");
  
}
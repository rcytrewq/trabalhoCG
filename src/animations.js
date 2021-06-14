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

var angle2 = 0;
var speed = 0.15;
var animation = true;
export function rotatePropeller(propeller){
    

    propeller.matrixAutoUpdate = false;
    propeller.matrix.identity();
    if (animation){
        angle2 += speed;
        var mat4 = new THREE.Matrix4();
        propeller.matrix.multiply(mat4.makeTranslation(0.0, 23.5, 0.0))
        propeller.matrix.multiply(mat4.makeRotationY(-angle2)); // R1
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

  
  if ( keyboard.pressed("space")){ 
    airplane.translateY(0.5);
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
    airplane.rotateY(-angle);
    leftaileron.rotateX(0.001);
    leftaileron.translateZ(-0.0005);
    rightaileron.rotateX(0.001);
    rightaileron.translateZ(-0.0005);
  }

  if ( keyboard.pressed("right")) {
    airplane.rotateY(angle);
    leftaileron.rotateX(-0.001);
    leftaileron.translateZ(0.0005);
    rightaileron.rotateX(-0.001);
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

}
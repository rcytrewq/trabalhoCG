import * as THREE from "../build/three.module.js";
import Stats from "../build/jsm/libs/stats.module.js";
import { TrackballControls } from "../build/jsm/controls/TrackballControls.js";
import KeyboardState from "../libs/util/KeyboardState.js";
import {
  initRenderer,
  initCamera,
  InfoBox,
  onWindowResize,
  degreesToRadians,
  initDefaultBasicLight,
  radiansToDegrees
} from "../libs/util/util.js";

// To use the keyboard

var airplanePosition = new THREE.Vector3();
var keyboard = new KeyboardState();

// angles of the airplane's axes inclination
var propellerAngle = 0.0;
var rollAngle = 0.0;
var pitchAngle = 0.0;
var yawAngle = 0.0;

//airplane speed
var speed = 0.0;

// turn on animation
var animation = true;

//
var rollIncrease = 0.05;
var pitchIncrease = 0.01;
var yawIncrease = 0.02;
var increaseSpeed = 0.005;


var ZERO = 0.0000000000000000;

function speedInKnots(speed) {
  return (speed * 150).toFixed(2);
}
function rollLeft(angle, airplane) {
  if (rollAngle <= degreesToRadians(60)){
    rollAngle += angle;
    airplane.rotateY(-angle);
  }
}

function rollRight(angle, airplane) {
  if (rollAngle >= degreesToRadians(-60)){
    rollAngle -= angle;
    airplane.rotateY(angle);
  }
}

function yawLeft(angle, cube) {
  yawAngle += angle;
  cube.rotateY(angle);
  
}

function yawRight(angle, cube) {
  yawLeft(-angle, cube);
}

function pitchUp(angle, cube) {
  pitchAngle -= angle;
  cube.rotateX(-angle);
  
}

function pitchDown(angle, cube) {
  pitchUp(-angle, cube);
}

export function rotatePropeller(propeller) {
  propeller.matrixAutoUpdate = false;
  propeller.matrix.identity();
  if (animation) {
    propellerAngle += speed;
    var mat4 = new THREE.Matrix4();
    propeller.matrix.multiply(mat4.makeTranslation(0.0, 23.5, 0.0));
    propeller.matrix.multiply(mat4.makeRotationY(propellerAngle)); // R1
  }
}

export function movement(
  airplane,
  cube
) {
  
  keyboard.update();
  cube.translateZ(speed*1000);
  
  //always keep the angles between -360º and 360º
  if (pitchAngle > 6.28319) pitchAngle -= 6.28;
  if (pitchAngle <= -6.28319) pitchAngle += 6.28;

  if (rollAngle > 6.28319) rollAngle -= 6.28;
  if (rollAngle <= -6.28319) rollAngle += 6.28;

  //reset residual angles
  if (
    (pitchAngle > ZERO && pitchAngle < pitchIncrease) ||
    (pitchAngle < ZERO && pitchAngle > -pitchIncrease)
  )
    pitchAngle = ZERO;

  if (
    (rollAngle > ZERO && rollAngle < rollIncrease) ||
    (rollAngle < ZERO && rollAngle > -rollIncrease)
  )
    rollAngle = ZERO;

  if (speed < increaseSpeed) speed = 0;

  //auto return to horizontal
}

var angleRD = 0.0;
var vel = 0.0001;

export function keyboardUpdate(
  cube,
  airplane
) {
 
  keyboard.update();

  

  if (keyboard.pressed("Q")) {
    
    if (speed <= 0.7){
      
      speed += increaseSpeed;
      
    }
  }
  if (keyboard.pressed("A")) {
    if (speed > 0.0) speed -= increaseSpeed / 1.5;
  }

  if (keyboard.pressed("down" ) /*&& pitchAngle >= degreesToRadians(-90)*/) {
    pitchUp(pitchIncrease, cube);
  } else {
      if (pitchAngle < ZERO) {
        pitchUp(-pitchIncrease/2., cube);
      }
  }

   if (keyboard.pressed("up") /*&& pitchAngle <= degreesToRadians(90)*/) {
     pitchDown(pitchIncrease, cube);
   } else {
      if (pitchAngle > ZERO) {
        pitchDown(-pitchIncrease/2., cube);
      }
   }

  if (keyboard.pressed("left")) {
    rollLeft(rollIncrease, airplane);
    yawLeft(yawIncrease,cube);
    //airplane.rotateZ(angle);
    // camera.rotateZ(-10);
  } else {
      if (rollAngle > ZERO) {
        rollRight(rollIncrease/2., airplane);
      }
  }

  if (keyboard.pressed("right")) {
    rollRight(rollIncrease, airplane);
    yawRight(yawIncrease, cube);
  } else {
      if (rollAngle < ZERO) {
        rollLeft(rollIncrease/2., airplane);
      }
  }

    
  var speedOnScreen = speedInKnots(speed);
  var altitude = (airplane.getWorldPosition(airplanePosition).y - 2850)*0.01;
  return ({ speedOnScreen, rollAngle, pitchAngle, altitude });
}

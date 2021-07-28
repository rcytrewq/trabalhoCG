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
} from "../libs/util/util.js";

// To use the keyboard
var keyboard = new KeyboardState();

// angles of the airplane's axes inclination
var propellerAngle = 0.0;
var rollAngle = 0.0;
var pitchAngle = 0.0;

//airplane speed
var speed = 0.0;

// turn on animation
var animation = true;

//
var rollIncrease = 0.003;
var pitchIncrease = 0.001;
var increaseSpeed = 0.0005;

function speedInKnots(speed) {
  return (speed * 150).toFixed(1);
}
function rollLeft(angle, airplane, leftaileron, rightaileron, rudder) {
  rollAngle += angle;
  airplane.rotateY(-angle);
  leftaileron.rotateX(angle);
  leftaileron.translateZ(-angle / 2.);
  rightaileron.rotateX(angle);
  rightaileron.translateZ(-angle / 2.);
  // airplane.rotateZ(angle/3.);
  // rudder.rotateX(angle/3.);
  // rudder.translateZ(-angle/15.);
}

function rotateRight(angle, airplane, leftaileron, rightaileron, rudder) {
  rollLeft(-angle, airplane, leftaileron, rightaileron, rudder);
}

function pitchUp(angle, airplane, leftelevator, rightelevator) {
  pitchAngle += angle;
  airplane.rotateX(angle);
  leftelevator.rotateX(-angle / 10.);
  leftelevator.translateZ(angle / 50.);
  rightelevator.rotateX(-angle / 10.);
  rightelevator.translateZ(angle / 50.);
}

function pitchDown(angle, airplane, leftelevator, rightelevator) {
  pitchUp(-angle, airplane, leftelevator, rightelevator);
}

export function rotatePropeller(propeller) {
  propeller.matrixAutoUpdate = false;
  propeller.matrix.identity();
  if (animation) {
    propellerAngle += speed;
    var mat4 = new THREE.Matrix4();
    propeller.matrix.multiply(mat4.makeTranslation(0.0, 23.5, 0.0));
    propeller.matrix.multiply(mat4.makeRotationY(-propellerAngle)); // R1
  }
}

export function movement(
  airplane,
  leftelevator,
  rightelevator,
  leftaileron,
  rightaileron,
  rudder,
  camera,
  cube
) {
  console.log("INICIO" + speed);
  console.log(speed);
  cube.translateX(speed);

  // if (speed < 0.05 && airplane.getWorldPosition().z > 9.6) {
  //   var dx = airplane.getWorldDirection().x >= 0 ? 0.1 : -0.5;
  //   var dy = airplane.getWorldDirection().y >= 0 ? 0.1 : -0.1;
  //   //console.log(k);
  //   airplane.position.set(
  //     airplane.getWorldPosition().x - dx,
  //     airplane.getWorldPosition().y,
  //     airplane.getWorldPosition().z -
  //       0.05 * (50 / airplane.getWorldPosition().z)
  //   );

  //   console.log(x[0], x[1], x[2]);
  //   airplane.position.set(worldToLocal((x,y,z-1)));
  //   pitchAngle-=0.03;
  // }
  //always keep the angles between -360º and 360º
  // if (pitchAngle > 6.28319) pitchAngle -= 6.28;
  // if (pitchAngle <= -6.28319) pitchAngle += 6.28;

  // if (rollAngle > 6.28319) rollAngle -= 6.28;
  // if (rollAngle <= -6.28319) rollAngle += 6.28;

  // //reset residual angles
  // if (
  //   (pitchAngle > 0.00000 && pitchAngle < pitchIncrease) ||
  //   (pitchAngle < 0.00000 && pitchAngle > -pitchIncrease)
  // )
  //   pitchAngle = Math.trunc(pitchAngle);

  // if (
  //   (rollAngle > 0.00000 && rollAngle < rollIncrease) ||
  //   (rollAngle < 0.00000 && rollAngle > -rollIncrease)
  // )
  //   rollAngle = 0.00000;

  // if (speed < increaseSpeed) speed = 0;

  // //auto return to horizontal
  // if (rollAngle > 0.00000) {
  //   rotateRight(rollIncrease, airplane, leftaileron, rightaileron, rudder);
  // }
  // if (rollAngle < 0.00000) {
  //   rollLeft(rollIncrease, airplane, leftaileron, rightaileron, rudder);
  // }
  // if (pitchAngle > 0.00000) {
  //   pitchDown(pitchIncrease, airplane, leftelevator, rightelevator);
  // }
  // if (pitchAngle < 0.000000) {
  //   pitchUp(pitchIncrease, airplane, leftelevator, rightelevator);
  // }
}

var angleRD = 0.0;
var vel = 0.0001;

export function keyboardUpdate(
  airplane,
  leftelevator,
  rightelevator,
  leftaileron,
  rightaileron,
  rudder,
  camera
) {
  console.log("KEYBOARD UPDATE");
  keyboard.update();

  var angle = 0.001;
  //var angleRD = 0.01;//rudder angle
  var angleRA = 0.01; //right aileron angle
  var angleLA = 0.01; //left aileron angle
  var angleRE = 0.01; //right elevator angle oi oio oi
  var angleLE = 0.01; //left elevator angle

  var rotAxis1 = new THREE.Vector3(1, 0, 0); // Set X axis
  var rotAxis2 = new THREE.Vector3(0, 1, 0); // Set Y axis
  var rotAxis3 = new THREE.Vector3(0, 0, 1); // Set Z axis

  if (keyboard.pressed("Q")) {
    console.log("APERTOU");
    if (speed <= 1) speed += increaseSpeed;
  }
  if (keyboard.pressed("A")) {
    if (speed > 0.0) speed -= increaseSpeed / 1.5;
  }

  if (keyboard.pressed("down")) {
    pitchUp(pitchIncrease, airplane, leftelevator, rightelevator);
  }

  if (keyboard.pressed("up")) {
    pitchDown(pitchIncrease, airplane, leftelevator, rightelevator);
  }

  if (keyboard.pressed("left")) {
    rollLeft(rollIncrease, airplane, leftaileron, rightaileron, rudder);
    // camera.rotateZ(-10);
  }

  if (keyboard.pressed("right")) {
    rotateRight(rollIncrease, airplane, leftaileron, rightaileron, rudder);
  }

  // if (keyboard.pressed(",")) {
  //   airplane.rotateZ(angle);
  //   rudder.rotateX(0.001);
  //   rudder.translateZ(-0.0002);
  // }

  // if (keyboard.pressed(".")) {
  //   airplane.rotateZ(-angle);
  //   rudder.rotateX(-0.001);
  //   rudder.translateZ(0.0002);
  // }

  // if (keyboard.pressed("space")) {
  //   airplane.translateZ(0.02);
  // }

  // return info to show on screen
  var speedOnScreen = speedInKnots(speed);
  var altitude = airplane.getWorldPosition().z - 9.6;
  return { speedOnScreen, rollAngle, pitchAngle, altitude };
}

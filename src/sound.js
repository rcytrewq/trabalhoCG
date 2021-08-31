import * as THREE from  '../build/three.module.js';

export function addSound(soundEffect, loop) {
  // create an AudioListener and add it to the camera
  const listener = new THREE.AudioListener();

  // create a global audio source
  const sound = new THREE.Audio( listener );

  // load a sound and set it as the Audio object's buffer
  const audioLoader = new THREE.AudioLoader();
  audioLoader.load( soundEffect, function( buffer ) {
    sound.setBuffer( buffer );
    sound.setLoop( loop );
    sound.setVolume( 0.1 );
  });

  return { listener, sound };
}

export default addSound;
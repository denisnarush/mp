import * as THREE from "./three.module.js";

const sceneWidth    = 640;
const sceneHeight   = 480;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, sceneWidth/sceneHeight, 0.1, 1000 );
    camera.position.z = 5;

var renderer = new THREE.WebGLRenderer();
    renderer.setSize( sceneWidth, sceneHeight );
    document.body.appendChild( renderer.domElement );

var geometry = new THREE.SphereGeometry( 1, 28, 28 );
var material = new THREE.MeshBasicMaterial();
var shpere = new THREE.Mesh( geometry, material );

scene.add( shpere );

const animate = function () {
    requestAnimationFrame( animate );

    shpere.rotation.x += 0.01;
    shpere.rotation.y += 0.01;

    renderer.render( scene, camera );
};

animate();
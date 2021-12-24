import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { Material, PCFSoftShadowMap, Vector3 } from "three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * lights
 */
const directionalLight = new THREE.DirectionalLight("#cfb138", 0.3);
directionalLight.width = 1;
directionalLight.position.set(1, 3, 2);
scene.add(directionalLight);
directionalLight.rotation.x = Math.PI;
const directionLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  1
);
// scene.add(directionLightHelper);
const ambientLight = new THREE.AmbientLight("#ffffff", 0.2);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight("#ff2121", 0.8, 2);
pointLight1.position.set(0.5, 0.5, 0.5);
scene.add(pointLight1);
const pointLight2 = new THREE.PointLight("#2feef5", 0.8, 2);
pointLight2.position.set(-0.5, 0.5, 0.5);
scene.add(pointLight2);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  200
);
// camera.position.x = 1;
// camera.position.y = 1;
camera.position.z = 1.5;
// camera.lookAt(new Vector3());
scene.add(camera);
// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * model
 */

const modelMaterialLoader = new MTLLoader();
modelMaterialLoader.load(
  "IronMan/IronMan.mtl",
  function (material) {
    // console.log(material);
    material.preload();
    // creating object loader inside the material after loading the material
    const modelLoader = new OBJLoader();
    // setting the material to the object loader before loading the object
    modelLoader.setMaterials(material);
    const model = modelLoader.load(
      "IronMan/IronMan.obj",
      function (object) {
        // console.log(gltf);
        scene.add(object);
        console.log(object);
        console.log();
        object.children.forEach((child) => {
          child.castShadow = true;
          child.receiveShadow = true;
        });

        object.scale.set(0.005, 0.005, 0.005);
        object.position.set(0, -1, 0);
        object.castShadow = true;
        // console.log(gltf.scene.position);
        // camera.lookAt(gltf.scene.position);
      },
      function (xhr) {
        // console.log((xhr.loaded / xhr.total) * 100);
      },
      function (error) {
        console.log(error);
      }
    );
  },
  function (xhr) {
    // console.log((xhr.loaded / xhr.total) * 100);
  },
  function (error) {
    console.log(error);
  }
);

// plane
const plane = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(4, 4),
  new THREE.MeshStandardMaterial({ color: "166929" })
);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -1;
scene.add(plane);

// console.log(model);

/**
 * shadows
 */
pointLight1.castShadow = true;
directionalLight.castShadow = true;
plane.receiveShadow = true;
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;

/**
 * Animate
 */
const clock = new THREE.Clock();
let lastElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - lastElapsedTime;
  lastElapsedTime = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container").appendChild(renderer.domElement);

scene.background = new THREE.Color(0x1c2e4a);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

const objects = [];
const geometries = [new THREE.BoxGeometry(), new THREE.SphereGeometry(0.5, 32, 32), new THREE.CylinderGeometry(0.5, 0.5, 1, 32), new THREE.TorusGeometry(0.5, 0.2, 16, 100)];

geometries.forEach((geometry) => {
  const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(Math.random() * 4 - 2, Math.random() * 4 - 2, Math.random() * 4 - 2);
  scene.add(mesh);
  objects.push(mesh);
});

camera.position.z = 5;

function startAnimation() {
  const tl = gsap.timeline();

  objects.forEach((obj, index) => {
    tl.to(obj.rotation, { duration: 2, x: obj.rotation.x + Math.PI * 2, delay: index * 0.2 }, "<").to(
      obj.position,
      { duration: 2, x: obj.position.x + (Math.random() - 0.5) * 2, y: obj.position.y + (Math.random() - 0.5) * 2, delay: index * 0.2 },
      "<"
    );

    anime({
      targets: obj.material.color,
      r: Math.random(),
      g: Math.random(),
      b: Math.random(),
      easing: "easeInOutQuad",
      duration: 2000,
      delay: index * 200,
    });
  });

  tl.to("#animateButton", { duration: 1, scale: 1.5, yoyo: true, repeat: 1 }, "<");

  anime({
    targets: "#animateButton",
    translateY: -10,
    direction: "alternate",
    easing: "easeInOutQuad",
    duration: 500,
  });
}

function changeMaterial() {
  objects.forEach((obj) => {
    const newMaterial = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
    obj.material = newMaterial;
  });
}

// register the effect with GSAP:
gsap.registerEffect({
  name: "fade",
  effect: (targets, config) => {
    return gsap.to(targets, { duration: config.duration, opacity: 0 });
  },
  defaults: { duration: 2 }, //defaults get applied to any "config" object passed to the effect
  extendTimeline: true, //now you can call the effect directly on any GSAP timeline to have the result immediately inserted in the position you define (default is sequenced at the end)
});

function shuffleObjects() {
  objects.forEach((obj) => {
    scene.remove(obj);
  });

  objects.length = 0;

  geometries.forEach((geometry) => {
    const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(Math.random() * 4 - 2, Math.random() * 4 - 2, Math.random() * 4 - 2);
    scene.add(mesh);
    objects.push(mesh);
  });

  gsap.effects.fade("#shuffleObjectsButton");
}

document.getElementById("animateButton").addEventListener("click", startAnimation);
document.getElementById("changeMaterialButton").addEventListener("click", changeMaterial);
document.getElementById("shuffleObjectsButton").addEventListener("click", shuffleObjects);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
}
animate();

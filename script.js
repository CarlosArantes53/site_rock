const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 1;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('canvas-container').appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight2.position.set(-1, -1, -1);
scene.add(directionalLight2);

const modelGroup = new THREE.Group();
const initialRotationY = -1.5;
const initialRotationX = -0.9;
const initialRotationZ = -2.2;
modelGroup.rotation.set(initialRotationX, initialRotationY, initialRotationZ);
scene.add(modelGroup);

const placeholderGeometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
const placeholderMaterial = new THREE.MeshPhongMaterial({
  color: 0x6699ff,
  shininess: 100,
  specular: 0x111111
});
const placeholderModel = new THREE.Mesh(placeholderGeometry, placeholderMaterial);
modelGroup.add(placeholderModel);

let targetRotationX = initialRotationX;
let targetRotationY = initialRotationY;
const smoothFactor = 0.1;

const maxRotation = Math.PI / 30;

document.addEventListener('mousemove', function (e) {
    const normalizedMouseX = (e.clientX / window.innerWidth) * 2 - 1;
    const normalizedMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  
    let newTargetRotationY = initialRotationY + normalizedMouseX * Math.PI;
    let newTargetRotationX = normalizedMouseY * (Math.PI / 2);
  
    // Limitando a rotação a no máximo 30° para X e Y
    targetRotationY = Math.max(initialRotationY - maxRotation, Math.min(initialRotationY + maxRotation, newTargetRotationY));
    targetRotationX = Math.max(initialRotationX - maxRotation, Math.min(initialRotationX + maxRotation, newTargetRotationX));
  });

document.addEventListener('wheel', function (e) {
  camera.position.z += e.deltaY * 0.01;
  camera.position.z = Math.max(2, Math.min(camera.position.z, 10));
});

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

setTimeout(() => {
  document.getElementById('loading').style.display = 'none';
  gsap.from(placeholderModel.scale, {
    x: 0,
    y: 0,
    z: 0,
    duration: 1.5,
    ease: "elastic.out(1, 0.5)"
  });
}, 1500);

const loader = new THREE.GLTFLoader();
loader.load(
  'model.glb',
  function (gltf) {
    modelGroup.remove(placeholderModel);
    gltf.scene.rotation.set(0, 0, 0);
    modelGroup.add(gltf.scene);
    document.getElementById('loading').style.display = 'none';
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% carregado');
  },
  function (error) {
    console.error('Erro ao carregar o modelo', error);
  }
);


function animate() {
    requestAnimationFrame(animate);
  
    // Aplicação suave da rotação
    modelGroup.rotation.x += (targetRotationX - modelGroup.rotation.x) * smoothFactor;
    modelGroup.rotation.y += (targetRotationY - modelGroup.rotation.y) * smoothFactor;
  
    renderer.render(scene, camera);
  }
  
  animate();
  
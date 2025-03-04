// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

// Camera setup
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 4;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Add renderer to the container
const container = document.getElementById('canvas-container');
if (container) {
  container.appendChild(renderer.domElement);
  
  // Set the renderer size to match container
  const updateRendererSize = () => {
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    renderer.setSize(containerWidth, containerHeight);
    camera.aspect = containerWidth / containerHeight;
    camera.updateProjectionMatrix();
  };
  
  updateRendererSize();
  window.addEventListener('resize', updateRendererSize);
}

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xff0066, 1);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

const backLight = new THREE.DirectionalLight(0x0044ff, 0.7);
backLight.position.set(-1, -1, -1);
scene.add(backLight);

// Model group
const modelGroup = new THREE.Group();
const initialRotationY = -1.0;
const initialRotationX = -0.4;
const initialRotationZ = -1.3;
modelGroup.rotation.set(initialRotationX, initialRotationY, initialRotationZ);
scene.add(modelGroup);

// Placeholder model
const placeholderGeometry = new THREE.TorusKnotGeometry(0.8, 0.3, 100, 16);
const placeholderMaterial = new THREE.MeshPhongMaterial({
  color: 0xff0066,
  shininess: 100,
  specular: 0xffffff
});
const placeholderModel = new THREE.Mesh(placeholderGeometry, placeholderMaterial);
modelGroup.add(placeholderModel);

// Rotation variables
let targetRotationX = initialRotationX;
let targetRotationY = initialRotationY;
const smoothFactor = 0.1;
const maxRotation = Math.PI / 8;

// Particle effects
function addParticles() {
  const particlesGeometry = new THREE.BufferGeometry();
  const particleCount = 500;
  
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 8;
    positions[i3 + 1] = (Math.random() - 0.5) * 8;
    positions[i3 + 2] = (Math.random() - 0.5) * 8;
    
    // Pink to blue gradient
    const mixFactor = Math.random();
    colors[i3] = mixFactor;
    colors[i3 + 1] = 0.1;
    colors[i3 + 2] = 1 - mixFactor;
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
    transparent: true,
    opacity: 0.8
  });
  
  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);
  
  return particles;
}

const particles = addParticles();

// Mouse movement for model rotation
container.addEventListener('mousemove', function (e) {
  if (!container) return;
  
  const rect = container.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const normalizedMouseX = (x / rect.width) * 2 - 1;
  const normalizedMouseY = -(y / rect.height) * 2 + 1;

  targetRotationY = initialRotationY + normalizedMouseX * maxRotation;
  targetRotationX = initialRotationX + normalizedMouseY * maxRotation;
});

// Loading animation
setTimeout(() => {
  const loadingElement = document.getElementById('loading');
  if (loadingElement) {
    loadingElement.style.display = 'none';
  }
  
  gsap.from(placeholderModel.scale, {
    x: 0,
    y: 0,
    z: 0,
    duration: 1.5,
    ease: "elastic.out(1, 0.5)"
  });
}, 1500);

// Load actual model
const loader = new THREE.GLTFLoader();
loader.load(
  'model.glb',
  function (gltf) {
    modelGroup.remove(placeholderModel);
    
    // Scale and position the model
    gltf.scene.scale.set(2, 2, 2);
    gltf.scene.position.set(0, -0.5, 0);
    
    // Add shiny material to model
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          shininess: 100,
          specular: 0xffffff
        });
      }
    });
    
    modelGroup.add(gltf.scene);
    
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }
    
    // Animate the model in
    gsap.from(gltf.scene.scale, {
      x: 0,
      y: 0,
      z: 0,
      duration: 1.5,
      ease: "elastic.out(1, 0.5)"
    });
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% carregado');
  },
  function (error) {
    console.error('Erro ao carregar o modelo', error);
  }
);

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Smooth rotation
  modelGroup.rotation.x += (targetRotationX - modelGroup.rotation.x) * smoothFactor;
  modelGroup.rotation.y += (targetRotationY - modelGroup.rotation.y) * smoothFactor;
  
  // Rotate particles
  particles.rotation.y += 0.001;
  
  // Auto-rotation when not interacting
  if (Math.abs(targetRotationY - modelGroup.rotation.y) < 0.01) {
    modelGroup.rotation.y += 0.002;
  }
  
  renderer.render(scene, camera);
}

animate();
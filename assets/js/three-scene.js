/* ============================================
   Mahipal Puri — 3D scenes (Three.js)
   - bg-particles: fixed full-page particle/star field
   - hero-3d:      wireframe knot + icosahedron + glow ring
   ============================================ */

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  if (typeof THREE === 'undefined') {
    console.warn('Three.js not loaded — skipping 3D scenes.');
    return;
  }
  initParticles();
  initHero3D();
});

/* ---------- Full-page particle background ---------- */
function initParticles() {
  const canvas = document.getElementById('bg-particles');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  const count = window.innerWidth < 768 ? 600 : 1400;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const palette = [
    new THREE.Color('#00e5ff'),
    new THREE.Color('#a855f7'),
    new THREE.Color('#ff4d8d'),
    new THREE.Color('#ffffff'),
  ];

  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 16;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 16;
    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3]     = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.03,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);

  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 0.6;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.6;
  }, { passive: true });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  let camX = 0, camY = 0;
  function animate() {
    if (!REDUCED_MOTION) {
      points.rotation.y += 0.0006;
      points.rotation.x += 0.00025;
      camX += (mouseX - camX) * 0.04;
      camY += (-mouseY - camY) * 0.04;
      camera.position.x = camX;
      camera.position.y = camY;
      camera.lookAt(scene.position);
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}

/* ---------- Hero 3D scene (behind avatar) ---------- */
function initHero3D() {
  const canvas = document.getElementById('hero-3d');
  if (!canvas) return;

  const host = canvas.parentElement;
  const getSize = () => ({ w: host.clientWidth, h: host.clientHeight });

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  let { w, h } = getSize();
  renderer.setSize(w, h);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
  camera.position.z = 5;

  const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.05, 0.32, 140, 18),
    new THREE.MeshBasicMaterial({ color: 0x00e5ff, wireframe: true, transparent: true, opacity: 0.45 })
  );
  scene.add(knot);

  const ico = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.55, 1),
    new THREE.MeshBasicMaterial({ color: 0xa855f7, wireframe: true, transparent: true, opacity: 0.6 })
  );
  scene.add(ico);

  const ring = new THREE.Mesh(
    new THREE.RingGeometry(1.85, 1.92, 90),
    new THREE.MeshBasicMaterial({ color: 0xff4d8d, transparent: true, opacity: 0.3, side: THREE.DoubleSide })
  );
  ring.rotation.x = Math.PI / 2.4;
  scene.add(ring);

  window.addEventListener('resize', () => {
    const s = getSize();
    if (!s.w || !s.h) return;
    camera.aspect = s.w / s.h;
    camera.updateProjectionMatrix();
    renderer.setSize(s.w, s.h);
  });

  function animate() {
    if (!REDUCED_MOTION) {
      knot.rotation.x += 0.0035;
      knot.rotation.y += 0.0055;
      ico.rotation.x  -= 0.004;
      ico.rotation.y  -= 0.006;
      ring.rotation.z += 0.0025;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}

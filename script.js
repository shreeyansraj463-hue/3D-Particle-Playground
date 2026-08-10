import * as THREE from 'https://unpkg.com/three@0.126.0/build/three.module.js';

// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

camera.position.z = 50;
camera.position.y = 20;
camera.lookAt(0, 0, 0);

// Central Mass (The "Sun")
const coreGeo = new THREE.SphereGeometry(2, 32, 32);
const coreMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
const centralMass = new THREE.Mesh(coreGeo, coreMat);
scene.add(centralMass);

// Particle System (The "Planets/Asteroids")
const particleCount = 500;
const particlesGeo = new THREE.BufferGeometry();
const posArray = new Float32Array(particleCount * 3);
const velocities = [];

const gravityConstant = 0.5;

for (let i = 0; i < particleCount * 3; i += 3) {
    // Random position in a disc
    const radius = 10 + Math.random() * 30;
    const theta = Math.random() * Math.PI * 2;
    
    posArray[i] = Math.cos(theta) * radius;     // x
    posArray[i+1] = (Math.random() - 0.5) * 2;  // y (slight variance)
    posArray[i+2] = Math.sin(theta) * radius;   // z

    // Calculate tangential velocity for orbit
    const orbitalSpeed = Math.sqrt(gravityConstant / radius) * 15; 
    velocities.push({
        x: -Math.sin(theta) * orbitalSpeed,
        y: 0,
        z: Math.cos(theta) * orbitalSpeed
    });
}

particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particleMat = new THREE.PointsMaterial({ size: 0.2, color: 0x00f0ff });
const particleSystem = new THREE.Points(particlesGeo, particleMat);
scene.add(particleSystem);

// Physics Animation Loop
function animate() {
    requestAnimationFrame(animate);

    const positions = particleSystem.geometry.attributes.position.array;

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const y = positions[i3+1];
        const z = positions[i3+2];

        // Vector math for gravity
        const distanceSq = x*x + y*y + z*z;
        const distance = Math.sqrt(distanceSq);
        
        // F = G * (m1*m2)/r^2. Simplified acceleration: a = G / r^2
        const force = gravityConstant / distanceSq;

        // Apply force towards center (0,0,0)
        velocities[i].x -= (x / distance) * force;
        velocities[i].y -= (y / distance) * force;
        velocities[i].z -= (z / distance) * force;

        // Update positions based on velocity
        positions[i3] += velocities[i].x;
        positions[i3+1] += velocities[i].y;
        positions[i3+2] += velocities[i].z;
    }

    particleSystem.geometry.attributes.position.needsUpdate = true;
    particleSystem.rotation.y += 0.001; // Slow global rotation
    
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});


---

### 2. 3D Particle Playground README
*This one is designed to look like a serious academic research project. It uses mathematical formatting, clean spacing, and expandable theory sections.*

```markdown
<div align="center">

# 🌌 Orbital Mechanics Sandbox

[![Deployment](https://img.shields.io/badge/Deployment-Live-brightgreen.svg?style=for-the-badge)](https://shreeyansraj463-hue.github.io/3D-Particle-Playground/)
[![Engine](https://img.shields.io/badge/Physics_Engine-Custom_Kinematics-ff5722.svg?style=for-the-badge)](#)
[![Three.js](https://img.shields.io/badge/Rendered_with-Three.js-000000.svg?style=for-the-badge&logo=threedotjs&logoColor=white)](#)

> *Translating classical physical laws and orbital kinematics into real-time, browser-based computational models.*

</div>

---

## 🔭 Abstract

This repository contains an interactive computational physics sandbox built using WebGL and **Three.js**. Rather than relying on pre-built physics engines (like Cannon.js or Matter.js), the gravitational attraction and vector updates are mathematically resolved frame-by-frame from scratch.

## 📐 Theoretical Framework

<details>
<summary><b>View Mathematical Formulation</b></summary>
<br>

The simulation models the gravitational attraction between a central massive body and a system of massless particles. The force $F$ exerted on a particle is derived from Newton's law of universal gravitation:

$$ F = G \frac{m_1 m_2}{r^2} $$

For computational efficiency in a real-time rendering loop, the engine applies a normalized gravitational constant. The resulting acceleration vector is applied directly to each particle's velocity matrix per animation frame:

$$ a = \frac{G}{r^2} $$

**Orbital Initialization:**
To prevent particles from immediately collapsing into the central mass, they are initialized with a calculated tangential velocity. The velocity vector is perpendicular to their position vector, naturally resulting in sustained elliptical orbits.

</details>

## ⚙️ Technical Implementation

- **Rendering Pipeline:** Three.js / WebGL.
- **Data Structures:** Utilizes `Float32Array` within a `BufferGeometry` object. This ensures memory-efficient handling of hundreds of particles compared to standard JavaScript arrays.
- **Physics Loop:** Custom Euler integration updating positional and velocity vectors synchronously with the display refresh rate via `requestAnimationFrame`.

## 🚀 Usage & Interaction

1. Navigate to the [Live Deployment](https://shreeyansraj463-hue.github.io/3D-Particle-Playground/).
2. **Interact:** Click and drag to rotate the 3D spatial camera.
3. Observe the orbital planes across the X, Y, and Z axes in real-time.

---
<div align="center">
  <i>Developed for experimental physics visualization.</i>
</div>

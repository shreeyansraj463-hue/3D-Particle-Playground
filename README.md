# 3D Particle Playground: Orbital Mechanics Simulator

## Overview
This repository contains an interactive physics sandbox built using WebGL and Three.js. The primary objective of this exploration is to translate classical physical laws—specifically Newtonian gravitation and orbital kinematics—into real-time, browser-based computational models.

## Theoretical Framework
The simulation models the gravitational attraction between a central massive body and a system of massless particles. The force $\mathbf{F}$ exerted on a particle is calculated using Newton's law of universal gravitation:

$$ \mathbf{F} = G \frac{m_1 m_2}{r^2} \mathbf{\hat{r}} $$

For computational efficiency in this simulation, we define a normalized gravity constant and apply the resulting acceleration vector directly to each particle's velocity per animation frame. Particles are initialized with a tangential velocity vector perpendicular to their position vector, naturally resulting in elliptical orbits.

## Technical Architecture
*   **Rendering Engine:** Three.js (WebGL)
*   **Logic:** Vanilla JavaScript (ES6+)
*   **Physics Integration:** Custom frame-by-frame vector mathematics calculating radial distance, acceleration, and velocity updates.

## Usage
Simply launch `index.html` in any modern web browser. You can rotate the simulation space using standard mouse drag controls to observe the orbital planes from different axes.

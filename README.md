🚀 Kinematic Engine v2.0

A Real-Time Physics Playground for Advanced Projectile Simulation

---

🌌 What is this?

Ever wondered what happens when you remove textbook simplifications and simulate motion the way it actually behaves in the real world?

Kinematic Engine v2.0 is a browser-based physics simulation that lets you explore projectile motion under realistic forces like air resistance, spin, planetary gravity, and even Earth’s rotation.

👉 This isn’t just a simulation — it’s a mini physics lab in your browser.

---

⚡ Why it’s different

Most physics problems assume:

- No air resistance
- Constant gravity
- Flat Earth
- No rotation

This engine breaks those assumptions.

✔ Simulates non-conservative forces
✔ Supports multiple planets (Earth, Mars, Moon, Venus)
✔ Models drag, Magnus effect, and Coriolis force
✔ Runs in real-time at 60 FPS

---

🧠 How it works

Instead of using simple formulas, the engine solves motion step-by-step using numerical computation:

[
\Delta t = 0.02s
]

At every frame, it updates:

- Position → "(x, y, z)"
- Velocity → "(vx, vy, vz)"
- Time → "t"

This creates a continuous, realistic trajectory rather than an idealized parabola.

---

🌍 Physics Behind the Engine

🌏 Gravity (Variable with Altitude)

[
g(y) = \frac{GM}{(R+y)^2}
]

---

🌬️ Air Resistance (Drag)

[
\mathbf{F}_d = \frac{1}{2}\rho v^2 C_d A \hat{\mathbf{v}}
]

---

🌀 Magnus Effect (Spin Physics)

[
\mathbf{F}m = \rho (\boldsymbol{\omega} \times \mathbf{v}) V{\text{eff}}
]

---

🌪️ Coriolis Effect (Planetary Rotation)

[
a_z = -2\Omega \left(v_x \sin\lambda - v_y \cos\lambda\right)
]

---

🛠️ Tech Stack

- ⚙️ Core Engine: Vanilla JavaScript (ES6+)
- 🎨 Rendering: HTML5 Canvas
- ⚡ Performance: Optimized with "requestAnimationFrame"
- 🧮 Computation: Euler Numerical Integration

---

🎛️ What You Can Control

- 🌍 Planet (Earth, Mars, Moon, Venus)
- 🚀 Launch velocity & angle
- ⚖️ Mass of projectile
- 📏 Radius (size)
- 🌀 Spin (Magnus effect)
- 🌐 Latitude (Coriolis effect)

---

🎯 Why this project matters

This project bridges the gap between:

«📘 Textbook physics → 💻 Real-world simulation»

It helps you see physics in action, not just solve equations.

---

👨‍💻 About

Built as an exploration into physics + computation.
Currently focused on JEE preparation, this project was created out of curiosity to experiment with simulation and real-time systems.

---

⭐ Try it yourself

👉 Interact. Experiment. Break the rules of ideal physics.

---

💡 Fun Thought

Try this:

- Add backspin → watch the projectile stay in air longer
- Switch to Moon → see how far it travels
- Increase radius → observe drag killing velocity

Physics becomes way more interesting when you play with it.

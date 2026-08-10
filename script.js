const canvas = document.getElementById('sim-canvas');
const ctx = canvas.getContext('2d');

// UI Elements
const inputs = ['velocity', 'angle', 'mass', 'radius', 'spin', 'latitude'];
const vals = {};
inputs.forEach(id => {
    vals[id] = document.getElementById(id);
    document.getElementById(id).addEventListener('input', (e) => {
        document.getElementById(id + '-val').innerText = e.target.value;
    });
});
const planetSelect = document.getElementById('planet');
const launchBtn = document.getElementById('launch-btn');

// Metrics
const outHeight = document.getElementById('out-height');
const outRange = document.getElementById('out-range');
const outDrift = document.getElementById('out-drift');
const outTime = document.getElementById('out-time');

// Physics Constants
const G = 6.67430e-11;
const PLANETS = {
    earth: { M: 5.972e24, R: 6371000, rho: 1.225, omega: 7.2921e-5 },
    moon:  { M: 7.342e22, R: 1737400, rho: 0.0,   omega: 2.66e-6 },
    mars:  { M: 6.39e23,  R: 3389500, rho: 0.020, omega: 7.088e-5 },
    venus: { M: 4.867e24, R: 6051800, rho: 65.0,  omega: 2.99e-7 }
};
const Cd = 0.47; 

let trajectoryData = [];
let animationId;

function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    drawGrid();
}
window.addEventListener('resize', resizeCanvas);

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#1f232b"; ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 50) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
    for (let y = 0; y < canvas.height; y += 50) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }
    
    ctx.strokeStyle = "#3a4150"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(30, 0); ctx.lineTo(30, canvas.height); ctx.stroke(); 
    ctx.beginPath(); ctx.moveTo(0, canvas.height - 30); ctx.lineTo(canvas.width, canvas.height - 30); ctx.stroke(); 

    // Radar Box
    ctx.fillStyle = "rgba(10, 12, 16, 0.9)";
    ctx.fillRect(canvas.width - 220, 20, 200, 100);
    ctx.strokeStyle = "#ff5722"; ctx.strokeRect(canvas.width - 220, 20, 200, 100);
    ctx.fillStyle = "#8b95a5"; ctx.font = "10px monospace";
    ctx.fillText("RADAR: LATERAL DRIFT (Z-AXIS)", canvas.width - 210, 35);
    ctx.strokeStyle = "#3a4150"; ctx.beginPath(); ctx.moveTo(canvas.width - 220, 70); ctx.lineTo(canvas.width - 20, 70); ctx.stroke();
}

function calculatePhysics() {
    const P = PLANETS[planetSelect.value];
    const u = parseFloat(vals.velocity.value);
    const theta = parseFloat(vals.angle.value) * (Math.PI / 180);
    const m = parseFloat(vals.mass.value);
    const r = parseFloat(vals.radius.value);
    const spinRPM = parseFloat(vals.spin.value);
    const lat = parseFloat(vals.latitude.value) * (Math.PI / 180);

    const A = Math.PI * r * r; // Cross-sectional area scales with radius properly
    const spinRadS = spinRPM * (2 * Math.PI / 60);
    
    let state = { x: 0, y: 0, z: 0, vx: u * Math.cos(theta), vy: u * Math.sin(theta), vz: 0, t: 0 };
    trajectoryData = [ {...state} ];
    
    const dt = 0.01; 
    let maxH = 0;
    let maxAbsZ = 0.001; // Prevent zero division on radar

    while (state.y >= 0 && state.t < 300) {
        let v = Math.sqrt(state.vx**2 + state.vy**2 + state.vz**2);
        
        let g_var = (G * P.M) / Math.pow(P.R + state.y, 2);
        
        // Drag scaled by Area and inversely by Mass ($F/m$)
        let Fd = 0.5 * P.rho * v * v * Cd * A;
        let ax_d = v !== 0 ? -(Fd / m) * (state.vx / v) : 0;
        let ay_d = v !== 0 ? -(Fd / m) * (state.vy / v) : 0;
        let az_d = v !== 0 ? -(Fd / m) * (state.vz / v) : 0;

        // Magnus Force scaled by Area, Radius, and inversely by Mass
        let Fm_coeff = 0.5 * P.rho * A * r / m;
        let ax_m = Fm_coeff * (-spinRadS * state.vy); 
        let ay_m = Fm_coeff * (spinRadS * state.vx);

        // Coriolis Drift based on Planet Rotation & Latitude
        let az_c = -2 * P.omega * (state.vx * Math.sin(lat) - state.vy * Math.cos(lat));

        let ax = ax_d + ax_m;
        let ay = -g_var + ay_d + ay_m;
        let az = az_d + az_c;

        state.vx += ax * dt;
        state.vy += ay * dt;
        state.vz += az * dt;
        state.x += state.vx * dt;
        state.y += state.vy * dt;
        state.z += state.vz * dt;
        state.t += dt;

        if (state.y > maxH) maxH = state.y;
        if (Math.abs(state.z) > maxAbsZ) maxAbsZ = Math.abs(state.z);
        
        if (Math.round(state.t * 100) % 5 === 0) trajectoryData.push({ ...state });
    }

    const finalState = trajectoryData[trajectoryData.length - 1];
    outTime.innerText = finalState.t.toFixed(2) + " s";
    outHeight.innerText = maxH.toFixed(2) + " m";
    outRange.innerText = finalState.x.toFixed(2) + " m";
    outDrift.innerText = finalState.z.toFixed(4) + " m";

    return { maxH, rangeX: Math.max(finalState.x, 1), maxZ: maxAbsZ };
}

function simulate() {
    cancelAnimationFrame(animationId);
    const bounds = calculatePhysics();
    
    let frame = 0;
    const originX = 30, originY = canvas.height - 30;
    
    const scaleX = (canvas.width - 80) / bounds.rangeX;
    const scaleY = (canvas.height - 80) / (bounds.maxH > 0 ? bounds.maxH : 1);
    const scale = Math.min(scaleX, scaleY);
    
    const radarW = 180, radarH = 80;
    const radarStartX = canvas.width - 210, radarCenterY = 70;
    const scaleRadarX = radarW / bounds.rangeX;
    const scaleRadarZ = (radarH / 2) / bounds.maxZ;

    function drawFrame() {
        drawGrid(); 

        ctx.beginPath();
        ctx.strokeStyle = "#ff5722"; ctx.lineWidth = 3; ctx.lineCap = "round";
        for (let i = 0; i <= frame; i++) {
            const p = trajectoryData[i];
            const drawX = originX + (p.x * scale);
            const drawY = originY - (p.y * scale);
            if (i === 0) ctx.moveTo(drawX, drawY);
            else ctx.lineTo(drawX, drawY);
        }
        ctx.stroke();

        // Radar Tracking
        ctx.beginPath();
        ctx.strokeStyle = "#ff0055"; ctx.lineWidth = 2;
        for (let i = 0; i <= frame; i++) {
            const p = trajectoryData[i];
            const rX = radarStartX + (p.x * scaleRadarX);
            const rZ = radarCenterY - (p.z * scaleRadarZ);
            if (i === 0) ctx.moveTo(rX, rZ);
            else ctx.lineTo(rX, rZ);
        }
        ctx.stroke();

        const current = trajectoryData[frame];
        const currX = originX + (current.x * scale);
        const currY = originY - (current.y * scale);

        ctx.fillStyle = "#ffffff";
        ctx.beginPath(); ctx.arc(currX, currY, 4, 0, Math.PI * 2); ctx.fill();

        // Vector Visualizers
        const vecScale = 0.4;
        ctx.strokeStyle = "#00f0ff"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(currX, currY); ctx.lineTo(currX + (current.vx * vecScale), currY); ctx.stroke();

        ctx.strokeStyle = "#ff0055";
        ctx.beginPath(); ctx.moveTo(currX, currY); ctx.lineTo(currX, currY - (current.vy * vecScale)); ctx.stroke();

        if (frame < trajectoryData.length - 1) {
            frame++;
            animationId = requestAnimationFrame(drawFrame);
        }
    }
    drawFrame();
}

launchBtn.addEventListener('click', simulate);
resizeCanvas();

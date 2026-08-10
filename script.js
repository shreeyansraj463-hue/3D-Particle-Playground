const canvas = document.getElementById('sim-canvas');
const ctx = canvas.getContext('2d');

const velInput = document.getElementById('velocity');
const angInput = document.getElementById('angle');
const velVal = document.getElementById('vel-val');
const angVal = document.getElementById('ang-val');
const launchBtn = document.getElementById('launch-btn');

const outHeight = document.getElementById('out-height');
const outRange = document.getElementById('out-range');
const outTime = document.getElementById('out-time');

// Physics Constants
const g = 9.81;
let animationId;

// Resize Canvas
function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    drawGrid();
}
window.addEventListener('resize', resizeCanvas);

// Update UI labels dynamically
velInput.addEventListener('input', () => velVal.innerText = velInput.value);
angInput.addEventListener('input', () => angVal.innerText = angInput.value);

// Draw Background Grid
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;

    for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // Draw origin axes
    ctx.strokeStyle = "rgba(0, 240, 255, 0.3)";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(20, 0); ctx.lineTo(20, canvas.height); ctx.stroke(); // Y axis
    ctx.beginPath(); ctx.moveTo(0, canvas.height - 20); ctx.lineTo(canvas.width, canvas.height - 20); ctx.stroke(); // X axis
}

// Run Simulation
function simulate() {
    cancelAnimationFrame(animationId);
    drawGrid();

    // Get Inputs
    const u = parseFloat(velInput.value);
    const theta = parseFloat(angInput.value) * (Math.PI / 180); // Convert to radians

    // Kinematic Equations
    const tFlight = (2 * u * Math.sin(theta)) / g;
    const hMax = (Math.pow(u, 2) * Math.pow(Math.sin(theta), 2)) / (2 * g);
    const range = (Math.pow(u, 2) * Math.sin(2 * theta)) / g;

    // Update UI Metrics
    outTime.innerText = tFlight.toFixed(2) + " s";
    outHeight.innerText = hMax.toFixed(2) + " m";
    outRange.innerText = range.toFixed(2) + " m";

    // Animation Variables
    let t = 0;
    const dt = 0.05; // Time step for animation
    
    // Scale drawing to fit canvas (Pixels per meter)
    const scaleX = (canvas.width - 60) / range;
    const scaleY = (canvas.height - 60) / (hMax > 0 ? hMax : 1);
    const scale = Math.min(scaleX, scaleY); // Keep aspect ratio consistent

    const originX = 20;
    const originY = canvas.height - 20;

    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.strokeStyle = "#00f0ff";
    ctx.lineWidth = 3;
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#00f0ff";

    function drawTrajectory() {
        if (t <= tFlight) {
            // Equations of motion (x and y over time)
            const x = u * Math.cos(theta) * t;
            const y = (u * Math.sin(theta) * t) - (0.5 * g * Math.pow(t, 2));

            // Map physical coordinates to canvas pixels
            const drawX = originX + (x * scale);
            const drawY = originY - (y * scale);

            ctx.lineTo(drawX, drawY);
            ctx.stroke();

            // Draw glowing particle tip
            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.arc(drawX, drawY, 4, 0, Math.PI * 2);
            ctx.fill();

            t += dt;
            animationId = requestAnimationFrame(drawTrajectory);
        }
    }
    
    drawTrajectory();
}

launchBtn.addEventListener('click', simulate);

// Initialize
resizeCanvas();

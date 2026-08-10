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

// Theme Colors
const colorAccent = "#ff5722";
const colorGrid = "#1f232b";
const colorAxes = "#3a4150";

function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    drawGrid();
}
window.addEventListener('resize', resizeCanvas);

velInput.addEventListener('input', () => velVal.innerText = velInput.value);
angInput.addEventListener('input', () => angVal.innerText = angInput.value);

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Grid Lines
    ctx.strokeStyle = colorGrid;
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = colorAxes;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(30, 0); ctx.lineTo(30, canvas.height); ctx.stroke(); // Y axis
    ctx.beginPath(); ctx.moveTo(0, canvas.height - 30); ctx.lineTo(canvas.width, canvas.height - 30); ctx.stroke(); // X axis
}

function simulate() {
    cancelAnimationFrame(animationId);
    drawGrid();

    // Inputs
    const u = parseFloat(velInput.value);
    const theta = parseFloat(angInput.value) * (Math.PI / 180);

    // Kinematic Equations
    const tFlight = (2 * u * Math.sin(theta)) / g;
    const hMax = (Math.pow(u, 2) * Math.pow(Math.sin(theta), 2)) / (2 * g);
    const range = (Math.pow(u, 2) * Math.sin(2 * theta)) / g;

    // Update UI
    outTime.innerText = tFlight.toFixed(2) + " s";
    outHeight.innerText = hMax.toFixed(2) + " m";
    outRange.innerText = range.toFixed(2) + " m";

    // Animation variables
    let t = 0;
    const dt = 0.05; 
    
    // Scale drawing to fit canvas perfectly
    const scaleX = (canvas.width - 80) / range;
    const scaleY = (canvas.height - 80) / (hMax > 0 ? hMax : 1);
    const scale = Math.min(scaleX, scaleY); 

    const originX = 30;
    const originY = canvas.height - 30;

    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.strokeStyle = colorAccent;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    // Remove shadow for cleaner engineering look
    ctx.shadowBlur = 0;

    function drawTrajectory() {
        if (t <= tFlight) {
            const x = u * Math.cos(theta) * t;
            const y = (u * Math.sin(theta) * t) - (0.5 * g * Math.pow(t, 2));

            const drawX = originX + (x * scale);
            const drawY = originY - (y * scale);

            ctx.lineTo(drawX, drawY);
            ctx.stroke();

            // Draw leading particle
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(drawX, drawY, 5, 0, Math.PI * 2);
            ctx.fill();

            t += dt;
            animationId = requestAnimationFrame(drawTrajectory);
        } else {
            // Draw exact landing point
            const finalX = originX + (range * scale);
            ctx.fillStyle = colorAccent;
            ctx.beginPath();
            ctx.arc(finalX, originY, 6, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    drawTrajectory();
}

launchBtn.addEventListener('click', simulate);
resizeCanvas();

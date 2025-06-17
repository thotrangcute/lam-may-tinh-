const typingMsg = document.getElementById("typingMsg");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const overlay = document.getElementById("overlay");
const startBtn = document.getElementById("startBtn");
const crushNameInput = document.getElementById("crushName");
const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");
const music = document.getElementById("bgMusic");
let crushName = "";
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Typing animation
const message = "Tớ có điều muốn nói với cậu...";
let idx = 0;
function type() {
  if (idx < message.length) {
    typingMsg.textContent += message[idx++];
    setTimeout(type, 100);
  }
}
type();

// Yes / No clicks
yesBtn.addEventListener("click", () => overlay.classList.remove("hidden"));
noBtn.addEventListener("click", () => {
  const x = Math.random() * (window.innerWidth - 100);
  const y = Math.random() * (window.innerHeight - 50);
  noBtn.style.position = "absolute";
  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";
});

// Start celebration
startBtn.addEventListener("click", () => {
  crushName = crushNameInput.value.trim() || "Crush";
  overlay.classList.add("hidden");
  music.play();
  showConfetti(200);
  launchFireworks();
  typingMsg.textContent = `Tớ yêu cậu, ${crushName} 💖`;
});

// Confetti effect
function showConfetti(n) {
  const colors = [
    "#ff5e5e",
    "#ffc75f",
    "#fffa65",
    "#69ff97",
    "#a7d0f9",
    "#d68cff",
  ];
  for (let i = 0; i < n; i++) {
    const div = document.createElement("div");
    div.classList.add("confetti-piece");
    div.style.left = Math.random() * 100 + "vw";
    div.style.setProperty(
      "--c",
      colors[Math.floor(Math.random() * colors.length)]
    );
    div.style.animationDuration = 2 + Math.random() * 2 + "s";
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 4000);
  }
}

// Fireworks
class Firework {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = -(3 + Math.random() * 3);
    this.exploded = false;
    this.particles = [];
  }
  update() {
    if (!this.exploded) {
      this.x += this.vx;
      this.y += this.vy += 0.05;
      if (this.vy >= 0) {
        this.exploded = true;
        this.makeParticles();
      }
    }
    this.particles.forEach((p) => p.update());
  }
  makeParticles() {
    const count = 30;
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(this.x, this.y));
    }
  }
  draw() {
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fill();
    this.particles.forEach((p) => p.draw());
  }
}
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 3;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.life = 60;
    this.color = `hsl(${Math.random() * 360},100%,60%)`;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
  }
  draw() {
    ctx.globalAlpha = this.life / 60;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

let fireworks = [];
let fwInterval;
function launchFireworks() {
  fireworks = [];
  clearInterval(fwInterval);
  fwInterval = setInterval(() => fireworks.push(new Firework()), 400);
  animate();
}
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  fireworks.forEach((fw, i) => {
    fw.update();
    fw.draw();
    if (fw.particles.every((p) => p.life <= 0)) fireworks.splice(i, 1);
  });
  requestAnimationFrame(animate);
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

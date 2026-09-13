const canvas = document.getElementById('wallpaperCanvas');
const ctx = canvas.getContext('2d');

const layoutModeSelect = document.getElementById('layoutMode');
const moveModeSelect = document.getElementById('moveMode');
const bgColorInput = document.getElementById('bgColor');
const dotColorInput = document.getElementById('dotColor');
const dotShapeSelect = document.getElementById('dotShape');

const dotCountInput = document.getElementById('dotCount');
const gridSpacingInput = document.getElementById('gridSpacing');
const dotSizeInput = document.getElementById('dotSize');
const flickerSpeedInput = document.getElementById('flickerSpeed');
const btnExportPng = document.getElementById('btnExportPng');

const dotCountContainer = document.getElementById('dotCountContainer');
const gridSpacingContainer = document.getElementById('gridSpacingContainer');

let dots = [];
let dpr = 1;

function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

function resizeCanvas() {
  const rect = canvas.parentElement.getBoundingClientRect();
  dpr = window.devicePixelRatio || 1;

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;

  ctx.imageSmoothingEnabled = false;
  initDots();
}

function initDots() {
  dots = [];
  const mode = layoutModeSelect.value;
  const logicalWidth = canvas.width / dpr;
  const logicalHeight = canvas.height / dpr;

  if (mode === 'random') {
    const count = parseInt(dotCountInput.value);
    for (let i = 0; i < count; i++) {
      dots.push({
        x: Math.random() * logicalWidth,
        y: Math.random() * logicalHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        baseRadius: Math.random() * 1.5 + 0.5,
        alpha: Math.random(),
        speed: (Math.random() * 0.02 + 0.005),
        factor: Math.random() > 0.5 ? 1 : -1
      });
    }
  } else if (mode === 'grid') {
    const spacing = parseInt(gridSpacingInput.value);
    const cols = Math.floor(logicalWidth / spacing);
    const rows = Math.floor(logicalHeight / spacing);
    
    const offsetX = (logicalWidth - (cols - 1) * spacing) / 2;
    const offsetY = (logicalHeight - (rows - 1) * spacing) / 2;

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        dots.push({
          x: offsetX + c * spacing,
          y: offsetY + r * spacing,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          baseRadius: 1,
          alpha: Math.random(),
          speed: (Math.random() * 0.02 + 0.005),
          factor: Math.random() > 0.5 ? 1 : -1
        });
      }
    }
  }
}

function toggleModeControls() {
  const mode = layoutModeSelect.value;
  if (mode === 'random') {
    dotCountContainer.style.display = 'flex';
    gridSpacingContainer.style.display = 'none';
  } else {
    dotCountContainer.style.display = 'none';
    gridSpacingContainer.style.display = 'flex';
  }
  initDots();
}

function drawShape(x, y, radius, shape) {
  ctx.beginPath();
  if (shape === 'circle') {
    ctx.arc(x, y, radius, 0, Math.PI * 2);
  } else if (shape === 'square') {
    ctx.rect(x - radius, y - radius, radius * 2, radius * 2);
  } else if (shape === 'diamond') {
    ctx.moveTo(x, y - radius * 1.3);
    ctx.lineTo(x + radius * 1.3, y);
    ctx.lineTo(x, y + radius * 1.3);
    ctx.lineTo(x - radius * 1.3, y);
    ctx.closePath();
  }
  ctx.fill();
}

function animate() {
  ctx.fillStyle = bgColorInput.value;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const globalSizeMultiplier = parseFloat(dotSizeInput.value);
  const globalSpeedMultiplier = parseFloat(flickerSpeedInput.value) / 5;
  const isDrift = moveModeSelect.value === 'drift';
  const shape = dotShapeSelect.value;
  const rgb = hexToRgb(dotColorInput.value);

  const logicalWidth = canvas.width / dpr;
  const logicalHeight = canvas.height / dpr;

  dots.forEach(dot => {
    dot.alpha += dot.speed * globalSpeedMultiplier * dot.factor;
    if (dot.alpha >= 1 || dot.alpha <= 0.05) {
      dot.factor *= -1;
    }

    if (isDrift) {
      dot.x += dot.vx;
      dot.y += dot.vy;

      if (dot.x < 0) dot.x = logicalWidth;
      if (dot.x > logicalWidth) dot.x = 0;
      if (dot.y < 0) dot.y = logicalHeight;
      if (dot.y > logicalHeight) dot.y = 0;
    }

    const renderX = dot.x * dpr;
    const renderY = dot.y * dpr;
    const currentRadius = dot.baseRadius * globalSizeMultiplier * dpr;

    ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${Math.max(0, dot.alpha)})`;
    drawShape(renderX, renderY, currentRadius, shape);
  });

  requestAnimationFrame(animate);
}

window.addEventListener('resize', resizeCanvas);
layoutModeSelect.addEventListener('change', toggleModeControls);
moveModeSelect.addEventListener('change', initDots);
dotCountInput.addEventListener('input', initDots);
gridSpacingInput.addEventListener('input', initDots);

btnExportPng.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = `wallpaper_${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
});

resizeCanvas();
toggleModeControls();
animate();
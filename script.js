const canvas = document.getElementById('wallpaperCanvas');
const ctx = canvas.getContext('2d');

const layoutModeSelect = document.getElementById('layoutMode');
const waveModeSelect = document.getElementById('waveMode');
const moveModeSelect = document.getElementById('moveMode');
const bgColorInput = document.getElementById('bgColor');
const dotColorInput = document.getElementById('dotColor');
const dotShapeSelect = document.getElementById('dotShape');

const dotCountInput = document.getElementById('dotCount');
const gridSpacingInput = document.getElementById('gridSpacing');
const dotSizeInput = document.getElementById('dotSize');
const waveWidthInput = document.getElementById('waveWidth');
const flickerSpeedInput = document.getElementById('flickerSpeed');

const loopDurationSelect = document.getElementById('loopDuration');
const btnExportPng = document.getElementById('btnExportPng');
const btnExportMp4 = document.getElementById('btnExportMp4');

const dotCountContainer = document.getElementById('dotCountContainer');
const gridSpacingContainer = document.getElementById('gridSpacingContainer');
const waveModeContainer = document.getElementById('waveModeContainer');
const waveWidthContainer = document.getElementById('waveWidthContainer');

let dots = [];
let dpr = 1;
let startTime = Date.now();

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
        radiusOffset: Math.random() * 15,
        phaseOffset: Math.random() * Math.PI * 2,
        cycles: Math.floor(Math.random() * 3) + 1,
        baseRadius: Math.random() * 1.5 + 0.5
      });
    }
  } else {
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
          radiusOffset: Math.random() * 8,
          phaseOffset: Math.random() * Math.PI * 2,
          cycles: Math.floor(Math.random() * 3) + 1,
          baseRadius: 1
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
    waveModeContainer.style.display = 'none';
    waveWidthContainer.style.display = 'none';
  } else if (mode === 'grid') {
    dotCountContainer.style.display = 'none';
    gridSpacingContainer.style.display = 'flex';
    waveModeContainer.style.display = 'none';
    waveWidthContainer.style.display = 'none';
  } else if (mode === 'drones') {
    dotCountContainer.style.display = 'none';
    gridSpacingContainer.style.display = 'flex';
    waveModeContainer.style.display = 'flex';
    waveWidthContainer.style.display = 'flex';
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

  const loopDuration = parseFloat(loopDurationSelect.value);
  const elapsedTime = ((Date.now() - startTime) / 1000) % loopDuration;
  const progress = (elapsedTime / loopDuration) * Math.PI * 2;

  const globalSizeMultiplier = parseFloat(dotSizeInput.value);
  const speedVal = parseFloat(flickerSpeedInput.value);
  const waveWidthVal = parseFloat(waveWidthInput.value);
  
  const mode = layoutModeSelect.value;
  const waveMode = waveModeSelect.value;
  const isDrift = moveModeSelect.value === 'drift';
  const shape = dotShapeSelect.value;
  const rgb = hexToRgb(dotColorInput.value);

  const logicalWidth = canvas.width / dpr;
  const logicalHeight = canvas.height / dpr;
  const centerX = logicalWidth / 2;
  const centerY = logicalHeight / 2;

  dots.forEach(dot => {
    let alpha = 0;

    if (mode === 'drones') {
      let spatialPhase = 0;
      // Используем ширину волны для регулировки плотности полосы
      const waveFreq = waveWidthVal * 0.002;

      if (waveMode === 'horizontal') {
        spatialPhase = dot.x * waveFreq;
      } else if (waveMode === 'radial') {
        const dx = dot.x - centerX;
        const dy = dot.y - centerY;
        spatialPhase = Math.sqrt(dx * dx + dy * dy) * waveFreq;
      } else if (waveMode === 'diagonal') {
        spatialPhase = (dot.x + dot.y) * waveFreq;
      }

      // Плавная регулировка волны без долгой «чёрной пропасти»
      const rawWave = Math.sin((progress * (speedVal / 3)) - spatialPhase);
      alpha = 0.5 + 0.5 * rawWave; // Градиент от 0 до 1 без обрезания нижнего спектра
    } else {
      alpha = 0.1 + 0.8 * (0.5 + 0.5 * Math.sin(progress * dot.cycles + dot.phaseOffset));
    }

    let currentX = dot.x;
    let currentY = dot.y;

    if (isDrift) {
      currentX += Math.cos(progress) * dot.radiusOffset;
      currentY += Math.sin(progress) * dot.radiusOffset;
    }

    const renderX = currentX * dpr;
    const renderY = currentY * dpr;
    const currentRadius = dot.baseRadius * globalSizeMultiplier * dpr;

    if (alpha > 0.02) {
      ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
      drawShape(renderX, renderY, currentRadius, shape);
    }
  });

  requestAnimationFrame(animate);
}

btnExportMp4.addEventListener('click', () => {
  const duration = parseFloat(loopDurationSelect.value);
  const stream = canvas.captureStream(60);
  
  const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') 
    ? 'video/webm;codecs=vp9' 
    : 'video/webm';

  const recorder = new MediaRecorder(stream, { mimeType });
  const chunks = [];

  btnExportMp4.disabled = true;
  btnExportMp4.innerText = `Запись петли (${duration}s)...`;

  recorder.ondataavailable = e => chunks.push(e.data);
  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `drone_wallpaper_${duration}s.webm`;
    a.click();
    URL.revokeObjectURL(url);

    btnExportMp4.disabled = false;
    btnExportMp4.innerText = 'Записать бесшовное видео';
  };

  startTime = Date.now();
  recorder.start();

  setTimeout(() => {
    recorder.stop();
  }, duration * 1000);
});

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
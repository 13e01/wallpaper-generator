const canvas = document.getElementById('wallpaperCanvas');
const ctx = canvas.getContext('2d');

// i18n Dictionary
const translations = {
  en: {
    title: "Settings",
    subtitle: "Customize your wallpaper parameters",
    groupMode: "Mode & Motion",
    layout: "Layout",
    optGrid: "Grid (Classic)",
    optDrones: "Drone Show (Waves)",
    optRandom: "Random",
    waveType: "Wave Type",
    optHorizontal: "Horizontal",
    optRadial: "Radial",
    optDiagonal: "Diagonal",
    moveType: "Motion Type",
    optStaticNoFlicker: "Static (No Flicker)",
    optFlickerNoMotion: "Flicker (No Motion)",
    optDrift: "Drift (Space)",
    optFly: "Fly (Comets)",
    flyDirection: "Fly Direction",
    optDirRandom: "Random",
    optDirRight: "Right ➔",
    optDirLeft: "Left ⬅",
    optDirDown: "Down ⬇",
    optDirUp: "Up ⬆",
    optDirDiagonal: "Diagonal ↘",
    groupAppearance: "Appearance",
    bgColor: "Background Color",
    dotColor: "Dot Color",
    dotShape: "Element Shape",
    optCircle: "Circles",
    optSquare: "Squares",
    optDiamond: "Diamonds",
    trailLength: "Trail Length",
    groupParams: "Grid & Particle Settings",
    dotCount: "Dot Count",
    gridSpacing: "Grid Spacing (px)",
    dotSize: "Dot Size",
    waveWidth: "Wave Width",
    animSpeed: "Animation Speed",
    groupExport: "Loop Recording",
    loopDuration: "Video Duration",
    format: "Format",
    resolution: "Resolution",
    optNative: "Screen (1:1)",
    quality: "Quality (Bitrate)",
    optBitrateLow: "Low (5 Mbps)",
    optBitrateMed: "Medium (12 Mbps)",
    optBitrateHigh: "High (25 Mbps)",
    optBitrateUltra: "Ultra (50 Mbps)",
    btnPng: "Download PNG",
    btnVideo: "Record Video",
    btnRecording: "Recording"
  },
  ru: {
    title: "Настройки",
    subtitle: "Настройте параметры обоев под себя",
    groupMode: "Режим и Движение",
    layout: "Расположение",
    optGrid: "Сетка (Классическая)",
    optDrones: "Шоу дронов (Волны)",
    optRandom: "Хаотичный",
    waveType: "Тип волны",
    optHorizontal: "Горизонтальная",
    optRadial: "Радиальная",
    optDiagonal: "Диагональная",
    moveType: "Тип движения",
    optStaticNoFlicker: "Статично (Без мерцания)",
    optFlickerNoMotion: "Мерцание (Без движения)",
    optDrift: "Дрейф (Космос)",
    optFly: "Полёт (Кометы)",
    flyDirection: "Направление полёта",
    optDirRandom: "Случайно",
    optDirRight: "Вправо ➔",
    optDirLeft: "Влево ⬅",
    optDirDown: "Вниз ⬇",
    optDirUp: "Вверх ⬆",
    optDirDiagonal: "По диагонали ↘",
    groupAppearance: "Внешний вид",
    bgColor: "Цвет фона",
    dotColor: "Цвет точек",
    dotShape: "Форма элементов",
    optCircle: "Круги",
    optSquare: "Квадраты",
    optDiamond: "Ромбы",
    trailLength: "Длина шлейфа (Trails)",
    groupParams: "Параметры сетки и частиц",
    dotCount: "Количество точек",
    gridSpacing: "Шаг сетки (px)",
    dotSize: "Размер точек",
    waveWidth: "Ширина волны",
    animSpeed: "Скорость анимации",
    groupExport: "Запись петли (Loop)",
    loopDuration: "Длина видео",
    format: "Формат",
    resolution: "Разрешение",
    optNative: "Экранное (1:1)",
    quality: "Качество (Bitrate)",
    optBitrateLow: "Низкое (5 Mbps)",
    optBitrateMed: "Среднее (12 Mbps)",
    optBitrateHigh: "Высокое (25 Mbps)",
    optBitrateUltra: "Ультра (50 Mbps)",
    btnPng: "Скачать PNG",
    btnVideo: "Записать видео",
    btnRecording: "Запись"
  }
};

const langSelect = document.getElementById('langSelect');
let currentLang = 'en';

function setLanguage(lang) {
  currentLang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
}

langSelect.addEventListener('change', (e) => {
  setLanguage(e.target.value);
});

const layoutModeSelect = document.getElementById('layoutMode');
const waveModeSelect = document.getElementById('waveMode');
const moveModeSelect = document.getElementById('moveMode');
const flyDirectionSelect = document.getElementById('flyDirection');
const bgColorInput = document.getElementById('bgColor');
const dotColorInput = document.getElementById('dotColor');
const dotShapeSelect = document.getElementById('dotShape');

const trailLengthInput = document.getElementById('trailLength');
const dotCountInput = document.getElementById('dotCount');
const gridSpacingInput = document.getElementById('gridSpacing');
const dotSizeInput = document.getElementById('dotSize');
const waveWidthInput = document.getElementById('waveWidth');
const flickerSpeedInput = document.getElementById('flickerSpeed');

const loopDurationSelect = document.getElementById('loopDuration');
const exportFormatSelect = document.getElementById('exportFormat');
const exportResolutionSelect = document.getElementById('exportResolution');
const exportQualitySelect = document.getElementById('exportQuality');
const btnExportPng = document.getElementById('btnExportPng');
const btnExportMp4 = document.getElementById('btnExportMp4');

const dotCountContainer = document.getElementById('dotCountContainer');
const gridSpacingContainer = document.getElementById('gridSpacingContainer');
const waveModeContainer = document.getElementById('waveModeContainer');
const waveWidthContainer = document.getElementById('waveWidthContainer');
const trailContainer = document.getElementById('trailContainer');
const flyDirectionContainer = document.getElementById('flyDirectionContainer');
const flickerSpeedContainer = document.getElementById('flickerSpeedContainer');

let dots = [];
let dpr = 1;
let startTime = Date.now();
let isRecording = false;

function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

function resizeCanvas() {
  if (isRecording) return;

  const rect = canvas.parentElement.getBoundingClientRect();
  dpr = window.devicePixelRatio || 1;

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;

  ctx.imageSmoothingEnabled = false;
  initDots();
}

function getVectorByDirection(dir) {
  const baseSpeed = Math.random() * 1.5 + 0.5;
  switch (dir) {
    case 'right': return { vx: baseSpeed, vy: 0 };
    case 'left': return { vx: -baseSpeed, vy: 0 };
    case 'up': return { vx: 0, vy: -baseSpeed };
    case 'down': return { vx: 0, vy: baseSpeed };
    case 'down-right': return { vx: baseSpeed * 0.7, vy: baseSpeed * 0.7 };
    case 'random':
    default:
      const angle = Math.random() * Math.PI * 2;
      return { vx: Math.cos(angle) * baseSpeed, vy: Math.sin(angle) * baseSpeed };
  }
}

function initDots() {
  dots = [];
  const mode = layoutModeSelect.value;
  const dir = flyDirectionSelect.value;
  const logicalWidth = canvas.width / dpr;
  const logicalHeight = canvas.height / dpr;

  if (mode === 'random') {
    const count = parseInt(dotCountInput.value);
    for (let i = 0; i < count; i++) {
      const vec = getVectorByDirection(dir);
      dots.push({
        x: Math.random() * logicalWidth,
        y: Math.random() * logicalHeight,
        vx: vec.vx,
        vy: vec.vy,
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
        const vec = getVectorByDirection(dir);
        dots.push({
          x: offsetX + c * spacing,
          y: offsetY + r * spacing,
          vx: vec.vx,
          vy: vec.vy,
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
  const moveMode = moveModeSelect.value;

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

  flickerSpeedContainer.style.display = (moveMode === 'none') ? 'none' : 'flex';
  trailContainer.style.display = (moveMode === 'drift' || moveMode === 'fly') ? 'flex' : 'none';
  flyDirectionContainer.style.display = moveMode === 'fly' ? 'flex' : 'none';

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
  const moveMode = moveModeSelect.value;
  const trailValue = parseInt(trailLengthInput.value);
  const isTrailActive = (moveMode === 'drift' || moveMode === 'fly') && trailValue > 0;

  if (isTrailActive) {
    const bgRgb = hexToRgb(bgColorInput.value);
    const alphaTrail = (10 - trailValue) * 0.04; 
    ctx.fillStyle = `rgba(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}, ${alphaTrail})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = bgColorInput.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  const loopDuration = parseFloat(loopDurationSelect.value);
  const elapsedTime = ((Date.now() - startTime) / 1000) % loopDuration;
  const progress = (elapsedTime / loopDuration) * Math.PI * 2;

  const globalSizeMultiplier = parseFloat(dotSizeInput.value);
  const speedVal = parseFloat(flickerSpeedInput.value);
  const waveWidthVal = parseFloat(waveWidthInput.value);
  
  const mode = layoutModeSelect.value;
  const waveMode = waveModeSelect.value;
  const shape = dotShapeSelect.value;
  const rgb = hexToRgb(dotColorInput.value);

  const logicalWidth = canvas.width / dpr;
  const logicalHeight = canvas.height / dpr;
  const centerX = logicalWidth / 2;
  const centerY = logicalHeight / 2;

  dots.forEach(dot => {
    let alpha = 1.0;

    if (moveMode !== 'none') {
      if (mode === 'drones') {
        let spatialPhase = 0;
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

        const rawWave = Math.sin((progress * (speedVal / 3)) - spatialPhase);
        alpha = 0.5 + 0.5 * rawWave;
      } else {
        alpha = 0.1 + 0.8 * (0.5 + 0.5 * Math.sin(progress * dot.cycles + dot.phaseOffset));
      }
    }

    let currentX = dot.x;
    let currentY = dot.y;

    if (moveMode === 'drift') {
      currentX += Math.cos(progress) * dot.radiusOffset;
      currentY += Math.sin(progress) * dot.radiusOffset;
    } else if (moveMode === 'fly') {
      dot.x += dot.vx * (speedVal / 3);
      dot.y += dot.vy * (speedVal / 3);

      if (dot.x < 0) dot.x = logicalWidth;
      if (dot.x > logicalWidth) dot.x = 0;
      if (dot.y < 0) dot.y = logicalHeight;
      if (dot.y > logicalHeight) dot.y = 0;

      currentX = dot.x;
      currentY = dot.y;
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

function getSupportedMimeType(format) {
  const types = {
    mp4: [
      'video/mp4;codecs=avc1.42E01E',
      'video/mp4',
      'video/webm;codecs=h264'
    ],
    webm: [
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm'
    ]
  };

  const candidates = types[format] || types.webm;
  for (const type of candidates) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return 'video/webm';
}

btnExportMp4.addEventListener('click', () => {
  const duration = parseFloat(loopDurationSelect.value);
  const format = exportFormatSelect.value;
  const resolution = exportResolutionSelect.value;
  const bitrate = parseInt(exportQualitySelect.value);

  isRecording = true;

  const originalWidth = canvas.width;
  const originalHeight = canvas.height;

  if (resolution === '1080p') {
    canvas.width = 1920;
    canvas.height = 1080;
  } else if (resolution === '720p') {
    canvas.width = 1280;
    canvas.height = 720;
  } else if (resolution === '4k') {
    canvas.width = 3840;
    canvas.height = 2160;
  }

  initDots();

  const mimeType = getSupportedMimeType(format);
  const stream = canvas.captureStream(60);

  let recorder;
  try {
    recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: bitrate
    });
  } catch (e) {
    recorder = new MediaRecorder(stream, { videoBitsPerSecond: bitrate });
  }

  const chunks = [];

  btnExportMp4.disabled = true;
  btnExportMp4.innerText = `${translations[currentLang].btnRecording} (${duration}s)...`;

  recorder.ondataavailable = e => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  recorder.onstop = () => {
    const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
    const blob = new Blob(chunks, { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wallpaper_${resolution}_${duration}s.${ext}`;
    a.click();
    URL.revokeObjectURL(url);

    canvas.width = originalWidth;
    canvas.height = originalHeight;
    isRecording = false;
    resizeCanvas();

    btnExportMp4.disabled = false;
    btnExportMp4.innerText = translations[currentLang].btnVideo;
  };

  startTime = Date.now();
  recorder.start();

  setTimeout(() => {
    recorder.stop();
  }, duration * 1000);
});

window.addEventListener('resize', resizeCanvas);
layoutModeSelect.addEventListener('change', toggleModeControls);
moveModeSelect.addEventListener('change', toggleModeControls);
flyDirectionSelect.addEventListener('change', initDots);
dotCountInput.addEventListener('input', initDots);
gridSpacingInput.addEventListener('input', initDots);

btnExportPng.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = `wallpaper_${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
});

setLanguage('en');
resizeCanvas();
toggleModeControls();
animate();
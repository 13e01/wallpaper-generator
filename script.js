// Инициализация холста и контекста
const canvas = document.getElementById('wallpaperCanvas');
const ctx = canvas.getContext('2d');

// Элементы управления
const layoutModeSelect = document.getElementById('layoutMode');
const bgColorInput = document.getElementById('bgColor');
const dotCountInput = document.getElementById('dotCount');
const gridSpacingInput = document.getElementById('gridSpacing');
const dotSizeInput = document.getElementById('dotSize');
const flickerSpeedInput = document.getElementById('flickerSpeed');
const btnExportPng = document.getElementById('btnExportPng');

const dotCountContainer = document.getElementById('dotCountContainer');
const gridSpacingContainer = document.getElementById('gridSpacingContainer');

// Состояние генерации
let dots = [];

// Подгоняем размер Canvas под реальные размеры контейнера
function resizeCanvas() {
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  initDots(); // Пересоздаем точки при изменении размера
}

// Инициализация массива точек в зависимости от режима
function initDots() {
  dots = [];
  const mode = layoutModeSelect.value;

  if (mode === 'random') {
    // Режим 1: Хаотичное распределение
    const count = parseInt(dotCountInput.value);
    for (let i = 0; i < count; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        baseRadius: Math.random() * 1.5 + 0.5,
        alpha: Math.random(),
        speed: (Math.random() * 0.02 + 0.005),
        factor: Math.random() > 0.5 ? 1 : -1
      });
    }
  } else if (mode === 'grid') {
    // Режим 2: Геометрическая сетка
    const spacing = parseInt(gridSpacingInput.value);
    const cols = Math.floor(canvas.width / spacing);
    const rows = Math.floor(canvas.height / spacing);
    
    // Центрируем сетку на экране
    const offsetX = (canvas.width - (cols - 1) * spacing) / 2;
    const offsetY = (canvas.height - (rows - 1) * spacing) / 2;

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        dots.push({
          x: offsetX + c * spacing,
          y: offsetY + r * spacing,
          baseRadius: 1, // В сетке все точки одинакового радиуса
          alpha: Math.random(),
          speed: (Math.random() * 0.02 + 0.005),
          factor: Math.random() > 0.5 ? 1 : -1
        });
      }
    }
  }
}

// Переключение видимости настроек в зависимости от режима
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

// Главный цикл анимации
function animate() {
  // 1. Отрисовка фона
  ctx.fillStyle = bgColorInput.value;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const globalSizeMultiplier = parseFloat(dotSizeInput.value);
  const globalSpeedMultiplier = parseFloat(flickerSpeedInput.value) / 5;

  // 2. Отрисовка каждой точки
  dots.forEach(dot => {
    // Изменение прозрачности (плавное мерцание)
    dot.alpha += dot.speed * globalSpeedMultiplier * dot.factor;
    if (dot.alpha >= 1 || dot.alpha <= 0.05) {
      dot.factor *= -1;
    }

    const currentRadius = dot.baseRadius * globalSizeMultiplier;

    // Градиент свечения вокруг точки
    const gradient = ctx.createRadialGradient(
      dot.x, dot.y, 0,
      dot.x, dot.y, currentRadius * 3
    );
    gradient.addColorStop(0, `rgba(255, 255, 255, ${Math.max(0, dot.alpha)})`);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.arc(dot.x, dot.y, currentRadius * 3, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(animate);
}

// Обработчики событий для интерактивности
window.addEventListener('resize', resizeCanvas);
layoutModeSelect.addEventListener('change', toggleModeControls);
dotCountInput.addEventListener('input', initDots);
gridSpacingInput.addEventListener('input', initDots);

// Скачивание PNG текущего кадра
btnExportPng.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = `wallpaper_${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
});

// Старт
resizeCanvas();
toggleModeControls();
animate();
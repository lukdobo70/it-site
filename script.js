const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.nav-links');

const setHeader = () => header.classList.toggle('scrolled', window.scrollY > 24);
setHeader();
window.addEventListener('scroll', setHeader, { passive: true });

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Otwórz menu' : 'Zamknij menu');
  menu.classList.toggle('open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
});

document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Otwórz menu');
  menu.classList.remove('open');
  document.body.classList.remove('menu-open');
}));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -35px' });

document.querySelectorAll('.reveal').forEach((item, index) => {
  item.style.transitionDelay = `${Math.min((index % 4) * 70, 210)}ms`;
  observer.observe(item);
});

const matrixCanvas = document.querySelector('#matrix-rain');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (matrixCanvas && !reduceMotion) {
  const context = matrixCanvas.getContext('2d');
  let columns = [];
  let fontSize = 18;
  let lastFrame = 0;

  const resizeMatrix = () => {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = Math.min(900, window.innerHeight);
    fontSize = width < 680 ? 16 : 19;
    matrixCanvas.width = Math.floor(width * pixelRatio);
    matrixCanvas.height = Math.floor(height * pixelRatio);
    matrixCanvas.style.width = `${width}px`;
    matrixCanvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    columns = Array.from({ length: Math.ceil(width / fontSize) }, () => ({
      y: -Math.random() * height,
      speed: 0.45 + Math.random() * 0.8,
      trail: 5 + Math.floor(Math.random() * 12)
    }));
  };

  const drawMatrix = (time) => {
    requestAnimationFrame(drawMatrix);
    if (document.hidden || time - lastFrame < 42) return;
    lastFrame = time;
    const width = window.innerWidth;
    const height = Math.min(900, window.innerHeight);
    context.fillStyle = 'rgba(5, 8, 13, 0.14)';
    context.fillRect(0, 0, width, height);
    context.font = `600 ${fontSize}px monospace`;
    context.textAlign = 'center';

    columns.forEach((drop, index) => {
      for (let trail = 0; trail < drop.trail; trail += 1) {
        const alpha = Math.max(0, 0.72 - trail / drop.trail);
        context.fillStyle = trail === 0
          ? `rgba(184, 249, 255, ${alpha})`
          : `rgba(66, 232, 255, ${alpha * 0.55})`;
        context.fillText(Math.random() > 0.5 ? '1' : '0', index * fontSize + fontSize / 2, drop.y - trail * fontSize);
      }
      drop.y += fontSize * drop.speed;
      if (drop.y - drop.trail * fontSize > height) drop.y = -Math.random() * height * 0.55;
    });
  };

  resizeMatrix();
  window.addEventListener('resize', resizeMatrix, { passive: true });
  requestAnimationFrame(drawMatrix);
}


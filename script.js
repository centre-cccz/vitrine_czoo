/* =========================================================
   PREMIUM IMAGE SLIDER — CONFIG + ANIMATIONS
   ========================================================= */

const CONFIG = {
  autoplay: true,
  autoplayInterval: 5000,
  pauseOnHover: true,
  transitionDuration: 1100,
  swipeThreshold: 70,
  slides: [
    {
      image: 'images/evenements/A%20venir/Koskin/Koskin.png',
      eyebrow: 'Festival vivant',
      title: 'KOSKIN 2026',
      subtitle: 'Un voyage de théâtre, d’humour et de créativité au cœur du Centre culturel Le Zoo.',
      cta: 'Explorer le programme',
      href: 'programmes.html'
    },
    {
      image: 'images/evenements/A%20venir/Fekipaf/Fekipaf.png',
      eyebrow: 'Événement phare',
      title: 'FEKIPAF 2026',
      subtitle: 'Des performances inclusives, des échanges et des créations qui font avancer la culture.',
      cta: 'Découvrir l’événement',
      href: 'programmes.html'
    },
    {
      image: 'images/evenements/A%20venir/Musique%20Acoustique%20-%20Jea%20Goubald/concert-jeangoubald.jpg',
      eyebrow: 'Musique & émotion',
      title: 'Musique acoustique',
      subtitle: 'Des rythmes sensibles et des voix inspirées pour une expérience immersive.',
      cta: 'Voir les prochains temps forts',
      href: 'programmes.html'
    },
    {
      image: 'images/evenements/A%20venir/Expo_Vente/Expo-vente.jpg',
      eyebrow: 'Art & création',
      title: 'Expo-Vente 2026',
      subtitle: 'Une vitrine élégante pour les artistes congolais et leurs œuvres contemporaines.',
      cta: 'Voir les expositions',
      href: 'programmes.html'
    },
    {
      image: 'images/portail/salongo_enfants.jpg',
      eyebrow: 'Portail du Zoo',
      title: 'Culture, jeunesse & héritage',
      subtitle: 'Le CZOO ouvre ses espaces à la mémoire, à la transmission et à la création.',
      cta: 'Entrer dans le portail',
      href: 'accueil.html'
    }
  ]
};

const state = {
  index: 0,
  isAnimating: false,
  autoplayTimer: null,
  progressRaf: null,
  dragStartX: 0,
  dragOffset: 0
};

const sliderTrack = document.getElementById('sliderTrack');
const pagination = document.getElementById('pagination');
const counter = document.getElementById('counter');
const progressBar = document.getElementById('progressBar');
const sliderStage = document.getElementById('sliderStage');

function buildSlides() {
  const fragment = document.createDocumentFragment();

  CONFIG.slides.forEach((slide, index) => {
    const article = document.createElement('article');
    article.className = `slide-card${index === 0 ? ' is-active' : ''}`;
    article.setAttribute('data-index', String(index));
    article.innerHTML = `
      <img class="slide-image" src="${slide.image}" alt="${slide.title}" loading="${index < 2 ? 'eager' : 'lazy'}" />
      <div class="slide-content">
        <div class="slide-panel">
          <span class="eyebrow">${slide.eyebrow}</span>
          <h2>${slide.title}</h2>
          <p>${slide.subtitle}</p>
          <a class="slide-cta" href="${slide.href}">${slide.cta} →</a>
        </div>
      </div>
    `;
    fragment.appendChild(article);
  });

  sliderTrack.innerHTML = '';
  sliderTrack.appendChild(fragment);
  renderPagination();
  preloadImages();
}

function renderPagination() {
  pagination.innerHTML = '';
  CONFIG.slides.forEach((_, index) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', `Aller à la diapositive ${index + 1}`);
    btn.className = index === state.index ? 'is-active' : '';
    btn.addEventListener('click', () => goTo(index, 'jump'));
    pagination.appendChild(btn);
  });
}

function updateCounter() {
  const current = String(state.index + 1).padStart(2, '0');
  const total = String(CONFIG.slides.length).padStart(2, '0');
  counter.textContent = `${current} / ${total}`;
}

function updatePagination() {
  [...pagination.children].forEach((btn, index) => {
    btn.classList.toggle('is-active', index === state.index);
  });
}

function setActiveSlide(index, direction = 'next') {
  if (state.isAnimating || index === state.index) return;
  state.isAnimating = true;

  const slides = Array.from(sliderTrack.children);
  const currentSlide = slides[state.index];
  const nextSlide = slides[index];

  if (currentSlide) {
    currentSlide.classList.add('is-leaving');
    currentSlide.style.zIndex = '1';
  }

  if (nextSlide) {
    nextSlide.classList.add('is-active');
    nextSlide.style.zIndex = '3';
    nextSlide.style.setProperty('--direction', direction === 'prev' ? '-1' : '1');
  }

  window.setTimeout(() => {
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === index);
      slide.classList.remove('is-leaving');
      slide.style.zIndex = slideIndex === index ? '3' : '1';
    });

    state.index = index;
    updateCounter();
    updatePagination();
    state.isAnimating = false;
    restartAutoplay();
  }, CONFIG.transitionDuration);
}

function goTo(index, source = 'next') {
  const safeIndex = (index + CONFIG.slides.length) % CONFIG.slides.length;
  setActiveSlide(safeIndex, source === 'prev' ? 'prev' : 'next');
}

function goToNext() {
  goTo(state.index + 1, 'next');
}

function goToPrev() {
  goTo(state.index - 1, 'prev');
}

function startProgress() {
  if (state.progressRaf) cancelAnimationFrame(state.progressRaf);
  progressBar.style.width = '0%';

  const start = performance.now();
  const tick = (now) => {
    const elapsed = now - start;
    const ratio = Math.min(elapsed / CONFIG.autoplayInterval, 1);
    progressBar.style.width = `${ratio * 100}%`;

    if (ratio < 1) {
      state.progressRaf = requestAnimationFrame(tick);
    }
  };

  state.progressRaf = requestAnimationFrame(tick);
}

function restartAutoplay() {
  clearInterval(state.autoplayTimer);
  if (!CONFIG.autoplay) return;
  startProgress();
  state.autoplayTimer = window.setInterval(() => {
    goToNext();
  }, CONFIG.autoplayInterval);
}

function preloadImages() {
  CONFIG.slides.forEach((slide) => {
    const img = new Image();
    img.src = slide.image;
  });
}

function attachNavigation() {
  document.querySelectorAll('[data-action]').forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.getAttribute('data-action');
      if (action === 'next') goToNext();
      if (action === 'prev') goToPrev();
    });
  });
}

function attachKeyboard() {
  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') goToNext();
    if (event.key === 'ArrowLeft') goToPrev();
  });
}

function attachHoverPause() {
  if (!CONFIG.pauseOnHover) return;
  sliderStage.addEventListener('mouseenter', () => {
    clearInterval(state.autoplayTimer);
    if (state.progressRaf) cancelAnimationFrame(state.progressRaf);
  });
  sliderStage.addEventListener('mouseleave', () => {
    restartAutoplay();
  });
}

function attachDrag() {
  let dragOffset = 0;

  const onPointerDown = (event) => {
    state.dragStartX = event.clientX;
    dragOffset = 0;
    sliderStage.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (state.isAnimating) return;
    dragOffset = event.clientX - state.dragStartX;
    const slides = Array.from(sliderTrack.children);
    const active = slides[state.index];
    if (active) {
      active.style.transform = `translate3d(${dragOffset}px, 0, 0) scale(1) rotateY(${dragOffset / 24}deg)`;
    }
  };

  const onPointerUp = (event) => {
    if (state.isAnimating) return;
    const diff = event.clientX - state.dragStartX;
    const slides = Array.from(sliderTrack.children);
    const active = slides[state.index];
    if (active) {
      active.style.transform = '';
    }

    if (Math.abs(diff) > CONFIG.swipeThreshold) {
      if (diff < 0) goToNext();
      else goToPrev();
    }
  };

  sliderStage.addEventListener('pointerdown', onPointerDown);
  sliderStage.addEventListener('pointermove', onPointerMove);
  sliderStage.addEventListener('pointerup', onPointerUp);
  sliderStage.addEventListener('pointercancel', onPointerUp);
}

function init() {
  buildSlides();
  updateCounter();
  updatePagination();
  attachNavigation();
  attachKeyboard();
  attachHoverPause();
  attachDrag();
  restartAutoplay();
}

init();

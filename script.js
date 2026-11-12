/* =============================================================================
   NIAVELLA — Landing Page Scripts
   Three independent modules:
     1. Drawer menu  (open/close + close on nav click)
     2. Hero slider  (dots, autoplay, swipe)
     3. Scroll reveal (IntersectionObserver)
   ========================================================================== */

(function () {
  'use strict';

  const prefersReducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* ===========================================================================
     1. DRAWER MENU
     ======================================================================== */
  const drawer       = document.getElementById('drawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const menuBtn      = document.getElementById('menuBtn');
  const drawerClose  = document.getElementById('drawerClose');

  function openDrawer() {
    drawerOverlay.hidden = false;
    requestAnimationFrame(() => {
      drawerOverlay.classList.add('open');
      drawer.classList.add('open');
    });
    drawer.setAttribute('aria-hidden', 'false');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawerOverlay.classList.remove('open');
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    // delay matches CSS transition so overlay stays until animation ends
    setTimeout(() => { drawerOverlay.hidden = true; }, 320);
  }

  menuBtn.addEventListener('click', () => {
    drawer.classList.contains('open') ? closeDrawer() : openDrawer();
  });
  drawerOverlay.addEventListener('click', closeDrawer);
  drawerClose.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
  });

  // close drawer whenever a nav link is activated
  drawer.querySelectorAll('a[data-nav]').forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });


  /* ===========================================================================
     2. HERO SLIDER
     ======================================================================== */
  const slides   = Array.from(document.querySelectorAll('.slide'));
  const dotsWrap = document.getElementById('dots');
  const hero     = document.querySelector('.hero');

  const AUTOPLAY_MS = 5000;
  const SWIPE_THRESHOLD = 40; // px

  let currentSlide = 0;
  let autoplayTimer = null;

  // build dots for each slide
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Slide ' + (i + 1));
    dot.addEventListener('click', () => {
      goToSlide(i);
      restartAutoplay();
    });
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() { goToSlide(currentSlide + 1); }

  function restartAutoplay() {
    clearInterval(autoplayTimer);
    if (!prefersReducedMotion) {
      autoplayTimer = setInterval(nextSlide, AUTOPLAY_MS);
    }
  }
  restartAutoplay();

  // touch swipe
  let touchStartX = null;
  hero.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  hero.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      goToSlide(currentSlide + (deltaX < 0 ? 1 : -1));
      restartAutoplay();
    }
    touchStartX = null;
  }, { passive: true });


  /* ===========================================================================
     3. SCROLL REVEAL
     ======================================================================== */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach((el) => observer.observe(el));
  } else {
    // fallback: just show everything
    revealEls.forEach((el) => el.classList.add('in'));
  }

})();

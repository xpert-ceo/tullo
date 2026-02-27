/***************************************
 * TULLO – INTELLIGENT REDESIGN (OPTIMIZED)
 ***************************************/
(function() {
  'use strict';

  // ----- THEME MANAGEMENT (system + manual toggle) -----
  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  const headerLogo = document.getElementById('headerLogo');
  const footerLogo = document.getElementById('footerLogo');

  // set initial theme based on system or saved preference
  const savedTheme = localStorage.getItem('tullo-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    body.classList.add(`theme-${savedTheme}`);
  } else {
    // system default
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    body.classList.add(systemDark ? 'theme-dark' : 'theme-light');
  }

  themeToggle.addEventListener('click', () => {
    if (body.classList.contains('theme-dark')) {
      body.classList.replace('theme-dark', 'theme-light');
      localStorage.setItem('tullo-theme', 'light');
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      body.classList.replace('theme-light', 'theme-dark');
      localStorage.setItem('tullo-theme', 'dark');
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
  });
  // set initial icon
  themeToggle.innerHTML = body.classList.contains('theme-dark') ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';

  // ----- STICKY HEADER SCROLL EFFECT (clean) -----
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // ----- 3D TILT + SPOTLIGHT for all .tilt-container -----
  const tiltContainers = document.querySelectorAll('.tilt-container');
  const MAX_ROTATE = 9;

  function updateTilt(e, container) {
    const rect = container.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const px = Math.min(Math.max(x, 0), 1);
    const py = Math.min(Math.max(y, 0), 1);
    const rotateY = (px - 0.5) * MAX_ROTATE * 1.6;
    const rotateX = (0.5 - py) * MAX_ROTATE * 1.6;
    const img = container.querySelector('img');
    const spotlight = container.querySelector('.spotlight');
    if (img) {
      img.style.transition = 'none';
      img.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
    if (spotlight) {
      const posX = e.clientX - rect.left;
      const posY = e.clientY - rect.top;
      spotlight.style.transition = 'none';
      spotlight.style.left = `${Math.min(Math.max(posX, 10), rect.width - 10)}px`;
      spotlight.style.top = `${Math.min(Math.max(posY, 10), rect.height - 10)}px`;
    }
  }

  function resetTilt(container) {
    const img = container.querySelector('img');
    const spotlight = container.querySelector('.spotlight');
    if (img) {
      img.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
      img.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }
    if (spotlight) {
      spotlight.style.transition = 'left 0.5s, top 0.5s';
      spotlight.style.left = '50%';
      spotlight.style.top = '50%';
    }
  }

  tiltContainers.forEach(container => {
    container.addEventListener('mousemove', (e) => updateTilt(e, container));
    container.addEventListener('mouseleave', () => resetTilt(container));
  });

  // disable tilt on touch devices
  if ('ontouchstart' in window) {
    tiltContainers.forEach(container => {
      container.removeEventListener('mousemove', updateTilt);
      container.removeEventListener('mouseleave', resetTilt);
    });
  }

  // ----- DYNAMIC ISLAND (improved, intersection observer based) -----
  const island = document.getElementById('dynamicIsland');
  const label = document.getElementById('diLabel');
  const icon = document.getElementById('diIcon');
  let islandTimeout;

  function morphIsland(text, iconClass) {
    clearTimeout(islandTimeout);
    island.classList.remove('compress');
    island.classList.add('expand');
    label.textContent = text;
    icon.className = iconClass + ' di-status';
    islandTimeout = setTimeout(() => {
      island.classList.remove('expand');
      island.classList.add('compress');
      label.textContent = 'Tullo';
      icon.className = 'fas fa-circle di-status';
    }, 2000);
  }

  // section definitions with new IDs
  const sections = [
    { id: 'heroSection', text: 'Infrastructure', icon: 'fas fa-cloud' },
    { id: 'whoSection', text: 'Clients', icon: 'fas fa-users' },
    { id: 'systemsSection', text: 'Systems', icon: 'fas fa-microchip' },
    { id: 'processSection', text: 'Process', icon: 'fas fa-cogs' },
    { id: 'pricingSection', text: 'Pricing', icon: 'fas fa-tag' },
    { id: 'testimonialsSection', text: 'Trust', icon: 'fas fa-star' },
    { id: 'contactSection', text: 'Contact', icon: 'fas fa-envelope' }
  ];

  // use IntersectionObserver for smoother island updates (no scroll jitter)
  const observerOptions = { threshold: 0.3, rootMargin: '-80px 0px -80px 0px' };
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;
        const match = sections.find(s => s.id === sectionId);
        if (match) morphIsland(match.text, match.icon);
      }
    });
  }, observerOptions);

  sections.forEach(s => {
    const el = document.getElementById(s.id);
    if (el) sectionObserver.observe(el);
  });

  // ----- CTA morph (mouseenter) -----
  document.querySelectorAll('.header-cta, .hero-cta, .system-cta, .who-cta').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      morphIsland('Let\'s talk', 'fas fa-rocket');
    });
  });

  // ----- CONTACT ACCORDION (clean) -----
  const groups = document.querySelectorAll('.contact-group');
  groups.forEach(group => {
    const header = group.querySelector('.contact-header');
    header.addEventListener('click', () => {
      const isOpen = group.classList.contains('open');
      groups.forEach(g => g.classList.remove('open'));
      if (!isOpen) group.classList.add('open');
    });
  });

  // ----- PRICING CAROUSEL MOBILE (no toggles, just grid + horizontal scroll) -----
  // already handled by CSS grid + overflow. add smooth snap on mobile
  const pricingCards = document.querySelectorAll('.pricing-grid, .maintenance-grid');
  pricingCards.forEach(grid => {
    grid.style.scrollSnapType = 'x mandatory';
  });

  // ----- TESTIMONIALS INFINITE SCROLL (duplicate if needed) -----
  const track = document.getElementById('testimonialsTrack');
  if (track) {
    // ensure enough items for seamless loop (already duplicated in html)
  }

  // ----- REMOVE REDUNDANT SCROLL FIXES, all observers used -----
  console.log('Tullo · infrastructure studio ready');
})();

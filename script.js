// =============================================
// TULLO – MASTER JAVASCRIPT (CONSOLIDATED)
// All interactions: header, about spotlight, services,
// pricing toggle, contact accordion, dynamic island,
// glass tilt, testimonials infinite scroll.
// =============================================
(function() {
  'use strict';

  // ----- UTILITIES -----
  const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  };

  // ----- DOM ELEMENTS -----
  const header = document.querySelector('header');
  const aboutSection = document.querySelector('.about');
  const imageContainer = document.querySelector('.about-image');
  const img = imageContainer?.querySelector('img');
  const island = document.getElementById('dynamicIsland');
  const islandLabel = document.getElementById('diLabel');
  const islandIcon = document.getElementById('diIcon');

  // ----- HEADER SCROLL EFFECT -----
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // ----- ABOUT SPOTLIGHT + 3D TILT (desktop only) -----
  if (imageContainer && img && aboutSection) {
    // Create spotlight element
    const spotlight = document.createElement('div');
    spotlight.className = 'spotlight';
    spotlight.style.left = '50%';
    spotlight.style.top = '50%';
    imageContainer.appendChild(spotlight);

    const MAX_ROTATE = 9; // subtle tilt

    function updateMouseEffects(e) {
      const rect = imageContainer.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      // 3D rotation
      const rotateY = (x - 0.5) * MAX_ROTATE * 1.6;
      const rotateX = (0.5 - y) * MAX_ROTATE * 1.6;
      img.style.transition = 'none';
      img.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

      // Spotlight follow
      const posX = e.clientX - rect.left;
      const posY = e.clientY - rect.top;
      spotlight.style.transition = 'none';
      spotlight.style.left = `${Math.min(Math.max(posX, 10), rect.width - 10)}px`;
      spotlight.style.top = `${Math.min(Math.max(posY, 10), rect.height - 10)}px`;
    }

    function resetEffects() {
      img.style.transition = 'transform 0.55s cubic-bezier(0.23, 1, 0.32, 1)';
      img.style.transform = 'rotateX(0deg) rotateY(0deg)';
      spotlight.style.transition = 'left 0.55s cubic-bezier(0.23, 1, 0.32, 1), top 0.55s cubic-bezier(0.23, 1, 0.32, 1)';
      spotlight.style.left = '50%';
      spotlight.style.top = '50%';
    }

    // Only attach mouse events on non-touch devices
    if (!('ontouchstart' in window)) {
      imageContainer.addEventListener('mousemove', updateMouseEffects);
      imageContainer.addEventListener('mouseleave', resetEffects);
    } else {
      // Touch fallback: no tilt, static spotlight
      img.style.transform = 'rotateX(0deg) rotateY(0deg)';
      spotlight.style.opacity = '0.5';
    }

    // Intersection Observer for about section fade-in
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );
    observer.observe(aboutSection);

    // Immediate check in case already visible
    if (aboutSection.getBoundingClientRect().top < window.innerHeight - 100) {
      aboutSection.classList.add('visible');
    }
  }

  // ----- SERVICES FADE-IN (cards & header) -----
  const serviceElements = document.querySelectorAll('.services .service-card, .services-header, .brand-impact');
  if (serviceElements.length) {
    const serviceObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.style.transition = 'all 0.8s cubic-bezier(0.2,0.9,0.3,1)';
            serviceObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    serviceElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      serviceObserver.observe(el);
    });
  }

  // ----- PRICING TOGGLE (single implementation) -----
  const toggleBtns = document.querySelectorAll('.toggle-btn');
  const categories = document.querySelectorAll('.carousel-category');
  if (toggleBtns.length && categories.length) {
    function activateCategory(categoryId) {
      toggleBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.category === categoryId));
      categories.forEach(cat => cat.classList.toggle('active', cat.dataset.category === categoryId));

      // Update dynamic island if it exists
      if (island) {
        morphIsland(categoryId.charAt(0).toUpperCase() + categoryId.slice(1) + ' Plan', 'fas fa-tag');
      }

      // Reset horizontal scroll for the newly active category
      categories.forEach(cat => {
        if (cat.classList.contains('active')) {
          cat.scrollLeft = 0;
        }
      });
    }

    toggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const catId = btn.dataset.category;
        if (catId) activateCategory(catId);
      });
    });

    // Set initial active category
    const activeBtn = document.querySelector('.toggle-btn.active') || toggleBtns[0];
    if (activeBtn) activateCategory(activeBtn.dataset.category);
  }

  // ----- CONTACT ACCORDION -----
  const contactGroups = document.querySelectorAll('.contact-group');
  if (contactGroups.length) {
    function closeAllExcept(current) {
      contactGroups.forEach(g => { if (g !== current) g.classList.remove('open'); });
    }
    contactGroups.forEach(group => {
      const headerBtn = group.querySelector('.contact-header');
      if (headerBtn) {
        headerBtn.addEventListener('click', (e) => {
          e.preventDefault();
          if (group.classList.contains('open')) {
            group.classList.remove('open');
          } else {
            closeAllExcept(group);
            group.classList.add('open');
          }
        });
      }
    });
  }

  // ----- TESTIMONIALS INFINITE SCROLL (duplicate cards) -----
  const testimonialTrack = document.getElementById('testimonialsTrack');
  if (testimonialTrack && testimonialTrack.dataset.cloned !== 'true') {
    const originalCards = Array.from(testimonialTrack.children);
    if (originalCards.length) {
      function duplicateCards() {
        const fragment = document.createDocumentFragment();
        originalCards.forEach(card => fragment.appendChild(card.cloneNode(true)));
        testimonialTrack.appendChild(fragment);
      }
      function ensureSufficientClones() {
        const marquee = document.querySelector('.testimonials-marquee');
        if (!marquee) return;
        const containerW = marquee.offsetWidth;
        const singleSetW = testimonialTrack.scrollWidth / 2;
        let sets = 2;
        while (singleSetW * sets < containerW * 2) {
          const frag = document.createDocumentFragment();
          originalCards.forEach(card => frag.appendChild(card.cloneNode(true)));
          testimonialTrack.appendChild(frag);
          sets++;
        }
      }
      duplicateCards();
      testimonialTrack.dataset.cloned = 'true';
      window.addEventListener('load', ensureSufficientClones);
      window.addEventListener('resize', debounce(ensureSufficientClones, 150));
    }
  }

  // ----- DYNAMIC ISLAND (only if element exists) -----
  if (island && islandLabel && islandIcon) {
    let islandTimeout;

    function morphIsland(text, iconClass) {
      clearTimeout(islandTimeout);
      island.classList.remove('compress');
      island.classList.add('expand');
      islandLabel.textContent = text;
      islandIcon.className = iconClass + ' di-status';

      islandTimeout = setTimeout(() => {
        island.classList.remove('expand');
        island.classList.add('compress');
        islandLabel.textContent = 'Tullo Ready';
        islandIcon.className = 'fas fa-circle di-status';
      }, 1800);
    }

    // Expose morphIsland globally so other functions can call it (e.g., pricing toggle)
    window.morphIsland = morphIsland;

    // Section detection on scroll
    const sections = [
      { id: 'heroSection', text: 'Home', icon: 'fas fa-house' },
      { id: 'aboutSection', text: 'About', icon: 'fas fa-user' },
      { id: 'servicesSection', text: 'Services', icon: 'fas fa-layer-group' },
      { id: 'pricingSection', text: 'Pricing', icon: 'fas fa-tag' },
      { id: 'testimonialsSection', text: 'Testimonials', icon: 'fas fa-star' },
      { id: 'contactSection', text: 'Contact', icon: 'fas fa-envelope' }
    ];

    window.addEventListener('scroll', () => {
      sections.forEach(section => {
        const el = document.getElementById(section.id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 140 && rect.bottom >= 140) {
          morphIsland(section.text, section.icon);
        }
      });
    });

    // CTA hover morph
    const cta = document.querySelector('.header-cta');
    if (cta) {
      cta.addEventListener('mouseenter', () => {
        morphIsland('Get Started', 'fas fa-rocket');
      });
    }
  }

  // ----- GLASS TILT EFFECT ON HOVER (for all glass elements) -----
  const glassElements = document.querySelectorAll('.header-cta, .hero-cta, .btn, .header-icon a');
  glassElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      el.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.08)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(700px) rotateX(0) rotateY(0) scale(1)';
    });
  });

})();

// ===== STICKY HEADER =====
const header = document.querySelector("header");
window.addEventListener("scroll", () => {
  if (window.scrollY > 40) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// ===== ABOUT SECTION – 3D TILT & SPOTLIGHT =====
(function() {
  'use strict';

  const section = document.querySelector('.about');
  const imageContainer = document.querySelector('.about-image');
  const img = imageContainer?.querySelector('img');

  if (!imageContainer || !img || !section) return;

  const spotlight = document.createElement('div');
  spotlight.className = 'spotlight';
  spotlight.style.left = '50%';
  spotlight.style.top = '50%';
  imageContainer.appendChild(spotlight);

  const MAX_ROTATE = 9;

  function updateMouseEffects(e) {
    const rect = imageContainer.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const px = Math.min(Math.max(x, 0), 1);
    const py = Math.min(Math.max(y, 0), 1);

    const rotateY = (px - 0.5) * MAX_ROTATE * 1.6;
    const rotateX = (0.5 - py) * MAX_ROTATE * 1.6;

    img.style.transition = 'none';
    img.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

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

  imageContainer.addEventListener('mousemove', updateMouseEffects);
  imageContainer.addEventListener('mouseleave', resetEffects);

  if ('ontouchstart' in window) {
    imageContainer.removeEventListener('mousemove', updateMouseEffects);
    imageContainer.removeEventListener('mouseleave', resetEffects);
    img.style.transform = 'rotateX(0deg) rotateY(0deg)';
    spotlight.style.left = '50%';
    spotlight.style.top = '50%';
    spotlight.style.opacity = '0.5';
  }

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
  observer.observe(section);

  const rect = section.getBoundingClientRect();
  if (rect.top < window.innerHeight - 100 && rect.bottom > 0) {
    section.classList.add('visible');
  }
})();

// ===== SERVICES FADE-IN =====
document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(".services .service-card, .services-header, .brand-impact");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        entry.target.style.transition = "all 0.8s cubic-bezier(0.2,0.9,0.3,1)";
      }
    });
  }, { threshold: 0.2 });

  elements.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    observer.observe(el);
  });
});

// ===== DYNAMIC ISLAND =====
const island = document.getElementById("dynamicIsland");
const label = document.getElementById("diLabel");
const icon = document.getElementById("diIcon");
let islandTimeout;

function morphIsland(text, iconClass) {
  clearTimeout(islandTimeout);
  island.classList.remove("compress");
  island.classList.add("expand");
  label.textContent = text;
  icon.className = iconClass + " di-status";

  islandTimeout = setTimeout(() => {
    island.classList.remove("expand");
    island.classList.add("compress");
    label.textContent = "Tullo Ready";
    icon.className = "fas fa-circle di-status";
  }, 1800);
}

const sections = [
  { id: "heroSection", text: "Home", icon: "fas fa-house" },
  { id: "aboutSection", text: "About", icon: "fas fa-user" },
  { id: "servicesSection", text: "Services", icon: "fas fa-layer-group" },
  { id: "pricingSection", text: "Pricing", icon: "fas fa-tag" },
  { id: "testimonialsSection", text: "Testimonials", icon: "fas fa-star" },
  { id: "contactSection", text: "Contact", icon: "fas fa-envelope" }
];

window.addEventListener("scroll", () => {
  sections.forEach(section => {
    const el = document.getElementById(section.id);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top <= 140 && rect.bottom >= 140) {
      morphIsland(section.text, section.icon);
    }
  });
});

const cta = document.querySelector(".header-cta");
cta?.addEventListener("mouseenter", () => {
  morphIsland("Get Started", "fas fa-rocket");
});

// ===== 3D TILT ON GLASS ELEMENTS =====
document.querySelectorAll(".header-cta, .hero-cta, .btn, .header-icon a").forEach(glass => {
  glass.addEventListener("mousemove", e => {
    const rect = glass.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    glass.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.08)`;
  });

  glass.addEventListener("mouseleave", () => {
    glass.style.transform = "perspective(700px) rotateX(0) rotateY(0) scale(1)";
  });
});

// ===== PRICING TOGGLE =====
document.addEventListener("DOMContentLoaded", () => {
  const toggleButtons = document.querySelectorAll(".pricing-toggle .toggle-btn");
  const categories = document.querySelectorAll(".carousel-category");

  function setActiveCategory(categoryId) {
    categories.forEach(cat => {
      cat.classList.toggle("active", cat.id === categoryId);
    });
    toggleButtons.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.category === categoryId);
    });
    morphIsland(`${categoryId.charAt(0).toUpperCase() + categoryId.slice(1)} Plan`, "fas fa-tag");
  }

  toggleButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      setActiveCategory(btn.dataset.category);
    });
  });

  const defaultActive = document.querySelector(".toggle-btn.active")?.dataset.category || "web";
  setActiveCategory(defaultActive);

  categories.forEach(carousel => {
    let isDown = false;
    let startX, scrollLeft;

    carousel.addEventListener("mousedown", (e) => {
      isDown = true;
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
      carousel.style.cursor = "grabbing";
    });

    carousel.addEventListener("mouseleave", () => {
      isDown = false;
      carousel.style.cursor = "grab";
    });

    carousel.addEventListener("mouseup", () => {
      isDown = false;
      carousel.style.cursor = "grab";
    });

    carousel.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 2;
      carousel.scrollLeft = scrollLeft - walk;
    });
  });
});

// ===== CONTACT ACCORDION =====
(function() {
  const groups = document.querySelectorAll('.contact-group');
  if (groups.length === 0) return;

  function closeAllExcept(current) {
    groups.forEach(group => {
      if (group !== current) group.classList.remove('open');
    });
  }

  groups.forEach(group => {
    const header = group.querySelector('.contact-header');
    if (!header) return;

    header.addEventListener('click', (e) => {
      e.preventDefault();
      if (group.classList.contains('open')) {
        group.classList.remove('open');
      } else {
        closeAllExcept(group);
        group.classList.add('open');
      }
    });
  });
})();

// ===== PRICING SCROLL FALLBACK (with logging) =====
(function() {
  function fixPricingScroll() {
    if (window.innerWidth <= 600) {
      const activeCategory = document.querySelector('.carousel-category.active');
      if (activeCategory) {
        activeCategory.style.overflowX = 'auto';
        activeCategory.style.webkitOverflowScrolling = 'touch';
        console.log('✅ Pricing scroll fix applied – active category:', activeCategory.id);
      } else {
        console.warn('⚠️ No active pricing category found');
      }
    }
  }

  window.addEventListener('load', fixPricingScroll);
  window.addEventListener('resize', fixPricingScroll);

  document.querySelectorAll('.pricing-toggle .toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => setTimeout(fixPricingScroll, 50));
  });
})();

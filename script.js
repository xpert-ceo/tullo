 const header = document.querySelector("header");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  const imageContainer = document.querySelector('.about-image');

imageContainer.addEventListener('mousemove', (e) => {
  const rect = imageContainer.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  imageContainer.style.setProperty('--x', `${x}px`);
  imageContainer.style.setProperty('--y', `${y}px`);
});

imageContainer.addEventListener('mouseleave', () => {
  imageContainer.style.setProperty('--x', `50%`);
  imageContainer.style.setProperty('--y', `50%`);
});

const aboutSection = document.querySelector('.about');

window.addEventListener('scroll', () => {
  const trigger = window.innerHeight * 0.8;
  const sectionTop = aboutSection.getBoundingClientRect().top;

  if (sectionTop < trigger) {
    aboutSection.classList.add('show');
  }
});

// about functions


(function() {
  'use strict';

  // ----- DOM refs -----
  const section = document.querySelector('.about');
  const imageContainer = document.querySelector('.about-image');
  const img = imageContainer?.querySelector('img');

  // exit if required elements missing
  if (!imageContainer || !img || !section) return;

  // ----- spotlight overlay (cursor‑follow radial) -----
  const spotlight = document.createElement('div');
  spotlight.className = 'spotlight';
  spotlight.style.left = '50%';
  spotlight.style.top = '50%';
  imageContainer.appendChild(spotlight);

  // ----- 3D tilt + spotlight follow -----
  const MAX_ROTATE = 9; // subtle, premium

  function updateMouseEffects(e) {
    const rect = imageContainer.getBoundingClientRect();

    // normalized mouse position (0..1)
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const px = Math.min(Math.max(x, 0), 1);
    const py = Math.min(Math.max(y, 0), 1);

    // 3D rotation
    const rotateY = (px - 0.5) * MAX_ROTATE * 1.6;
    const rotateX = (0.5 - py) * MAX_ROTATE * 1.6;

    // apply – no transition for instant follow
    img.style.transition = 'none';
    img.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    // spotlight pixel position
    const posX = e.clientX - rect.left;
    const posY = e.clientY - rect.top;
    spotlight.style.transition = 'none';
    spotlight.style.left = `${Math.min(Math.max(posX, 10), rect.width - 10)}px`;
    spotlight.style.top = `${Math.min(Math.max(posY, 10), rect.height - 10)}px`;
  }

  function resetEffects() {
    // smooth return to neutral
    img.style.transition = 'transform 0.55s cubic-bezier(0.23, 1, 0.32, 1)';
    img.style.transform = 'rotateX(0deg) rotateY(0deg)';

    spotlight.style.transition = 'left 0.55s cubic-bezier(0.23, 1, 0.32, 1), top 0.55s cubic-bezier(0.23, 1, 0.32, 1)';
    spotlight.style.left = '50%';
    spotlight.style.top = '50%';
  }

  // attach mouse listeners
  imageContainer.addEventListener('mousemove', updateMouseEffects);
  imageContainer.addEventListener('mouseleave', resetEffects);

  // ----- disable tilt on touch devices (no cursor) -----
  if ('ontouchstart' in window) {
    imageContainer.removeEventListener('mousemove', updateMouseEffects);
    imageContainer.removeEventListener('mouseleave', resetEffects);
    img.style.transform = 'rotateX(0deg) rotateY(0deg)';
    spotlight.style.left = '50%';
    spotlight.style.top = '50%';
    spotlight.style.opacity = '0.5';
  }

  // ----- scroll animation (fade + slide) -----
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: '0px' }
  );

  observer.observe(section);

  // fallback: if already in viewport
  const rect = section.getBoundingClientRect();
  if (rect.top < window.innerHeight - 100 && rect.bottom > 0) {
    section.classList.add('visible');
  }
})();

// service functions

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

const island = document.getElementById("dynamicIsland");
const label = document.getElementById("diLabel");
const icon = document.getElementById("diIcon");

let islandTimeout;


/* ===============================
   MORPH FUNCTION
=============================== */

function morphIsland(text, iconClass)
{

    clearTimeout(islandTimeout);

    island.classList.remove("compress");

    island.classList.add("expand");

    label.textContent = text;

    icon.className = iconClass + " di-status";


    islandTimeout = setTimeout(() =>
    {

        island.classList.remove("expand");

        island.classList.add("compress");

        label.textContent = "Tullo Ready";

        icon.className = "fas fa-circle di-status";

    }, 1800);

}


/* ===============================
   SECTION DETECTION
=============================== */

const sections = [

    { id:"heroSection", text:"Home", icon:"fas fa-house" },

    { id:"aboutSection", text:"About", icon:"fas fa-user" },

    { id:"servicesSection", text:"Services", icon:"fas fa-layer-group" },

    { id:"pricingSection", text:"Pricing", icon:"fas fa-tag" },

    { id:"testimonialsSection", text:"Testimonials", icon:"fas fa-star" },

    { id:"contactSection", text:"Contact", icon:"fas fa-envelope" }

];


window.addEventListener("scroll", () =>
{

    sections.forEach(section =>
    {

        const el = document.getElementById(section.id);

        if(!el) return;

        const rect = el.getBoundingClientRect();

        if(rect.top <= 140 && rect.bottom >= 140)
        {

            morphIsland(section.text, section.icon);

        }

    });

});


/* ===============================
   CTA MORPH
=============================== */

const cta = document.querySelector(".header-cta");

cta.addEventListener("mouseenter", () =>
{

    morphIsland("Get Started", "fas fa-rocket");

});

document.querySelectorAll(
".header-cta, .hero-cta, .btn, .header-icon a"
)
.forEach(glass =>
{

    glass.addEventListener("mousemove", e =>
    {

        const rect = glass.getBoundingClientRect()

        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const centerX = rect.width / 2
        const centerY = rect.height / 2

        const rotateX = (y - centerY) / 10
        const rotateY = (centerX - x) / 10

        glass.style.transform =
        `perspective(700px)
         rotateX(${rotateX}deg)
         rotateY(${rotateY}deg)
         scale(1.08)`

    })


    glass.addEventListener("mouseleave", () =>
    {

        glass.style.transform =
        "perspective(700px) rotateX(0) rotateY(0) scale(1)"

    })

})

document.addEventListener("DOMContentLoaded", () => {
  
  const toggleButtons = document.querySelectorAll(".pricing-toggle .toggle-btn");
  const categories = document.querySelectorAll(".carousel-category");

  // FUNCTION: Set Active Category
  function setActiveCategory(categoryId) {
    categories.forEach(cat => {
      if (cat.id === categoryId) {
        cat.classList.add("active");
      } else {
        cat.classList.remove("active");
      }
    });
    
    toggleButtons.forEach(btn => {
      if (btn.dataset.category === categoryId) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Update Dynamic Island with current category
    morphIsland(`${categoryId.replace(/^\w/, c => c.toUpperCase())} Plan Active`, "fas fa-tag");
  }

  // EVENT LISTENER: Toggle Buttons
  toggleButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      setActiveCategory(btn.dataset.category);
    });
  });

  // OPTIONAL: Auto-scroll carousel on small screens
  const carousels = document.querySelectorAll(".carousel-category");
  carousels.forEach(carousel => {
    let isDragging = false;
    let startX;
    let scrollLeft;

    carousel.addEventListener("mousedown", e => {
      isDragging = true;
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener("mouseleave", () => isDragging = false);
    carousel.addEventListener("mouseup", () => isDragging = false);

    carousel.addEventListener("mousemove", e => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 2; // scroll speed
      carousel.scrollLeft = scrollLeft - walk;
    });
  });

  // Set default active category on page load
  setActiveCategory("web");

});

(function() {
    // Accordion for contact groups – independent, closes others when opened
    const groups = document.querySelectorAll('.contact-group');
    
    if (groups.length === 0) return;

    function closeAllExcept(current) {
      groups.forEach(group => {
        if (group !== current) {
          group.classList.remove('open');
        }
      });
    }

    groups.forEach(group => {
      const header = group.querySelector('.contact-header');
      if (!header) return;

      header.addEventListener('click', (e) => {
        e.preventDefault();
        // if already open, just close it
        if (group.classList.contains('open')) {
          group.classList.remove('open');
        } else {
          // close others, then open current
          closeAllExcept(group);
          group.classList.add('open');
        }
      });
    });

    // Optional: close if clicking outside? not needed for now

    // Add subtle animation to footer icons (optional)
    console.log('Tullo interactive contact ready');
  })();

  (function() {
    // Pricing category toggle with smooth transition
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const categories = document.querySelectorAll('.carousel-category');
    
    if (!toggleBtns.length || !categories.length) return;

    function activateCategory(categoryId) {
      // Update buttons
      toggleBtns.forEach(btn => {
        const isActive = btn.dataset.category === categoryId;
        btn.classList.toggle('active', isActive);
      });

      // Update category visibility
      categories.forEach(cat => {
        const isActive = cat.dataset.category === categoryId;
        if (isActive) {
          cat.classList.add('active');
        } else {
          cat.classList.remove('active');
        }
      });
    }

    // Add click handlers
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const categoryId = btn.dataset.category;
        if (!categoryId) return;
        activateCategory(categoryId);
      });
    });

    // Set initial active (first button/category)
    const firstActiveBtn = document.querySelector('.toggle-btn.active');
    if (firstActiveBtn) {
      const initialCategory = firstActiveBtn.dataset.category;
      if (initialCategory) activateCategory(initialCategory);
    } else if (toggleBtns.length) {
      // fallback to first
      activateCategory(toggleBtns[0].dataset.category);
    }

    // Optional: reset scroll position when switching categories
    categories.forEach(cat => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.target.classList.contains('active')) {
            // Scroll the newly active category to the left (optional)
            mutation.target.scrollLeft = 0;
          }
        });
      });
      observer.observe(cat, { attributes: true, attributeFilter: ['class'] });
    });
  })();

/* ============================================================
   Project Detail Luxury — Interactions & Animations
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // We no longer init automatically here; we wait for fetch-project-detail.js to call it.
});

function initPDLInteractions() {

  /* ----------------------------------------------------------
     1. SCROLL REVEAL (pdl-reveal-up)
     ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.pdl-reveal-up');

  if (revealEls.length > 0 && 'IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealEls.forEach((el, index) => {
      // Add slight staggered delay based on DOM order for nearby elements
      if (!el.style.transitionDelay && el.parentElement.classList.contains('pdl-highlights')) {
        el.style.transitionDelay = `${index * 0.1}s`;
      }
      revealObs.observe(el);
    });
  }


  /* ----------------------------------------------------------
     2. ANIMATED COUNTERS
     ---------------------------------------------------------- */
  const counters = document.querySelectorAll('.counter');
  
  if (counters.length > 0 && 'IntersectionObserver' in window) {
    const counterObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = +entry.target.getAttribute('data-target');
          const duration = 2000;
          const increment = target / (duration / 16);
          let current = 0;
          
          const updateCounter = () => {
            current += increment;
            if (current < target) {
              entry.target.innerText = Math.ceil(current);
              requestAnimationFrame(updateCounter);
            } else {
              entry.target.innerText = target;
            }
          };
          
          updateCounter();
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObs.observe(counter));
  }

  /* ----------------------------------------------------------
     3. LIGHTBOX
     ---------------------------------------------------------- */
  const lightbox = document.getElementById('pdl-lightbox');
  const lightboxImg = lightbox?.querySelector('img');

  // We use event delegation since gallery items are dynamically injected
  document.body.addEventListener('click', (e) => {
    const galleryItem = e.target.closest('.pdl-gallery-item');
    if (galleryItem) {
      const img = galleryItem.querySelector('img');
      if (img && lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }
    }
  });

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.style.display === 'flex') {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }


  /* ----------------------------------------------------------
     3. 3D BROCHURE TILT EFFECT (Mouse move)
     ---------------------------------------------------------- */
  const brochureBook = document.querySelector('.pdl-brochure-book');
  const brochureContainer = document.querySelector('.pdl-brochure-container');
  
  if (brochureBook && brochureContainer && window.matchMedia('(pointer: fine)').matches) {
    brochureContainer.addEventListener('mousemove', (e) => {
      const rect = brochureContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * 15; // Max 15 deg tilt
      const rotateY = ((centerX - x) / centerX) * 15;
      
      brochureBook.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });
    
    brochureContainer.addEventListener('mouseleave', () => {
      brochureBook.style.transform = 'rotateY(-20deg) rotateX(5deg)';
    });
  }

}

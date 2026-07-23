/* ============================================================
   Project Detail Luxury — Interactions & Animations (v2.0)
   Scroll reveals, lightbox with prev/next, counters, brochure tilt
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
     3. LIGHTBOX — Full gallery viewer with prev/next
     ---------------------------------------------------------- */
  const lightbox = document.getElementById('pdl-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxCounter = document.getElementById('lightbox-counter');

  let currentLightboxIndex = 0;

  function getGalleryImages() {
    return window.__pdlGalleryImages || [];
  }

  function openLightbox(index) {
    const images = getGalleryImages();
    if (!images.length || !lightbox || !lightboxImg) return;
    
    currentLightboxIndex = index;
    lightboxImg.src = images[index];
    lightboxImg.alt = `Gallery Image ${index + 1}`;
    
    // Update counter
    if (lightboxCounter) {
      lightboxCounter.textContent = `${index + 1} / ${images.length}`;
    }

    // Show/hide nav buttons based on position
    if (lightboxPrev) lightboxPrev.style.display = images.length > 1 ? 'flex' : 'none';
    if (lightboxNext) lightboxNext.style.display = images.length > 1 ? 'flex' : 'none';

    lightbox.classList.add('is-active');
    document.body.style.overflow = 'hidden';

    // Re-trigger fade animation
    lightboxImg.style.animation = 'none';
    requestAnimationFrame(() => {
      lightboxImg.style.animation = 'pdlLightboxFadeIn 0.4s ease both';
    });
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  function navigateLightbox(direction) {
    const images = getGalleryImages();
    if (!images.length) return;

    currentLightboxIndex += direction;
    
    // Wrap around
    if (currentLightboxIndex < 0) currentLightboxIndex = images.length - 1;
    if (currentLightboxIndex >= images.length) currentLightboxIndex = 0;

    lightboxImg.style.animation = 'none';
    requestAnimationFrame(() => {
      lightboxImg.src = images[currentLightboxIndex];
      lightboxImg.alt = `Gallery Image ${currentLightboxIndex + 1}`;
      lightboxImg.style.animation = 'pdlLightboxFadeIn 0.3s ease both';
      
      if (lightboxCounter) {
        lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${images.length}`;
      }
    });
  }

  // Event delegation for gallery items (handles dynamically injected items)
  document.body.addEventListener('click', (e) => {
    const galleryItem = e.target.closest('.pdl-gallery-item');
    if (galleryItem) {
      const index = parseInt(galleryItem.getAttribute('data-gallery-index'), 10);
      if (!isNaN(index)) {
        openLightbox(index);
      } else {
        // Fallback: find the image and try to open it
        const img = galleryItem.querySelector('img');
        if (img) {
          const images = getGalleryImages();
          const idx = images.indexOf(img.src);
          openLightbox(idx >= 0 ? idx : 0);
        }
      }
    }
  });

  // Close lightbox
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Navigation buttons
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateLightbox(-1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateLightbox(1);
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('is-active')) return;

    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        navigateLightbox(-1);
        break;
      case 'ArrowRight':
        navigateLightbox(1);
        break;
    }
  });

  // Touch swipe support for lightbox
  if (lightbox) {
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeDistance = touchStartX - touchEndX;

      if (Math.abs(swipeDistance) > 50) {
        if (swipeDistance > 0) {
          navigateLightbox(1); // Swipe left → next
        } else {
          navigateLightbox(-1); // Swipe right → prev
        }
      }
    }, { passive: true });
  }


  /* ----------------------------------------------------------
     4. 3D BROCHURE TILT EFFECT (Mouse move)
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

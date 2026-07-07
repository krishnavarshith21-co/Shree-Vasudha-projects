/* ============================================================
   SHREE VASUDHA PROJECTS — Core JavaScript
   Scroll animations, smooth interactions, and utilities.
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------
     SCROLL REVEAL — IntersectionObserver
     Reveals .reveal elements as they enter the viewport.
     -------------------------------------------------------- */

  const revealElements = document.querySelectorAll(
    '.reveal, .reveal--left, .reveal--right, .reveal--scale, .reveal--clip, .stagger-children'
  );

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    /* Fallback: show everything immediately */
    revealElements.forEach((el) => el.classList.add('is-visible'));
  }


  /* --------------------------------------------------------
     NAVBAR — Scroll behaviour
     Adds solid background when scrolled past threshold.
     -------------------------------------------------------- */

  const navbar = document.getElementById('navbar');

  if (navbar) {
    const HIDE_THRESHOLD = 70;
    const SCROLL_DELTA = 8;
    let lastKnownScroll = window.scrollY;
    let ticking = false;

    const updateNavbar = () => {
      const currentScroll = window.scrollY;
      
      // Ignore tiny scroll movements for performance
      if (Math.abs(currentScroll - lastKnownScroll) < SCROLL_DELTA && currentScroll > HIDE_THRESHOLD) {
        ticking = false;
        return;
      }

      if (currentScroll <= HIDE_THRESHOLD) {
        // Top of page
        navbar.classList.remove('navbar--hidden');
        navbar.classList.remove('navbar--scrolled');
      } else {
        navbar.classList.add('navbar--scrolled');
        if (currentScroll > lastKnownScroll) {
          // Scrolling down
          navbar.classList.add('navbar--hidden');
        } else {
          // Scrolling up
          navbar.classList.remove('navbar--hidden');
        }
      }
      
      lastKnownScroll = currentScroll;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    }, { passive: true });

    /* Initial check */
    updateNavbar();
  }


  /* --------------------------------------------------------
     MOBILE MENU TOGGLE
     -------------------------------------------------------- */

  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('is-open');
      menuToggle.classList.toggle('is-active');
      menuToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }

  const mobileDropdownToggles = document.querySelectorAll('.mobile-menu__dropdown-toggle');
  mobileDropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = toggle.closest('.mobile-menu__dropdown');
      parent.classList.toggle('is-active');
      const expanded = toggle.getAttribute('aria-expanded') === 'true' || false;
      toggle.setAttribute('aria-expanded', !expanded);
    });
  });


  /* --------------------------------------------------------
     COUNTER ANIMATION
     Animates numbers from 0 to target on scroll.
     -------------------------------------------------------- */

  const counters = document.querySelectorAll('[data-count]');

  if (counters.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => counterObserver.observe(counter));
  }

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 2000;
    const startTime = performance.now();

    function updateCount(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      /* Ease out cubic */
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      el.textContent = prefix + current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    }

    requestAnimationFrame(updateCount);
  }


  /* --------------------------------------------------------
     PARALLAX (lightweight)
     Moves .parallax-bg elements on scroll.
     -------------------------------------------------------- */

  const parallaxElements = document.querySelectorAll('.parallax-bg');

  if (parallaxElements.length > 0) {
    let pTicking = false;

    window.addEventListener('scroll', () => {
      if (!pTicking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          parallaxElements.forEach((el) => {
            const parent = el.closest('.parallax-wrapper');
            if (parent) {
              const rect = parent.getBoundingClientRect();
              if (rect.bottom > 0 && rect.top < window.innerHeight) {
                const speed = parseFloat(el.dataset.speed) || 0.3;
                const yPos = -(scrollY - parent.offsetTop) * speed;
                el.style.transform = `translateY(${yPos}px)`;
              }
            }
          });
          pTicking = false;
        });
        pTicking = true;
      }
    }, { passive: true });
  }


  /* --------------------------------------------------------
     CURRENT YEAR — Footer copyright
     -------------------------------------------------------- */

  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* --------------------------------------------------------
     GLOBAL LUXURY DUST PARTICLES
     -------------------------------------------------------- */
  let canvas = document.getElementById('global-particles');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'global-particles';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '-1'; // Sit just behind content, above deep background
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);
  }
  
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.5; // 0.5px to 2.5px
        this.speedY = Math.random() * -0.5 - 0.1; // Float slowly upwards
        this.speedX = Math.random() * 0.4 - 0.2; // Drift left/right
        
        // Luxury gold and white colors
        const colors = [
          'rgba(255, 255, 255, 0.4)', // White
          'rgba(212, 175, 55, 0.5)',  // Gold
          'rgba(181, 155, 84, 0.6)'   // Theme Gold
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        
        // Twinkling effect
        this.opacity = Math.random();
        this.fadeSpeed = Math.random() * 0.02 + 0.005;
        this.fadingOut = Math.random() > 0.5;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;

        // Twinkle
        if (this.fadingOut) {
          this.opacity -= this.fadeSpeed;
          if (this.opacity <= 0.1) this.fadingOut = false;
        } else {
          this.opacity += this.fadeSpeed;
          if (this.opacity >= 1) this.fadingOut = true;
        }

        // Reset if off screen
        if (this.y < -10 || this.x < -10 || this.x > width + 10) {
          this.y = height + 10;
          this.x = Math.random() * width;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        // Apply twinkle opacity to base color
        const baseColor = this.color.substring(0, this.color.lastIndexOf(','));
        ctx.fillStyle = `${baseColor}, ${this.opacity * 0.8})`; // Max opacity 0.8 for subtlety
        
        ctx.fill();
      }
    }

    // Create particles based on screen size (subtle amount)
    const particleCount = Math.min(Math.floor(window.innerWidth / 15), 100);
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    };

    animate();
  }

  /* --------------------------------------------------------
     HERO PARTICLES — Live Interactive Animation
     -------------------------------------------------------- */
  const heroCanvas = document.getElementById('hero-particles');
  if (heroCanvas) {
    const heroCtx = heroCanvas.getContext('2d');
    let heroWidth, heroHeight;
    let heroParticlesArray = [];
    let mouse = { x: null, y: null };

    const resizeHero = () => {
      heroWidth = heroCanvas.width = heroCanvas.offsetWidth || window.innerWidth;
      heroHeight = heroCanvas.height = heroCanvas.offsetHeight || window.innerHeight;
    };
    
    window.addEventListener('resize', resizeHero);
    resizeHero();

    // Track mouse
    heroCanvas.parentElement.addEventListener('mousemove', (e) => {
      const rect = heroCanvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    heroCanvas.parentElement.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class HeroParticle {
      constructor() {
        this.x = Math.random() * heroWidth;
        this.y = Math.random() * heroHeight;
        this.size = Math.random() * 2 + 0.5; // 0.5px to 2.5px
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        // Accent color matching the theme (gold/warm)
        this.color = `rgba(212, 175, 55, ${Math.random() * 0.5 + 0.2})`;
        this.baseX = this.x;
        this.baseY = this.y;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > heroWidth) this.x = 0;
        else if (this.x < 0) this.x = heroWidth;
        if (this.y > heroHeight) this.y = 0;
        else if (this.y < 0) this.y = heroHeight;

        // Mouse interaction (repel slightly or move towards)
        if (mouse.x != null && mouse.y != null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 150) {
            // Parallax repel
            this.x -= dx * 0.02;
            this.y -= dy * 0.02;
          }
        }
      }
      draw() {
        heroCtx.beginPath();
        heroCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        heroCtx.fillStyle = this.color;
        heroCtx.fill();
      }
    }

    const initHeroParticles = () => {
      heroParticlesArray = [];
      const numParticles = Math.min(Math.floor(heroWidth * heroHeight / 9000), 100);
      for (let i = 0; i < numParticles; i++) {
        heroParticlesArray.push(new HeroParticle());
      }
    };
    initHeroParticles();

    const animateHeroParticles = () => {
      heroCtx.clearRect(0, 0, heroWidth, heroHeight);
      
      heroParticlesArray.forEach(p => {
        p.update();
        p.draw();
      });
      
      requestAnimationFrame(animateHeroParticles);
    };
    animateHeroParticles();
  }






/* --------------------------------------------------------
   GEOMETRIC LUXURY BACKGROUND
   -------------------------------------------------------- */
function initGeometricBackground() {
  const container = document.createElement('div');
  container.id = 'bg-shapes';
  // Insert as the very first child of body so it stays behind everything
  document.body.insertBefore(container, document.body.firstChild);

  const shapes = [
    '<svg viewBox="0 0 100 100"><polygon points="50,0 100,50 50,100 0,50" fill="none" stroke="currentColor" stroke-width="1"/></svg>',
    '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="49" fill="none" stroke="currentColor" stroke-width="1"/></svg>',
    '<svg viewBox="0 0 100 100"><rect x="15" y="15" width="70" height="70" fill="none" stroke="currentColor" stroke-width="1"/></svg>'
  ];

  const numShapes = 15; // Number of shapes on screen

  for (let i = 0; i < numShapes; i++) {
    const shapeEl = document.createElement('div');
    shapeEl.classList.add('bg-shape');
    
    // Pick random shape
    shapeEl.innerHTML = shapes[Math.floor(Math.random() * shapes.length)];
    
    // Random size (30px to 120px)
    const size = Math.random() * 90 + 30;
    shapeEl.style.width = `${size}px`;
    shapeEl.style.height = `${size}px`;
    
    // Random position
    shapeEl.style.left = `${Math.random() * 100}vw`;
    shapeEl.style.top = `${Math.random() * 100}vh`;
    
    // Random animation duration (20s to 50s)
    const duration = Math.random() * 30 + 20;
    shapeEl.style.animation = `floatShape ${duration}s infinite cubic-bezier(0.4, 0, 0.2, 1)`;
    
    // Random animation delay to offset cycles
    shapeEl.style.animationDelay = `-${Math.random() * duration}s`;

    container.appendChild(shapeEl);
  }
}
initGeometricBackground();
});



  

  
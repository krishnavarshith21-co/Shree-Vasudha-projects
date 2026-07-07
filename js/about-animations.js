document.addEventListener('DOMContentLoaded', () => {
  // Only run if GSAP is available
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    return;
  }

  // Register ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // 1. Fade Up Animations
  gsap.utils.toArray('.gsap-fade-up').forEach(element => {
    gsap.from(element, {
      y: 60,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  // 2. Fade Right (Text coming from left)
  gsap.utils.toArray('.gsap-fade-right').forEach(element => {
    gsap.from(element, {
      x: -60,
      opacity: 0,
      duration: 1.4,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  // 3. Fade Left (Images coming from right)
  gsap.utils.toArray('.gsap-fade-left').forEach(element => {
    gsap.from(element, {
      x: 60,
      opacity: 0,
      duration: 1.4,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  // 4. Image Parallax Effect
  gsap.utils.toArray('.gsap-parallax img').forEach(img => {
    gsap.to(img, {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: img.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });

  // 5. Counter Animation for Stats
  // Wait for the data to be fetched first before animating
  setTimeout(() => {
    gsap.utils.toArray('.gsap-counter .stat-item__value').forEach(counter => {
      // Extract number from the text content (e.g. "25+" -> 25)
      const text = counter.textContent;
      const targetNumber = parseInt(text.replace(/[^0-9]/g, '')) || 0;
      const suffix = text.replace(/[0-9]/g, '');

      // Store the final text to ensure exact match later
      const finalText = text;

      if (targetNumber > 0) {
        let obj = { val: 0 };
        gsap.to(obj, {
          val: targetNumber,
          duration: 2.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: counter,
            start: 'top 90%',
            toggleActions: 'play none none none'
          },
          onUpdate: function() {
            // For large numbers like 5000, maybe format with commas if needed,
            // but we'll stick to basic formatting
            let current = Math.floor(obj.val);
            if (targetNumber >= 1000) {
                // Formatting for thousands
                counter.textContent = current + suffix;
            } else {
                counter.textContent = current + suffix;
            }
          },
          onComplete: function() {
            // Ensure final text exactly matches DB (e.g. 12M+)
            counter.textContent = finalText;
          }
        });
      }
    });
  }, 1000); // Small delay to allow fetch-about.js to populate DOM

  // 6. Mouse Light Glow Effect
  const mouseLight = document.getElementById('mouse-light');
  if (mouseLight) {
    document.addEventListener('mousemove', (e) => {
      gsap.to(mouseLight, {
        x: e.clientX,
        y: e.clientY,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out'
      });
    });

    document.addEventListener('mouseleave', () => {
      gsap.to(mouseLight, { opacity: 0, duration: 0.5 });
    });
  }

  // 7. Timeline Animation
  const timelineProgress = document.getElementById('timeline-progress');
  if (timelineProgress) {
    gsap.to(timelineProgress, {
      height: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: '#timeline-container',
        start: 'top center',
        end: 'bottom center',
        scrub: true
      }
    });
  }

});

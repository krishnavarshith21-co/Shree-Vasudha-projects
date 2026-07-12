/* ============================================================
   SHREE VASUDHA PROJECTS — Theme Toggle Logic
   Handles dark/light theme switching with:
   - localStorage persistence
   - System preference detection on first visit
   - Smooth 500ms transition animation
   - Custom event dispatch for other scripts
   ============================================================ */

(function () {
  'use strict';

  const STORAGE_KEY = 'svp-theme';
  const TRANSITION_DURATION = 500;

  /**
   * Determine the initial theme:
   * 1. Check localStorage for saved preference
   * 2. Check system preference (prefers-color-scheme)
   * 3. Default to 'dark'
   */
  function getInitialTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  }

  /**
   * Apply theme to the document
   */
  function applyTheme(theme, animate) {
    const html = document.documentElement;

    if (animate) {
      // Add transition class for smooth animation
      html.classList.add('theme-transitioning');
    }

    html.setAttribute('data-theme', theme);

    // Update meta theme-color
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'light' ? '#F8F6F2' : '#141618');
    }

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, theme);

    // Dispatch custom event for other scripts (particles, etc.)
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));

    if (animate) {
      // Remove transition class after animation completes
      setTimeout(() => {
        html.classList.remove('theme-transitioning');
      }, TRANSITION_DURATION);
    }
  }

  /**
   * Toggle between themes
   */
  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next, true);
    updateToggleAria(next);
  }

  /**
   * Update ARIA labels on toggle buttons
   */
  function updateToggleAria(theme) {
    const toggleBtns = document.querySelectorAll('.theme-toggle__btn');
    toggleBtns.forEach(btn => {
      btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
      btn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    });
  }

  /**
   * Initialize theme on page load (no animation — instant)
   */
  const initialTheme = getInitialTheme();
  applyTheme(initialTheme, false);

  /**
   * Bind toggle buttons after DOM is ready
   */
  document.addEventListener('DOMContentLoaded', () => {
    const toggleBtns = document.querySelectorAll('.theme-toggle__btn');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', toggleTheme);
    });

    updateToggleAria(initialTheme);

    // Listen for system preference changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a preference
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) {
          applyTheme(e.matches ? 'light' : 'dark', true);
        }
      });
    }
  });

  // Expose for other scripts
  window.SVPTheme = {
    get current() {
      return document.documentElement.getAttribute('data-theme') || 'dark';
    },
    toggle: toggleTheme,
    set: (theme) => applyTheme(theme, true)
  };

})();

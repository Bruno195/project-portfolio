(function () {
  'use strict';

  function initNavMobile() {
    try {
      var navLinks = document.getElementById('nav-links');
      var toggle = document.getElementById('nav-toggle');
      if (!navLinks || !toggle) return;

      function closeMenu() {
        if (!navLinks.classList.contains('is-open')) return;
        navLinks.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('ds-menu-open');
      }

      // Close when a navigation link is tapped
      navLinks.addEventListener('click', function (event) {
        if (event.target.closest('a')) closeMenu();
      });

      // Close on Escape and return focus to the toggle
      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && navLinks.classList.contains('is-open')) {
          closeMenu();
          toggle.focus();
        }
      });

      // Keep body scroll locked while the menu is open
      toggle.addEventListener('click', function () {
        document.body.classList.toggle(
          'ds-menu-open',
          navLinks.classList.contains('is-open')
        );
      });

      // Reset state when resizing up to desktop
      var resizeTimer = null;
      window.addEventListener('resize', function () {
        if (resizeTimer) window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(function () {
          if (window.innerWidth > 768) closeMenu();
        }, 150);
      }, { passive: true });
    } catch (error) {
      console.warn('[nav-mobile.js] enhancement skipped:', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavMobile);
  } else {
    initNavMobile();
  }
})();

(function () {
  function initSectionAnimations() {
    try {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      var style = document.createElement('style');
      style.textContent = [
        '.ds-section-anim { opacity: 0; will-change: opacity, transform; }',
        '.ds-heading-anim { transform: translateX(-20px); }',
        '.ds-text-anim { transform: translateY(16px); }',
        '.ds-button-anim { transform: scale(0.95); }',
        '.ds-section-anim.ds-in { opacity: 1; transform: none; }',
        '.ds-heading-anim.ds-in { transition: opacity 0.5s ease, transform 0.5s ease; }',
        '.ds-text-anim.ds-in { transition: opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s; }',
        '.ds-button-anim.ds-in { transition: opacity 0.35s ease 0.2s, transform 0.35s ease 0.2s; }'
      ].join('\n');
      document.head.appendChild(style);

      var targets = [];
      Array.prototype.slice.call(document.querySelectorAll('section:not(#hero)')).forEach(function (section) {
        Array.prototype.slice.call(section.querySelectorAll('h1, h2, h3')).forEach(function (element) {
          element.classList.add('ds-section-anim', 'ds-heading-anim');
          targets.push(element);
        });

        Array.prototype.slice.call(section.querySelectorAll('p')).forEach(function (element) {
          element.classList.add('ds-section-anim', 'ds-text-anim');
          targets.push(element);
        });

        Array.prototype.slice.call(section.querySelectorAll('.btn, button, [class*="btn"]')).forEach(function (element) {
          element.classList.add('ds-section-anim', 'ds-button-anim');
          targets.push(element);
        });
      });

      if (!targets.length || !('IntersectionObserver' in window)) return;

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          entry.target.classList.add('ds-in');
          entry.target.addEventListener('transitionend', function () {
            entry.target.style.willChange = '';
          }, { once: true });
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.1 });

      targets.forEach(function (element) {
        observer.observe(element);
      });
    } catch (error) {
      console.warn('[section-animations.js] effect skipped:', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSectionAnimations);
  } else {
    initSectionAnimations();
  }
})();

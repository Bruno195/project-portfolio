(function () {
  function initScrollReveal() {
    try {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      var style = document.createElement('style');
      style.textContent = [
        '.ds-hidden { opacity: 0; transform: translateY(24px); will-change: opacity, transform; }',
        '.ds-visible { opacity: 1; transform: translateY(0); transition: opacity 0.6s ease, transform 0.6s ease; }'
      ].join('\n');
      document.head.appendChild(style);

      var candidates = Array.prototype.slice.call(
        document.querySelectorAll('img, [style*="background-image"], .card, [class*="card"]')
      ).filter(function (element) {
        return !element.closest('nav, header, #hero');
      });

      if (!candidates.length || !('IntersectionObserver' in window)) return;

      var sectionIndexes = new WeakMap();
      candidates.forEach(function (element) {
        var section = element.closest('section') || document.body;
        var nextIndex = sectionIndexes.get(section) || 0;
        sectionIndexes.set(section, nextIndex + 1);
        element.style.transitionDelay = (nextIndex * 80) + 'ms';
        element.classList.add('ds-hidden');
      });

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          entry.target.classList.add('ds-visible');
          entry.target.addEventListener('transitionend', function () {
            entry.target.style.willChange = '';
          }, { once: true });
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.15 });

      candidates.forEach(function (element) {
        observer.observe(element);
      });
    } catch (error) {
      console.warn('[scroll-reveal.js] effect skipped:', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollReveal);
  } else {
    initScrollReveal();
  }
})();

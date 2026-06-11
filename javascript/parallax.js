(function () {
  function debounce(fn, wait) {
    var timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(fn, wait);
    };
  }

  function hasOverflowHidden(element) {
    while (element && element !== document.body) {
      if (window.getComputedStyle(element).overflow === 'hidden') return true;
      element = element.parentElement;
    }
    return false;
  }

  function initParallax() {
    try {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (window.innerWidth < 768) return;

      var candidates = Array.prototype.slice.call(
        document.querySelectorAll('img, [style*="background-image"]')
      ).filter(function (element) {
        if (element.closest('nav, header, footer')) return false;
        if (element.tagName.toLowerCase() === 'img') {
          return element.getBoundingClientRect().height > 200;
        }
        return true;
      });

      if (!candidates.length) return;

      candidates.forEach(function (element) {
        if (!hasOverflowHidden(element.parentElement)) {
          var wrapper = document.createElement('div');
          wrapper.className = 'ds-parallax-wrap';
          wrapper.style.overflow = 'hidden';
          wrapper.style.borderRadius = window.getComputedStyle(element).borderRadius;
          element.parentNode.insertBefore(wrapper, element);
          wrapper.appendChild(element);
        }
        element.style.willChange = 'transform';
      });

      var items = [];
      function measure() {
        items = candidates.map(function (element) {
          return {
            element: element,
            top: element.getBoundingClientRect().top + window.scrollY
          };
        });
      }

      var ticking = false;
      function update() {
        items.forEach(function (item) {
          var offset = (window.scrollY - item.top) * 0.15;
          item.element.style.transform = 'translateY(' + offset.toFixed(2) + 'px)';
        });
        ticking = false;
      }

      function onScroll() {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(update);
        }
      }

      measure();
      update();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', debounce(function () {
        measure();
        update();
      }, 150));
    } catch (error) {
      console.warn('[parallax.js] effect skipped:', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParallax);
  } else {
    initParallax();
  }
})();

(function () {
  function initNavSpy() {
    try {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      var style = document.createElement('style');
      style.textContent = '.ds-nav-active { color: var(--ds-lime) !important; }';
      document.head.appendChild(style);

      var sections = Array.prototype.slice.call(document.querySelectorAll('section[id]'));
      var navLinks = Array.prototype.slice.call(document.querySelectorAll('nav a[href^="#"]'));
      var linksById = {};

      navLinks.forEach(function (link) {
        var id = link.getAttribute('href').slice(1);
        linksById[id] = link;
      });

      var matchingSections = sections.filter(function (section) {
        return Boolean(linksById[section.id]);
      });

      if (!matchingSections.length || !('IntersectionObserver' in window)) return;

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var link = linksById[entry.target.id];
          if (!link) return;

          if (entry.isIntersecting) {
            navLinks.forEach(function (item) {
              item.classList.remove('ds-nav-active');
            });
            link.classList.add('ds-nav-active');
          } else {
            link.classList.remove('ds-nav-active');
          }
        });
      }, { threshold: 0.5 });

      matchingSections.forEach(function (section) {
        observer.observe(section);
      });
    } catch (error) {
      console.warn('[nav-spy.js] effect skipped:', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavSpy);
  } else {
    initNavSpy();
  }
})();

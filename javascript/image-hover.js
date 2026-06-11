(function () {
  function hasOverflowHidden(element) {
    while (element && element !== document.body) {
      if (window.getComputedStyle(element).overflow === 'hidden') return true;
      element = element.parentElement;
    }
    return false;
  }

  function initImageHover() {
    try {
      var style = document.createElement('style');
      style.textContent = [
        'img {',
        '  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.4s ease;',
        '  filter: saturate(0.85) brightness(0.92);',
        '}',
        'img:hover { transform: scale(1.03); filter: saturate(1.1) brightness(1); }',
        '[class*="card"]:hover img, [class*="project"]:hover img {',
        '  transform: scale(1.05);',
        '  filter: saturate(1.15) brightness(1.05);',
        '}',
        '.ds-img-wrap { display: block; overflow: hidden; border-radius: inherit; }',
        '.ds-img-wrap > img { width: 100%; }'
      ].join('\n');
      document.head.appendChild(style);

      Array.prototype.slice.call(document.querySelectorAll('img')).forEach(function (image) {
        if (image.closest('.ds-img-wrap') || hasOverflowHidden(image.parentElement)) return;

        var wrapper = document.createElement('div');
        wrapper.className = 'ds-img-wrap';
        image.parentNode.insertBefore(wrapper, image);
        wrapper.appendChild(image);
      });
    } catch (error) {
      console.warn('[image-hover.js] effect skipped:', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initImageHover);
  } else {
    initImageHover();
  }
})();

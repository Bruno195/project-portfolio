(function () {
  function initCursorGlow() {
    try {
      if ('ontouchstart' in window) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      var glow = document.createElement('div');
      glow.id = 'ds-cursor-glow';
      glow.style.position = 'fixed';
      glow.style.left = '50%';
      glow.style.top = '50%';
      glow.style.width = '320px';
      glow.style.height = '320px';
      glow.style.borderRadius = '50%';
      glow.style.background = 'radial-gradient(circle, rgba(210,255,0,0.07) 0%, transparent 70%)';
      glow.style.pointerEvents = 'none';
      glow.style.zIndex = '0';
      glow.style.transform = 'translate(-50%, -50%)';
      glow.style.transition = 'left 0.12s ease, top 0.12s ease, width 0.2s ease, height 0.2s ease, opacity 0.2s ease';
      glow.style.willChange = 'left, top';
      document.body.appendChild(glow);

      var pending = false;
      var mouseX = window.innerWidth / 2;
      var mouseY = window.innerHeight / 2;

      function render() {
        glow.style.left = mouseX + 'px';
        glow.style.top = mouseY + 'px';
        pending = false;
      }

      document.addEventListener('mousemove', function (event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
        if (!pending) {
          pending = true;
          window.requestAnimationFrame(render);
        }
      });

      document.addEventListener('mouseleave', function () {
        glow.style.opacity = '0';
      });

      document.addEventListener('mouseenter', function () {
        glow.style.opacity = '1';
      });

      Array.prototype.slice.call(document.querySelectorAll('a, button')).forEach(function (element) {
        element.addEventListener('mouseenter', function () {
          glow.style.width = '400px';
          glow.style.height = '400px';
          glow.style.opacity = '1.8';
        });

        element.addEventListener('mouseleave', function () {
          glow.style.width = '320px';
          glow.style.height = '320px';
          glow.style.opacity = '1';
        });
      });
    } catch (error) {
      console.warn('[cursor.js] effect skipped:', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCursorGlow);
  } else {
    initCursorGlow();
  }
})();

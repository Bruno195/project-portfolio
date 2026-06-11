(function () {
  'use strict';

  function initGridOverlay() {
    try {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (window.innerWidth < 768) return;

      var canvas = document.createElement('canvas');
      canvas.id = 'ds-grid-overlay';
      canvas.setAttribute('aria-hidden', 'true');
      canvas.style.position = 'fixed';
      canvas.style.inset = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.zIndex = '-1';
      canvas.style.pointerEvents = 'none';
      document.body.insertBefore(canvas, document.body.firstChild);

      var ctx = canvas.getContext('2d');
      var spacing = 64;
      var baseColor = 'rgba(180, 200, 154, 0.045)';
      var pulseColor = 'rgba(210, 255, 0, 0.16)';

      var pulse = null; // { type: 'h'|'v', index: number, start: number, duration: number }

      function resize() {
        canvas.width = window.innerWidth * window.devicePixelRatio;
        canvas.height = window.innerHeight * window.devicePixelRatio;
        ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
      }

      function easeInOutSine(t) {
        return -(Math.cos(Math.PI * t) - 1) / 2;
      }

      function draw(now) {
        var w = window.innerWidth;
        var h = window.innerHeight;

        ctx.clearRect(0, 0, w, h);
        ctx.lineWidth = 1;
        ctx.strokeStyle = baseColor;

        var cols = Math.ceil(w / spacing);
        var rows = Math.ceil(h / spacing);

        ctx.beginPath();
        for (var x = 0; x <= cols; x++) {
          var px = x * spacing + 0.5;
          ctx.moveTo(px, 0);
          ctx.lineTo(px, h);
        }
        for (var y = 0; y <= rows; y++) {
          var py = y * spacing + 0.5;
          ctx.moveTo(0, py);
          ctx.lineTo(w, py);
        }
        ctx.stroke();

        if (pulse) {
          var elapsed = now - pulse.start;
          var progress = elapsed / pulse.duration;

          if (progress >= 1) {
            pulse = null;
          } else {
            var intensity = Math.sin(progress * Math.PI); // fade in then out
            var alpha = easeInOutSine(intensity) * 0.16;
            ctx.strokeStyle = 'rgba(210, 255, 0, ' + alpha.toFixed(3) + ')';
            ctx.beginPath();

            if (pulse.type === 'v') {
              var vx = pulse.index * spacing + 0.5;
              ctx.moveTo(vx, 0);
              ctx.lineTo(vx, h);
            } else {
              var hy = pulse.index * spacing + 0.5;
              ctx.moveTo(0, hy);
              ctx.lineTo(w, hy);
            }

            ctx.stroke();
          }
        }

        window.requestAnimationFrame(draw);
      }

      function schedulePulse() {
        var w = window.innerWidth;
        var h = window.innerHeight;
        var cols = Math.ceil(w / spacing);
        var rows = Math.ceil(h / spacing);
        var type = Math.random() < 0.5 ? 'v' : 'h';
        var index = type === 'v' ? Math.floor(Math.random() * (cols + 1)) : Math.floor(Math.random() * (rows + 1));

        pulse = {
          type: type,
          index: index,
          start: performance.now(),
          duration: 1400
        };

        window.setTimeout(schedulePulse, 4000 + Math.random() * 4000);
      }

      var resizeTimer = null;
      window.addEventListener('resize', function () {
        if (resizeTimer) window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(function () {
          if (window.innerWidth < 768) {
            canvas.style.display = 'none';
          } else {
            canvas.style.display = 'block';
            resize();
          }
        }, 150);
      }, { passive: true });

      resize();
      window.requestAnimationFrame(draw);
      window.setTimeout(schedulePulse, 4000 + Math.random() * 4000);
    } catch (error) {
      console.warn('[grid-overlay.js] effect skipped:', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGridOverlay);
  } else {
    initGridOverlay();
  }
})();

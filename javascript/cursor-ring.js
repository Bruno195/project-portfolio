(function () {
  'use strict';

  function initCursorRing() {
    try {
      if ('ontouchstart' in window) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (window.matchMedia('(hover: none)').matches) return;

      var style = document.createElement('style');
      style.textContent = [
        '@media (hover: hover) and (pointer: fine) {',
        '  body.ds-cursor-active, body.ds-cursor-active a, body.ds-cursor-active button,',
        '  body.ds-cursor-active .btn, body.ds-cursor-active .work-card { cursor: none; }',
        '}',
        '.ds-cursor-dot {',
        '  position: fixed;',
        '  top: 0;',
        '  left: 0;',
        '  width: 8px;',
        '  height: 8px;',
        '  border-radius: 50%;',
        '  background: var(--ds-lime, #d2ff00);',
        '  pointer-events: none;',
        '  z-index: 10000;',
        '  transform: translate(-50%, -50%);',
        '}',
        '.ds-cursor-ring {',
        '  position: fixed;',
        '  top: 0;',
        '  left: 0;',
        '  width: 32px;',
        '  height: 32px;',
        '  border-radius: 50%;',
        '  border: 1px solid var(--ds-lime, #d2ff00);',
        '  background: rgba(210, 255, 0, 0);',
        '  pointer-events: none;',
        '  z-index: 9999;',
        '  transform: translate(-50%, -50%);',
        '  transition: width 0.25s ease, height 0.25s ease, background 0.25s ease;',
        '}',
        '.ds-cursor-ring.is-hover {',
        '  width: 60px;',
        '  height: 60px;',
        '  background: rgba(210, 255, 0, 0.08);',
        '}',
        '@media (hover: none) {',
        '  .ds-cursor-dot, .ds-cursor-ring { display: none; }',
        '}'
      ].join('\n');
      document.head.appendChild(style);

      var dot = document.createElement('div');
      dot.className = 'ds-cursor-dot';
      dot.setAttribute('aria-hidden', 'true');

      var ring = document.createElement('div');
      ring.className = 'ds-cursor-ring';
      ring.setAttribute('aria-hidden', 'true');

      document.body.appendChild(ring);
      document.body.appendChild(dot);
      document.body.classList.add('ds-cursor-active');

      var mouseX = window.innerWidth / 2;
      var mouseY = window.innerHeight / 2;
      var ringX = mouseX;
      var ringY = mouseY;

      document.addEventListener('mousemove', function (event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
      }, { passive: true });

      function render() {
        ringX += (mouseX - ringX) * 0.16;
        ringY += (mouseY - ringY) * 0.16;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
        window.requestAnimationFrame(render);
      }
      window.requestAnimationFrame(render);

      var hoverSelector = 'a, button, .btn, .work-card';
      document.addEventListener('mouseover', function (event) {
        if (event.target.closest(hoverSelector)) ring.classList.add('is-hover');
      }, { passive: true });

      document.addEventListener('mouseout', function (event) {
        if (event.target.closest(hoverSelector)) ring.classList.remove('is-hover');
      }, { passive: true });

      document.addEventListener('mouseleave', function () {
        dot.style.opacity = '0';
        ring.style.opacity = '0';
      });

      document.addEventListener('mouseenter', function () {
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      });
    } catch (error) {
      console.warn('[cursor-ring.js] effect skipped:', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCursorRing);
  } else {
    initCursorRing();
  }
})();

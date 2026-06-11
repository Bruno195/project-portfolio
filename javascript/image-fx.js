(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function injectStyles() {
    var style = document.createElement('style');
    style.textContent = [
      '.ds-img-frame {',
      '  position: relative;',
      '  display: block;',
      '  overflow: hidden;',
      '  isolation: isolate;',
      '}',
      '.ds-img-frame img {',
      '  position: relative;',
      '  z-index: 1;',
      '  filter: saturate(0.75) brightness(0.9) contrast(1.05);',
      '  transition: filter 0.4s ease, transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);',
      '}',
      '.ds-img-frame:hover img {',
      '  filter: saturate(1.05) brightness(1) contrast(1.05);',
      '}',
      '.ds-img-frame::before,',
      '.ds-img-frame::after {',
      '  content: "";',
      '  position: absolute;',
      '  inset: 0;',
      '  z-index: 2;',
      '  background-image: var(--ds-img-bg);',
      '  background-size: cover;',
      '  background-position: center;',
      '  opacity: 0;',
      '  pointer-events: none;',
      '  transition: opacity 0.3s ease, transform 0.3s ease;',
      '  mix-blend-mode: screen;',
      '}',
      '.ds-img-frame::before {',
      '  background-color: rgba(210, 255, 0, 0.18);',
      '  background-blend-mode: overlay;',
      '}',
      '.ds-img-frame::after {',
      '  background-color: rgba(180, 200, 154, 0.12);',
      '  background-blend-mode: overlay;',
      '}',
      '.ds-img-frame:hover::before {',
      '  opacity: 0.4;',
      '  transform: translateX(-2px);',
      '}',
      '.ds-img-frame:hover::after {',
      '  opacity: 0.4;',
      '  transform: translateX(2px);',
      '}',
      '.ds-img-scanlines {',
      '  position: absolute;',
      '  inset: 0;',
      '  z-index: 3;',
      '  pointer-events: none;',
      '  background: repeating-linear-gradient(',
      '    0deg,',
      '    transparent,',
      '    transparent 2px,',
      '    rgba(0, 0, 0, 0.08) 2px,',
      '    rgba(0, 0, 0, 0.08) 4px',
      '  );',
      '}',
      '.ds-img-corner {',
      '  position: absolute;',
      '  width: 14px;',
      '  height: 14px;',
      '  border: 1.5px solid var(--ds-lime, #d2ff00);',
      '  opacity: 0.4;',
      '  z-index: 4;',
      '  pointer-events: none;',
      '  transition: opacity 0.2s ease;',
      '}',
      '.ds-img-frame:hover .ds-img-corner { opacity: 1; }',
      '.ds-img-corner--tl { top: 8px; left: 8px; border-right: none; border-bottom: none; }',
      '.ds-img-corner--tr { top: 8px; right: 8px; border-left: none; border-bottom: none; }',
      '.ds-img-corner--bl { bottom: 8px; left: 8px; border-right: none; border-top: none; }',
      '.ds-img-corner--br { bottom: 8px; right: 8px; border-left: none; border-top: none; }',
      '.ds-img-data {',
      '  position: absolute;',
      '  bottom: 10px;',
      '  left: 10px;',
      '  z-index: 5;',
      '  font-family: var(--ds-font-mono, monospace);',
      '  font-size: 9px;',
      '  line-height: 1.5;',
      '  letter-spacing: 0.05em;',
      '  color: var(--ds-lime, #d2ff00);',
      '  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.85);',
      '  opacity: 0;',
      '  pointer-events: none;',
      '  transition: opacity 0.2s ease 0.05s;',
      '  text-transform: uppercase;',
      '}',
      '.ds-img-frame:hover .ds-img-data { opacity: 1; }'
    ].join('\n');
    document.head.appendChild(style);
  }

  function buildCorners(frame) {
    ['tl', 'tr', 'bl', 'br'].forEach(function (pos) {
      var corner = document.createElement('span');
      corner.className = 'ds-img-corner ds-img-corner--' + pos;
      corner.setAttribute('aria-hidden', 'true');
      frame.appendChild(corner);
    });
  }

  function buildScanlines(frame) {
    var lines = document.createElement('span');
    lines.className = 'ds-img-scanlines';
    lines.setAttribute('aria-hidden', 'true');
    frame.appendChild(lines);
  }

  function buildDataOverlay(frame, img, index) {
    var overlay = document.createElement('span');
    overlay.className = 'ds-img-data';
    overlay.setAttribute('aria-hidden', 'true');

    function render() {
      var w = img.naturalWidth || 0;
      var h = img.naturalHeight || 0;
      var id = 'SYS_IMG_' + String(index).padStart(3, '0');
      overlay.innerHTML = id + '<br>STATUS: LOADED<br>RES: ' + w + 'x' + h;
    }

    if (img.complete && img.naturalWidth) {
      render();
    } else {
      overlay.innerHTML = 'SYS_IMG_' + String(index).padStart(3, '0') + '<br>STATUS: LOADING...';
      img.addEventListener('load', render, { once: true });
    }

    frame.appendChild(overlay);
  }

  function processImage(img, index) {
    try {
      if (img.dataset.fxDone === 'true') return;
      if (!img.parentElement) return;

      var target = img;
      var parent = img.parentElement;

      // If image-hover.js already wrapped the image, frame the wrapper instead.
      if (parent.classList && parent.classList.contains('ds-img-wrap')) {
        target = parent;
        parent = parent.parentElement;
        if (!parent) return;
      }

      var frame = document.createElement('div');
      frame.className = 'ds-img-frame';

      var computed = window.getComputedStyle(target);
      if (computed.borderRadius && computed.borderRadius !== '0px') {
        frame.style.borderRadius = computed.borderRadius;
      }

      parent.insertBefore(frame, target);
      frame.appendChild(target);

      var bgUrl = img.currentSrc || img.getAttribute('src') || '';
      if (bgUrl) {
        frame.style.setProperty('--ds-img-bg', 'url("' + bgUrl.replace(/"/g, '\\"') + '")');
      }

      buildCorners(frame);

      var height = img.getBoundingClientRect().height;
      if (height > 180 || (img.complete === false && true)) {
        buildScanlines(frame);
      }

      buildDataOverlay(frame, img, index);

      img.dataset.fxDone = 'true';
    } catch (error) {
      console.warn('[image-fx.js] image skipped:', error);
    }
  }

  function initImageFX() {
    try {
      injectStyles();

      var images = Array.prototype.slice.call(document.querySelectorAll('img'));
      images.forEach(function (img, index) {
        processImage(img, index + 1);
      });
    } catch (error) {
      console.warn('[image-fx.js] effect skipped:', error);
    }
  }

  if (prefersReduced) return;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initImageFX);
  } else {
    initImageFX();
  }
})();

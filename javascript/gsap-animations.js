(function () {
  'use strict';

  function initGsapAnimations() {
    try {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (!window.gsap) return;

      var gsap = window.gsap;
      if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

      var isSmall = window.innerWidth < 768;
      var rise = isSmall ? 16 : 32;

      // --- Hero entrance: eyebrow -> heading -> photo/terminal -> stats ---
      // scroll-reveal.js excludes #hero, so GSAP owns these elements alone.
      var heroTargets = {
        eyebrow: document.querySelector('.hero-eyebrow'),
        heading: document.querySelector('.hero-heading'),
        photo: document.querySelector('.hero-photo-card'),
        terminal: document.querySelector('#hero .ds-terminal'),
        stats: document.querySelectorAll('.hero-stats .stat')
      };

      if (heroTargets.heading) {
        var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        if (heroTargets.eyebrow) {
          tl.from(heroTargets.eyebrow, { y: rise * 0.6, opacity: 0, duration: 0.55 });
        }
        tl.from(heroTargets.heading, { y: rise, opacity: 0, duration: 0.8 }, '-=0.25');
        if (heroTargets.photo) {
          tl.from(heroTargets.photo, { y: rise, opacity: 0, duration: 0.7 }, '-=0.45');
        }
        if (heroTargets.terminal) {
          tl.from(heroTargets.terminal, { y: rise, opacity: 0, duration: 0.7 }, '-=0.55');
        }
        if (heroTargets.stats.length) {
          tl.from(heroTargets.stats, { y: rise * 0.75, opacity: 0, duration: 0.5, stagger: 0.08 }, '-=0.4');
        }
      }

      // --- Work cards: stagger fade-up per section on scroll into view ---
      // scroll-reveal.js tags these with .ds-hidden (opacity 0). gsap.from()
      // would capture that 0 as the end-state, so strip its classes and use
      // an explicit fromTo instead.
      if (window.ScrollTrigger) {
        Array.prototype.slice.call(
          document.querySelectorAll('section:not(#hero)')
        ).forEach(function (section) {
          var cards = Array.prototype.slice.call(section.querySelectorAll('.work-card'));
          if (!cards.length) return;

          cards.forEach(function (card) {
            card.classList.remove('ds-hidden', 'ds-visible');
            card.style.transitionDelay = '';
          });

          gsap.fromTo(cards, {
            y: rise,
            opacity: 0
          }, {
            y: 0,
            opacity: 1,
            duration: 0.65,
            ease: 'power3.out',
            stagger: 0.08,
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              once: true
            }
          });
        });
      }
    } catch (error) {
      console.warn('[gsap-animations.js] effect skipped:', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGsapAnimations);
  } else {
    initGsapAnimations();
  }
})();

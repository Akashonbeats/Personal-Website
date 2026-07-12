/**
 * theme.js
 * Global dark ↔ light theme switching.
 *
 * Strategy: watch ALL [data-theme] sections via IntersectionObserver.
 * When a section's center crosses the viewport midpoint, apply its
 * data-theme to <body> globally — one theme for the whole page at once.
 * This eliminates split-coloring at section boundaries.
 */

(function () {
  'use strict';

  // Map each observed element → its current intersection ratio
  const ratioMap = new Map();
  let currentTheme = 'dark'; // matches :root default

  /**
   * Apply theme globally to <body>.
   * 'dark' = remove attribute (falls back to :root default).
   * 'light' = set attribute so [data-theme="light"] rules take effect.
   */
  function applyTheme(theme) {
    if (theme === currentTheme) return;
    currentTheme = theme;

    if (theme === 'light') {
      document.body.setAttribute('data-theme', 'light');
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.body.removeAttribute('data-theme');
      document.documentElement.removeAttribute('data-theme');
    }
  }

  /**
   * Pick the section that is most visible in the viewport.
   * Ties go to the element whose center is closest to the viewport center.
   */
  function resolveTheme() {
    let bestEl = null;
    let bestScore = -1;
    const vpMid = window.innerHeight / 2;

    ratioMap.forEach((ratio, el) => {
      if (ratio <= 0) return;

      const rect = el.getBoundingClientRect();
      const elMid = rect.top + rect.height / 2;
      // Score = intersection ratio, tie-broken by proximity of element center to viewport center
      const proximity = 1 - Math.abs(elMid - vpMid) / window.innerHeight;
      const score = ratio * 0.7 + proximity * 0.3;

      if (score > bestScore) {
        bestScore = score;
        bestEl = el;
      }
    });

    if (bestEl) {
      applyTheme(bestEl.getAttribute('data-theme') || 'dark');
    }
  }

  function handleIntersections(entries) {
    entries.forEach(entry => {
      ratioMap.set(entry.target, entry.intersectionRatio);
    });
    resolveTheme();
  }

  function init() {
    const themedEls = document.querySelectorAll('[data-theme]');
    if (!themedEls.length) return;

    const observer = new IntersectionObserver(handleIntersections, {
      threshold: [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    });

    themedEls.forEach(el => {
      ratioMap.set(el, 0);
      observer.observe(el);
    });

    // Set initial theme immediately on load without waiting for observer
    requestAnimationFrame(() => {
      let bestEl = null;
      let bestArea = -1;

      themedEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        const visTop = Math.max(0, rect.top);
        const visBot = Math.min(window.innerHeight, rect.bottom);
        const visArea = Math.max(0, visBot - visTop);
        if (visArea > bestArea) {
          bestArea = visArea;
          bestEl = el;
        }
      });

      if (bestEl) applyTheme(bestEl.getAttribute('data-theme') || 'dark');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

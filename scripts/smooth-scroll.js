// ── Lenis Smooth Scroll ──

const lenis = new Lenis();
window.lenis = lenis;

// ── RAF loop ──
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// ── Back-to-top handler ──
document.addEventListener('DOMContentLoaded', () => {
  const topLinks = document.querySelectorAll('a[href="#"]');

  topLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      lenis.scrollTo(0, {
        duration: 3,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    });
  });
});

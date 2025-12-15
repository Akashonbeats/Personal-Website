const lenis = new Lenis();

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Handle smooth scroll to top for anchor links
document.addEventListener("DOMContentLoaded", function () {
  const backToTopLinks = document.querySelectorAll('a[href="#"]');
  
  backToTopLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      lenis.scrollTo(0, {
        duration: 3,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      });
    });
  });
});

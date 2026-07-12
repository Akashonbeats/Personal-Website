// ── Enhanced Custom Cursor with Smooth Lerp Trailing ──

(function () {
  const cursor = document.querySelector('.cursor');

  // Bail out early if cursor element doesn't exist (e.g. touch device)
  if (!cursor) return;

  // Mouse position (actual) and cursor position (rendered)
  let mouseX = -100;
  let mouseY = -100;
  let cursorX = -100;
  let cursorY = -100;

  const LERP_FACTOR = 0.35;

  // ── Track actual mouse position ──
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.opacity = '1';
  });

  // ── Hide cursor when mouse leaves the window ──
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
  });

  // ── Hover state on interactive elements ──
  const interactiveSelector = 'a, button, .pill, [role="button"]';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelector)) {
      cursor.classList.add('cursor--hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelector)) {
      cursor.classList.remove('cursor--hover');
    }
  });

  // ── Click animation ──
  document.addEventListener('mousedown', () => {
    cursor.classList.add('cursor--click');
  });

  cursor.addEventListener('animationend', () => {
    cursor.classList.remove('cursor--click');
  });

  // ── Lerp animation loop ──
  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  function animate() {
    cursorX = lerp(cursorX, mouseX, LERP_FACTOR);
    cursorY = lerp(cursorY, mouseY, LERP_FACTOR);

    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';

    // Feed coordinates to shader if available
    if (typeof window.shaderMouseUpdate === 'function') {
      window.shaderMouseUpdate(cursorX, cursorY);
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();
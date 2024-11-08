const cursor = document.querySelector('.cursor');
let cursorX = 0;
let cursorY = 0;

const updateCursorPosition = (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    cursor.style.cssText = `
        top: ${cursorY + scrollY - 18}px;
        left: ${cursorX + scrollX - 18}px;
    `;
};

const updateCursorOnScroll = () => {
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    cursor.style.cssText = `
        top: ${cursorY + scrollY - 18}px;
        left: ${cursorX + scrollX - 18}px;
    `;
};

document.addEventListener('mousemove', updateCursorPosition);
document.addEventListener('scroll', updateCursorOnScroll);
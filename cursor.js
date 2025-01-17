// Cursor Co-ordinates

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

// Click Animation

document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        cursor.classList.add('clicked');
        setTimeout(() => {
            cursor.classList.remove('clicked');
            if (link.target === "_blank") {
                window.open(link.href, '_blank');
            } else {
                window.location.href = link.href;
            }
        }, 200);
    });
});
const contactButton = document.querySelector('.contact-button');
const footer = document.querySelector('.footer');

function checkButtonVisibility() {
    const footerRect = footer.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    if (footerRect.top < windowHeight) {
        contactButton.style.opacity = '0';
        contactButton.style.pointerEvents = 'none';
    } else {
        contactButton.style.opacity = '1';
        contactButton.style.pointerEvents = 'auto';
    }
}

window.addEventListener('scroll', checkButtonVisibility);
window.addEventListener('resize', checkButtonVisibility);
checkButtonVisibility();

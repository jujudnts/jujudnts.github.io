// Zoom functionality
function handleImageZoom(element) {
    const container = element.closest('.project-image, .gallery-main');
    const img = element.tagName === 'IMG' ? element : element.querySelector('img');
    
    if (!container.classList.contains('zoomed')) {
        // Zoom in
        container.classList.add('zoomed');
        document.body.style.overflow = 'hidden';
        
        // Handle click to zoom out
        const zoomOut = (e) => {
            if (e.target === container || e.target === img) {
                container.classList.remove('zoomed');
                document.body.style.overflow = '';
                container.removeEventListener('click', zoomOut);
                document.removeEventListener('keydown', handleEsc);
            }
        };
        
        // Handle ESC key to zoom out
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                container.classList.remove('zoomed');
                document.body.style.overflow = '';
                container.removeEventListener('click', zoomOut);
                document.removeEventListener('keydown', handleEsc);
            }
        };
        
        container.addEventListener('click', zoomOut);
        document.addEventListener('keydown', handleEsc);
    }
}

// Keyboard Navigation for Modal
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('projectModal');
    if (!modal || !modal.classList.contains('is-open')) return;
    
    switch(e.key) {
        case 'Escape':
            if (!document.querySelector('.zoomed')) {
                modal.classList.remove('is-open');
                document.body.style.overflow = '';
            }
            break;
        case 'ArrowLeft':
            navigateProject(-1);
            break;
        case 'ArrowRight':
            navigateProject(1);
            break;
    }
});

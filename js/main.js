function setActiveNav() {
    const currentPath = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-list a').forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === currentPath || (currentPath === '' && href === 'accueil.html'));
    });
}

document.addEventListener('DOMContentLoaded', setActiveNav);
document.addEventListener('includesLoaded', setActiveNav);

// Media lightbox: open YouTube links in modal when clicking .media-item
function extractYouTubeId(url) {
    try {
        const u = new URL(url);
        if (u.hostname === 'youtu.be') return u.pathname.slice(1);
        if (u.hostname.includes('youtube.com')) {
            if (u.searchParams.has('v')) return u.searchParams.get('v');
            // handle embed or /watch
            const parts = u.pathname.split('/').filter(Boolean);
            const embedIndex = parts.indexOf('embed');
            if (embedIndex !== -1 && parts[embedIndex + 1]) return parts[embedIndex + 1];
        }
    } catch (e) {
        return null;
    }
    return null;
}

function openMediaLightbox(videoId) {
    if (!videoId) return;
    let modal = document.querySelector('.media-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'media-modal';
        modal.innerHTML = `
            <div class="media-content">
                <button class="media-close" aria-label="Fermer">✕</button>
                <iframe class="media-iframe" src="" allow="autoplay; encrypted-media" allowfullscreen></iframe>
            </div>`;
        document.body.appendChild(modal);
        modal.querySelector('.media-close').addEventListener('click', () => closeMediaLightbox(modal));
        modal.addEventListener('click', (e) => { if (e.target === modal) closeMediaLightbox(modal); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMediaLightbox(modal); });
    }
    const iframe = modal.querySelector('.media-iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`;
    modal.classList.add('is-open');
}

function closeMediaLightbox(modal) {
    if (!modal) modal = document.querySelector('.media-modal');
    if (!modal) return;
    const iframe = modal.querySelector('.media-iframe');
    if (iframe) iframe.src = '';
    modal.classList.remove('is-open');
}

function initMediaLightbox() {
    document.querySelectorAll('.media-item').forEach(a => {
        const href = a.getAttribute('href') || '';
        const vid = extractYouTubeId(href);
        if (vid) {
            a.addEventListener('click', (e) => {
                e.preventDefault();
                openMediaLightbox(vid);
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', initMediaLightbox);
document.addEventListener('includesLoaded', initMediaLightbox);
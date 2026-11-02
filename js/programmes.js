// Page interactions for programmes.html
(function () {
    'use strict';

    // Reveal on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Filter functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.program-card');
    const categoryMap = {
        spectacles: 'spectacle',
        expositions: 'exposition',
        ateliers: 'atelier',
        rencontres: 'spectacle',
        cinema: 'spectacle',
        conferences: 'spectacle',
        musique: 'spectacle',
        jeunesse: 'atelier'
    };

    const applyFilter = (filter) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        const activeButton = [...filterBtns].find(btn => btn.getAttribute('data-filter') === filter) || filterBtns[0];
        if (activeButton) activeButton.classList.add('active');

        cards.forEach(card => {
            const category = card.getAttribute('data-category');
            if (filter === 'all' || category === filter) {
                card.style.display = 'block';
                setTimeout(() => card.classList.add('is-visible'), 50);
            } else {
                card.style.display = 'none';
            }
        });
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            applyFilter(this.getAttribute('data-filter'));
        });
    });

    const requestedCategory = new URLSearchParams(window.location.search).get('categorie');
    const normalized = requestedCategory ? (categoryMap[requestedCategory.toLowerCase()] || requestedCategory.toLowerCase()) : 'all';

    if (normalized === 'all') {
        applyFilter('all');
    } else {
        const matching = [...filterBtns].find(btn => (btn.getAttribute('data-filter') || '').toLowerCase() === normalized);
        if (matching) {
            applyFilter(matching.getAttribute('data-filter'));
        } else {
            applyFilter('all');
        }
    }
})();

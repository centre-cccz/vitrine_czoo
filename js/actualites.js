// Page interactions for actualites.html
// - Reveal on scroll
// - Stats counter
// - Newsletter validation

(function () {
    'use strict';

    // Respect reduced motion
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Reveal on scroll using IntersectionObserver
    if (!reduceMotion && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    } else {
        // fallback: make visible
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    }

    // Stats counter when visible
    function animateNumber(node, to, duration) {
        const start = 0; let startTime = null;
        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            node.textContent = Math.floor(progress * (to - start) + start).toLocaleString();
            if (progress < 1) window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
    }

    const statsSection = document.querySelector('.stats-section');
    if (statsSection && 'IntersectionObserver' in window && !reduceMotion) {
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('[data-target]').forEach(node => {
                        const to = parseInt(node.getAttribute('data-target'), 10) || 0;
                        animateNumber(node, to, 1400);
                    });
                    statObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        statObserver.observe(statsSection);
    } else if (statsSection) {
        // Reduced motion: just set values
        statsSection.querySelectorAll('[data-target]').forEach(node => {
            node.textContent = parseInt(node.getAttribute('data-target'), 10).toLocaleString();
        });
    }

    // Make cards keyboard-activable (Enter opens data-href or first link)
    document.querySelectorAll('.news-card[tabindex], .event-card-premium[tabindex]').forEach(card => {
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const href = card.getAttribute('data-href') || card.querySelector('a')?.href;
                if (href) window.location.href = href;
            }
        });
        card.addEventListener('click', (e) => {
            const href = card.getAttribute('data-href');
            if (href && e.target.tagName.toLowerCase() !== 'a') window.location.href = href;
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const targetId = a.getAttribute('href').slice(1);
            if (!targetId) return;
            const el = document.getElementById(targetId);
            if (el) {
                e.preventDefault();
                el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
                el.focus({ preventScroll: true });
            }
        });
    });

    // Newsletter form validation + accessible feedback
    const form = document.getElementById('newsletter-form');
    if (form) {
        const feedback = document.getElementById('newsletter-feedback');
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const emailEl = form.querySelector('input[type="email"]');
            const nameEl = form.querySelector('input[name="name"]');
            const email = emailEl.value.trim();
            const name = nameEl.value.trim();
            const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            feedback.classList.remove('error', 'success');
            if (!emailRe.test(email)) {
                feedback.textContent = 'Veuillez saisir une adresse email valide.';
                feedback.classList.add('error');
                feedback.style.color = 'var(--zoo-gold)';
                emailEl.focus();
                return;
            }
            // TODO: replace with real submit (fetch to API)
            feedback.textContent = 'Merci ! Vous êtes bien inscrit·e.';
            feedback.classList.add('success');
            feedback.style.color = 'var(--zoo-green)';
            form.reset();
        });
    }

})();

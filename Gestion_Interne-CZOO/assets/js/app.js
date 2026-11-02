(() => {
    'use strict';

    const body = document.body;
    const menuToggle = document.querySelector('[data-menu-toggle]');
    const navOverlay = document.querySelector('.nav-overlay');
    if (menuToggle) {
        const closeMenu = () => {
            body.classList.remove('nav-open');
            menuToggle.setAttribute('aria-expanded', 'false');
        };
        menuToggle.addEventListener('click', () => {
            const open = body.classList.toggle('nav-open');
            menuToggle.setAttribute('aria-expanded', String(open));
        });
        if (navOverlay) navOverlay.addEventListener('click', closeMenu);
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && body.classList.contains('nav-open')) {
                closeMenu();
                menuToggle.focus();
            }
        });
        document.querySelectorAll('.sidebar a').forEach((link) => {
            link.addEventListener('click', closeMenu);
        });
    }

    const passwordToggle = document.querySelector('[data-password-toggle]');
    const passwordInput = document.querySelector('#password');
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', () => {
            const visible = passwordInput.type === 'text';
            passwordInput.type = visible ? 'password' : 'text';
            passwordToggle.textContent = visible ? 'Afficher' : 'Masquer';
            passwordToggle.setAttribute('aria-label', visible ? 'Afficher le mot de passe' : 'Masquer le mot de passe');
        });
    }

    document.querySelectorAll('form').forEach((form) => {
        form.addEventListener('submit', () => {
            const submit = form.querySelector('button[type="submit"]');
            if (submit) {
                submit.disabled = true;
                if (submit.dataset.loadingText) submit.textContent = submit.dataset.loadingText;
            }
        });
    });
})();

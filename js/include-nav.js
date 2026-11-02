// Load HTML fragment from /includes/nav.html into elements with data-include="nav"
(function () {
    'use strict';

    async function loadInclude(name, el) {
        try {
            const pathSegments = window.location.pathname.split('/').filter(Boolean);
            const includePrefix = pathSegments.length > 1 ? '../'.repeat(pathSegments.length - 1) : '';
            const resp = await fetch(`${includePrefix}includes/${name}.html`, { cache: 'no-cache' });
            if (!resp.ok) return;
            const html = await resp.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const fragment = document.createDocumentFragment();

            Array.from(doc.body.childNodes).forEach(node => {
                if (node.nodeName === 'SCRIPT') {
                    const script = document.createElement('script');
                    if (node.src) {
                        script.src = node.src;
                        script.async = node.async;
                        if (node.crossOrigin) script.crossOrigin = node.crossOrigin;
                    } else {
                        script.textContent = node.textContent;
                    }
                    fragment.appendChild(script);
                } else {
                    fragment.appendChild(node.cloneNode(true));
                }
            });

            el.replaceWith(fragment);
        } catch (err) {
            console.error(`Failed to load include ${name}`, err);
        }
    }

    function handleScroll() {
        const nav = document.querySelector('.main-nav');
        if (!nav) return;
        nav.classList.toggle('scrolled', window.scrollY > 12);
    }

    async function loadAllIncludes() {
        const includes = document.querySelectorAll('[data-include]');
        const promises = [];
        includes.forEach(el => {
            const name = el.getAttribute('data-include');
            if (name) promises.push(loadInclude(name, el));
        });
        await Promise.all(promises);

        // Back to top behaviour if footer added
        const backBtn = document.getElementById('back-to-top');
        if (backBtn) {
            backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) backBtn.classList.add('visible');
                else backBtn.classList.remove('visible');
            });
        }

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        document.dispatchEvent(new Event('includesLoaded'));
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', loadAllIncludes);
    else loadAllIncludes();
})();

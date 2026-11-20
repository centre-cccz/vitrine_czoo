(function () {
    'use strict';
    var albums = window.CZOO_ALBUMS || [];
    var reports = window.CZOO_REPORTS || {};
    var base = window.CZOO_MEDIA_BASE || '';
    var host = document.getElementById('albums-grid');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.querySelectorAll('.reveal').forEach(function (n) { n.classList.add('is-visible'); });
    if (!host) return;

    function el(tag, cls, text) {
        var n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text) n.textContent = text;
        return n;
    }

    function slider(album) {
        var card = el('article', 'gallery-card slider-card is-visible');
        var box = el('div', 'slider');
        box.setAttribute('aria-label', 'Diaporama : ' + album.title);
        var track = el('div', 'slider-track');
        box.appendChild(track);
        var count = el('span', 'tag tag--grey slider-count');
        var body = el('div', 'gallery-card-content');
        body.appendChild(el('h3', '', album.title));
        body.appendChild(el('p', '', album.description));
        card.appendChild(box);
        card.appendChild(body);

        var index = 0, timer = null, visible = false;
        function slides() { return track.children; }
        function update() {
            var n = slides().length;
            if (!n) return;
            index = (index + n) % n;
            track.style.transform = 'translateX(-' + (index * 100) + '%)';
            count.textContent = (index + 1) + ' / ' + n;
        }
        function stop() { if (timer) { clearInterval(timer); timer = null; } }
        function start() {
            if (reduce || timer || !visible || slides().length < 2) return;
            timer = setInterval(function () { index++; update(); }, 5000);
        }
        function arrows() {
            if (slides().length < 2 || box.querySelector('.slider-prev')) return;
            [['prev', '\u2039', 'Pr\u00e9c\u00e9dent', -1], ['next', '\u203a', 'Suivant', 1]].forEach(function (a) {
                var b = el('button', 'slider-' + a[0], a[1]);
                b.type = 'button';
                b.setAttribute('aria-label', a[2]);
                b.addEventListener('click', function () { stop(); index += a[3]; update(); });
                box.appendChild(b);
            });
            box.appendChild(count);
        }

        album.files.forEach(function (file, i) {
            var slide = el('div', 'slide');
            var img = el('img');
            img.alt = album.title + ' - photo ' + (i + 1);
            img.decoding = 'async';
            if (i > 0) img.loading = 'lazy';
            // Une image absente ou illisible est retiree du diaporama (jamais de boucle d'erreur).
            img.addEventListener('error', function () {
                slide.remove();
                if (!slides().length) { card.remove(); return; }
                arrows();
                update();
            }, { once: true });
            img.src = base + album.base + file;
            slide.appendChild(img);
            track.appendChild(slide);
        });
        arrows();
        update();

        if (album.report && reports[album.report]) {
            var a = el('a', 'pg-link', 'Lire le rapport \u2192');
            a.href = 'rapport.html?id=' + encodeURIComponent(album.report);
            body.appendChild(a);
        }
        box.addEventListener('mouseenter', stop);
        box.addEventListener('mouseleave', start);
        box.addEventListener('focusin', stop);
        box.addEventListener('focusout', start);
        var x0 = null;
        box.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; stop(); }, { passive: true });
        box.addEventListener('touchend', function (e) {
            if (x0 === null) return;
            var dx = e.changedTouches[0].clientX - x0;
            if (Math.abs(dx) > 40) { index += dx < 0 ? 1 : -1; update(); }
            x0 = null;
        });
        window.addEventListener('resize', update);
        // Lecture automatique seulement quand le diaporama est visible a l'ecran.
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entries) {
                visible = entries[0].isIntersecting;
                if (visible) start(); else stop();
            }, { threshold: 0.4 }).observe(card);
        }
        return card;
    }

    albums.forEach(function (album) { host.appendChild(slider(album)); });
    if (!albums.length) host.appendChild(el('p', '', 'Les albums seront bient\u00f4t disponibles.'));
})();
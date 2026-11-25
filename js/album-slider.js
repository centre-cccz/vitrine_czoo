(function () {
    'use strict';
    // Diaporama d'album : defilement natif (scroll-snap), sans calcul de decalage.
    // Chaque diapo fait 100 % de la largeur visible, quelle que soit la taille des images.
    var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    function el(tag, cls, text) {
        var n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text) n.textContent = text;
        return n;
    }
    function button(cls, label, aria) {
        var b = el('button', cls, label);
        b.type = 'button';
        b.setAttribute('aria-label', aria);
        return b;
    }

    // ---------- Visionneuse plein ecran (creee une seule fois) ----------
    var lb = null;
    function lightbox() {
        if (lb) return lb;
        var root = el('div', 'lb');
        root.hidden = true;
        root.setAttribute('role', 'dialog');
        root.setAttribute('aria-modal', 'true');
        root.setAttribute('aria-label', 'Visionneuse de photos');
        var img = el('img', 'lb__img');
        var cap = el('div', 'lb__cap');
        var close = button('lb__close', '\u00d7', 'Fermer');
        var prev = button('lb__nav lb__prev', '\u2039', 'Photo pr\u00e9c\u00e9dente');
        var next = button('lb__nav lb__next', '\u203a', 'Photo suivante');
        [img, cap, close, prev, next].forEach(function (n) { root.appendChild(n); });
        document.body.appendChild(root);
        var state = { items: [], i: 0, title: '', opener: null };
        function show(i) {
            var n = state.items.length;
            if (!n) return;
            state.i = (i + n) % n;
            img.src = state.items[state.i].src;
            img.alt = state.items[state.i].alt;
            cap.textContent = (state.i + 1) + ' / ' + n + ' \u00b7 ' + state.title;
        }
        function hide() {
            root.hidden = true;
            document.body.classList.remove('lb-open');
            if (state.opener && state.opener.focus) state.opener.focus();
        }
        close.addEventListener('click', hide);
        prev.addEventListener('click', function () { show(state.i - 1); });
        next.addEventListener('click', function () { show(state.i + 1); });
        root.addEventListener('click', function (e) { if (e.target === root) hide(); });
        document.addEventListener('keydown', function (e) {
            if (root.hidden) return;
            if (e.key === 'Escape') hide();
            else if (e.key === 'ArrowLeft') show(state.i - 1);
            else if (e.key === 'ArrowRight') show(state.i + 1);
        });
        var x0 = null;
        img.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
        img.addEventListener('touchend', function (e) {
            if (x0 === null) return;
            var dx = e.changedTouches[0].clientX - x0;
            if (Math.abs(dx) > 40) show(state.i + (dx < 0 ? 1 : -1));
            x0 = null;
        });
        lb = {
            open: function (items, i, title, opener) {
                state.items = items; state.title = title; state.opener = opener;
                show(i);
                root.hidden = false;
                document.body.classList.add('lb-open');
                close.focus();
            }
        };
        return lb;
    }

    // ---------- Carte d'album ----------
    window.CZOO_albumCard = function (album, opts) {
        opts = opts || {};
        var base = window.CZOO_MEDIA_BASE || '';
        var card = el('article', 'album');
        var viewport = el('div', 'album__viewport');
        var track = el('div', 'album__track');
        track.tabIndex = 0;
        track.setAttribute('role', 'region');
        track.setAttribute('aria-label', 'Diaporama : ' + album.title);
        var count = el('span', 'album__count');
        var dots = el('div', 'album__dots');
        var prev = button('album__nav album__nav--prev', '\u2039', 'Photo pr\u00e9c\u00e9dente');
        var next = button('album__nav album__nav--next', '\u203a', 'Photo suivante');
        viewport.appendChild(track);
        [prev, next, count].forEach(function (n) { viewport.appendChild(n); });
        card.appendChild(viewport);
        card.appendChild(dots);
        var body = el('div', 'album__body');
        body.appendChild(el('h3', '', album.title));
        body.appendChild(el('p', '', album.description));
        card.appendChild(body);
        if (album.report && opts.reports && opts.reports[album.report]) {
            var rl = el('a', 'pg-link', 'Lire le rapport \u2192');
            rl.href = 'rapport.html?id=' + encodeURIComponent(album.report);
            body.appendChild(rl);
        }

        var items = [], index = 0, timer = null, visible = false, manual = false, raf = 0;

        function width() { return track.clientWidth || 1; }
        function refresh() {
            var n = items.length;
            if (!n) { card.remove(); return; }
            index = Math.max(0, Math.min(index, n - 1));
            count.textContent = (index + 1) + ' / ' + n;
            items.forEach(function (it, k) { it.dot.setAttribute('aria-current', k === index ? 'true' : 'false'); });
            var many = n > 1;
            prev.hidden = next.hidden = count.hidden = dots.hidden = !many;
        }
        function go(i, instant) {
            var n = items.length;
            if (!n) return;
            index = (i + n) % n;
            track.scrollTo({ left: index * width(), behavior: (reduce || instant) ? 'auto' : 'smooth' });
            refresh();
        }
        function stop() { if (timer) { clearInterval(timer); timer = null; } }
        function start() {
            if (reduce || manual || timer || !visible || items.length < 2) return;
            timer = setInterval(function () { go(index + 1); }, 5000);
        }
        function removeItem(it) {
            it.slide.remove();
            it.dot.remove();
            items = items.filter(function (x) { return x !== it; });
            refresh();
            if (items.length) track.scrollLeft = index * width();
        }
        function addItem(file, i) {
            var src = base + album.base + file;
            var alt = album.title + ' - photo ' + (i + 1);
            var slide = el('figure', 'album__slide');
            var img = el('img');
            img.alt = alt;
            img.decoding = 'async';
            img.loading = i === 0 ? 'eager' : 'lazy';
            var dot = button('album__dot', '', 'Aller \u00e0 la photo ' + (i + 1));
            var it = { slide: slide, dot: dot, src: src, alt: alt };
            // Une image illisible est retiree proprement (jamais de boucle d'erreur).
            img.addEventListener('error', function () { removeItem(it); }, { once: true });
            img.addEventListener('click', function () {
                lightbox().open(items.map(function (x) { return { src: x.src, alt: x.alt }; }), items.indexOf(it), album.title, img);
            });
            dot.addEventListener('click', function () { manual = true; stop(); go(items.indexOf(it)); });
            img.src = src;
            slide.appendChild(img);
            track.appendChild(slide);
            dots.appendChild(dot);
            items.push(it);
        }
        (album.files || []).forEach(addItem);
        refresh();

        prev.addEventListener('click', function () { manual = true; stop(); go(index - 1); });
        next.addEventListener('click', function () { manual = true; stop(); go(index + 1); });
        track.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft') { manual = true; stop(); go(index - 1); e.preventDefault(); }
            else if (e.key === 'ArrowRight') { manual = true; stop(); go(index + 1); e.preventDefault(); }
        });
        // L'index suit le defilement reel (doigt, souris, clavier).
        track.addEventListener('scroll', function () {
            if (raf) return;
            raf = requestAnimationFrame(function () {
                raf = 0;
                var i = Math.round(track.scrollLeft / width());
                if (i !== index && i >= 0 && i < items.length) { index = i; refresh(); }
            });
        }, { passive: true });
        track.addEventListener('touchstart', function () { manual = true; stop(); }, { passive: true });
        viewport.addEventListener('mouseenter', stop);
        viewport.addEventListener('mouseleave', start);
        track.addEventListener('focusin', stop);
        window.addEventListener('resize', function () { track.scrollLeft = index * width(); });
        // Lecture automatique seulement quand l'album est visible a l'ecran.
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entries) {
                visible = entries[0].isIntersecting;
                if (visible) start(); else stop();
            }, { threshold: 0.5 }).observe(card);
        }
        return card;
    };
})();
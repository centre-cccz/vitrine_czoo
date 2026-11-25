(function () {
    'use strict';
    var events = window.CZOO_EVENTS || [];
    var reports = window.CZOO_REPORTS || {};
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    function day(s) { return new Date(s + 'T00:00:00'); }
    function isPast(e) { return !e.recurring && !!e.end && day(e.end) < today; }
    function el(tag, cls, text) {
        var n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text) n.textContent = text;
        return n;
    }
    function find(id) { return events.filter(function (e) { return e.id === id; })[0]; }
    function picture(src, alt) {
        var img = el('img');
        img.src = src;
        img.alt = alt;
        img.loading = 'lazy';
        img.decoding = 'async';
        img.addEventListener('error', function () {
            if (img.getAttribute('data-fallback')) return;
            img.setAttribute('data-fallback', '1');
            img.src = 'images/placeholder.svg';
        });
        return img;
    }
    var OUTLINE = ['Objectifs et public cibl\u00e9', 'Fr\u00e9quentation (inscrits, pr\u00e9sents)', 'D\u00e9roul\u00e9 et programme r\u00e9alis\u00e9', 'Points forts', 'Difficult\u00e9s rencontr\u00e9es', 'Budget, recettes et partenaires mobilis\u00e9s', 'Recommandations et suites \u00e0 donner', 'Photos, vid\u00e9os et retomb\u00e9es m\u00e9dias'];

    // ---------- Liste : tous les rapports ----------
    var list = document.getElementById('rp-list');
    if (list) {
        var past = events.filter(isPast).sort(function (a, b) { return day(b.end) - day(a.end); });
        past.forEach(function (e) {
            var published = !!reports[e.id];
            var card = el('article', 'rp-card');
            var thumb = el('div', 'thumb');
            thumb.appendChild(picture(e.image, 'Visuel : ' + e.title));
            card.appendChild(thumb);
            var body = el('div', 'body');
            body.appendChild(el('span', published ? 'tag' : 'tag tag--gold', published ? 'Rapport publi\u00e9' : 'Rapport en pr\u00e9paration'));
            body.appendChild(el('h3', '', e.title));
            body.appendChild(el('p', '', e.date));
            var links = el('div', 'links');
            var a = el('a', 'pg-link', published ? 'Lire le rapport \u2192' : 'Voir le mod\u00e8le du rapport \u2192');
            a.href = 'rapport.html?id=' + encodeURIComponent(e.id);
            links.appendChild(a);
            body.appendChild(links);
            card.appendChild(body);
            list.appendChild(card);
        });
        if (!past.length) list.appendChild(el('p', 'rp-pending', 'Aucun \u00e9v\u00e9nement termin\u00e9 pour le moment.'));
        var up = document.getElementById('rp-upcoming');
        if (up) {
            events.filter(function (e) { return !isPast(e); }).forEach(function (e) {
                var li = el('li');
                li.appendChild(el('time', '', e.recurring ? 'R\u00e9current' : e.date));
                var d = el('div');
                d.appendChild(el('strong', '', e.title));
                d.appendChild(document.createTextNode(' \u00b7 rapport publi\u00e9 apr\u00e8s l\u2019\u00e9v\u00e9nement'));
                li.appendChild(d);
                up.appendChild(li);
            });
        }
    }

    // ---------- Fiche : un rapport ----------
    var root = document.getElementById('rapport-root');
    if (!root) return;
    var id = new URLSearchParams(window.location.search).get('id');
    var ev = find(id);
    var rep = reports[id];
    var title = document.getElementById('rp-title');
    var lead = document.getElementById('rp-lead');
    var eyebrow = document.getElementById('rp-eyebrow');
    var crumb = document.getElementById('rp-crumb');
    var bg = document.getElementById('rp-hero-bg');

    function sec(alt, kicker, heading) {
        var s = el('section', 'pg-section' + (alt ? ' pg-section--alt' : ''));
        var c = el('div', 'container');
        var h = el('header', 'pg-head');
        if (kicker) h.appendChild(el('span', 'eyebrow', kicker));
        h.appendChild(el('h2', '', heading));
        c.appendChild(h);
        s.appendChild(c);
        root.appendChild(s);
        return c;
    }
    function bullets(items) {
        var u = el('ul');
        items.forEach(function (t) { u.appendChild(el('li', '', t)); });
        return u;
    }
    function button(label, href, cls, external) {
        var a = el('a', cls || 'btn btn-primary', label);
        a.href = href;
        if (external) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
        return a;
    }

    if (!ev && !rep) {
        title.textContent = 'Rapport introuvable';
        lead.textContent = 'Ce rapport n\u2019existe pas ou n\u2019est pas encore publi\u00e9.';
        var c0 = sec(false, '', 'Retour aux rapports');
        c0.appendChild(button('Voir tous les rapports', 'rapports.html'));
        return;
    }
    var name = rep ? rep.title : ev.title;
    document.title = 'Rapport : ' + name + ' \u2014 Centre culturel Le Zoo';
    title.textContent = name;
    crumb.textContent = name;
    if (ev && bg) bg.style.setProperty('--hero-image', 'url("' + ev.image + '")');

    if (rep) {
        eyebrow.textContent = 'Rapport d\u2019activit\u00e9 \u00b7 ' + rep.period;
        lead.textContent = rep.summary;
        if (rep.figures && rep.figures.length) {
            var cf = sec(false, 'Chiffres cl\u00e9s', 'En un coup d\u2019\u0153il');
            var fg = el('div', 'rp-figures');
            rep.figures.forEach(function (f) {
                var b = el('div', 'rp-figure');
                b.appendChild(el('strong', '', f[0]));
                b.appendChild(el('span', '', f[1]));
                fg.appendChild(b);
            });
            cf.appendChild(fg);
        }
        var cb = sec(true, 'Bilan', 'Objectifs et points forts');
        var two = el('div', 'rp-two');
        var b1 = el('div', 'rp-box'); b1.appendChild(el('h3', '', 'Objectifs')); b1.appendChild(bullets(rep.objectives || []));
        var b2 = el('div', 'rp-box'); b2.appendChild(el('h3', '', 'Points forts')); b2.appendChild(bullets(rep.highlights || []));
        two.appendChild(b1); two.appendChild(b2); cb.appendChild(two);
        if (rep.difficulties && rep.difficulties.length) {
            var bd = el('div', 'rp-box'); bd.style.marginTop = '1.5rem';
            bd.appendChild(el('h3', '', 'Difficult\u00e9s rencontr\u00e9es')); bd.appendChild(bullets(rep.difficulties)); cb.appendChild(bd);
        }
        if (rep.program && rep.program.length) {
            var cp = sec(false, 'D\u00e9roul\u00e9', 'Programme');
            var tl = el('ul', 'rp-timeline');
            rep.program.forEach(function (p) {
                var li = el('li');
                li.appendChild(el('strong', '', p[0]));
                li.appendChild(document.createTextNode(' \u2014 ' + p[1]));
                tl.appendChild(li);
            });
            cp.appendChild(tl);
        }
        if (rep.perspectives) {
            var cs = sec(true, 'Et apr\u00e8s\u00a0?', 'Perspectives');
            cs.appendChild(el('p', '', rep.perspectives));
        }
        var cd = sec(false, 'Documents et m\u00e9dias', 'Pour aller plus loin');
        if (rep.pdf) cd.appendChild(button('T\u00e9l\u00e9charger le rapport (PDF)', rep.pdf, 'btn btn-primary', true));
        else cd.appendChild(el('p', 'rp-pending', 'La version PDF officielle sera mise en ligne prochainement.'));
        (rep.media || []).forEach(function (m) {
            var p = el('p'); p.appendChild(button(m[0] + ' \u2197', m[1], 'pg-link', true)); cd.appendChild(p);
        });
    } else {
        var done = isPast(ev);
        eyebrow.textContent = done ? 'Rapport en pr\u00e9paration' : 'Rapport pr\u00e9vu apr\u00e8s l\u2019\u00e9v\u00e9nement';
        lead.textContent = ev.date + (ev.location ? ' \u00b7 ' + ev.location : '');
        var cm = sec(false, 'Mod\u00e8le de rapport', done ? 'Le rapport de cet \u00e9v\u00e9nement est en cours de r\u00e9daction' : 'Chaque \u00e9v\u00e9nement du Centre fait l\u2019objet d\u2019un rapport public');
        var box = el('div', 'rp-pending');
        box.appendChild(el('h3', '', 'Contenu du rapport'));
        box.appendChild(bullets(OUTLINE));
        cm.appendChild(box);
    }
    var album = (window.CZOO_ALBUMS || []).filter(function (a) { return a.report === id; })[0];
    if (album && window.CZOO_albumCard) {
        var cph = sec(false, 'Photos', 'En images');
        var wrap = el('div', 'rp-album');
        wrap.appendChild(window.CZOO_albumCard(album, {}));
        cph.appendChild(wrap);
    }    var cv = sec(true, 'Votre avis', 'Un retour sur cet \u00e9v\u00e9nement\u00a0?');
    cv.appendChild(el('p', '', 'Votre exp\u00e9rience nous aide \u00e0 am\u00e9liorer nos prochaines activit\u00e9s.'));
    var row = el('div', 'hero-cta');
    row.appendChild(button('Donner mon avis', 'contact.html?objet=avis&event=' + encodeURIComponent(id)));
    if (ev) row.appendChild(button('Voir l\u2019\u00e9v\u00e9nement', 'event.html?id=' + encodeURIComponent(id), 'btn btn-secondary'));
    row.appendChild(button('Tous les rapports', 'rapports.html', 'btn btn-secondary'));
    cv.appendChild(row);
})();
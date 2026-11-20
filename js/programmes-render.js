(function () {
    'use strict';
    // Programmation generee depuis js/events-data.js (source unique) + js/reports-data.js (rapports).
    var events = window.CZOO_EVENTS || [];
    var reports = window.CZOO_REPORTS || {};
    var grid = document.getElementById('programs-grid');
    if (!grid) return;
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var LABELS = { spectacle: 'Spectacle', exposition: 'Exposition', atelier: 'Atelier' };

    function day(s) { return new Date(s + 'T00:00:00'); }
    function isPast(e) { return !e.recurring && !!e.end && day(e.end) < today; }
    function el(tag, cls, text) {
        var n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text) n.textContent = text;
        return n;
    }
    function line(cls, icon, text) {
        var p = el('p', cls);
        var i = el('i', icon);
        i.setAttribute('aria-hidden', 'true');
        p.appendChild(i);
        p.appendChild(document.createTextNode(' ' + text));
        return p;
    }
    function card(e) {
        var past = isPast(e);
        var a = el('article', 'program-card is-visible' + (past ? ' is-past' : ''));
        a.id = 'programme-' + e.id;
        a.setAttribute('data-category', e.category);
        var thumb = el('div', 'thumb');
        var img = el('img');
        img.src = e.image;
        img.alt = 'Visuel : ' + e.title;
        img.loading = 'lazy';
        img.decoding = 'async';
        img.addEventListener('error', function () {
            if (img.getAttribute('data-fallback')) return;
            img.setAttribute('data-fallback', '1');
            img.src = 'images/placeholder.svg';
        });
        thumb.appendChild(img);
        a.appendChild(thumb);
        var body = el('div', 'program-content');
        var badges = el('div', 'program-badges');
        badges.appendChild(el('span', 'program-badge', LABELS[e.category] || '\u00c9v\u00e9nement'));
        if (past) badges.appendChild(el('span', 'tag tag--grey', 'Termin\u00e9'));
        if (past && !reports[e.id]) badges.appendChild(el('span', 'tag tag--gold', 'Rapport en pr\u00e9paration'));
        body.appendChild(badges);
        body.appendChild(el('h3', '', e.title));
        body.appendChild(line('program-date', 'fa-regular fa-calendar', e.date));
        if (e.time) body.appendChild(line('program-time', 'fa-regular fa-clock', e.time));
        if (e.location) body.appendChild(line('program-location', 'fa-solid fa-location-dot', e.location));
        body.appendChild(el('p', '', e.summary));
        var links = el('div', 'program-links');
        var more = el('a', 'btn btn-secondary', 'Plus de d\u00e9tails');
        more.href = 'event.html?id=' + encodeURIComponent(e.id);
        links.appendChild(more);
        if (reports[e.id]) {
            var rep = el('a', 'pg-link', 'Lire le rapport \u2192');
            rep.href = 'rapport.html?id=' + encodeURIComponent(e.id);
            links.appendChild(rep);
        }
        body.appendChild(links);
        a.appendChild(body);
        return a;
    }
    function key(e) { return e.start ? day(e.start).getTime() : Infinity; }
    var upcoming = events.filter(function (e) { return !isPast(e); }).sort(function (a, b) { return key(a) - key(b); });
    var past = events.filter(isPast).sort(function (a, b) { return day(b.end) - day(a.end); });
    upcoming.concat(past).forEach(function (e) { grid.appendChild(card(e)); });
    if (!events.length) grid.appendChild(el('p', 'programs-empty', 'La programmation sera bient\u00f4t disponible.'));
})();
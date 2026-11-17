(function () {
    'use strict';
    // Agenda de l'accueil : genere depuis js/events-data.js selon la date du jour.
    var events = window.CZOO_EVENTS || [];
    var upEl = document.getElementById('agenda-upcoming');
    var pastEl = document.getElementById('agenda-past');
    if (!upEl || !pastEl) return;
    var leadEl = document.getElementById('agenda-lead');
    var nextEl = document.getElementById('next-event-line');
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var LABELS = { spectacle: 'Spectacle', exposition: 'Exposition', atelier: 'Atelier' };
    var PENDING = 'La programmation est en cours de mise \u00e0 jour.';

    function day(s) { return new Date(s + 'T00:00:00'); }
    function fmt(s) { return day(s).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }); }
    function when(e) {
        if (e.recurring) return e.date;
        if (e.approximate) return 'Novembre 2026 \u00b7 dates \u00e0 confirmer';
        return e.start === e.end ? fmt(e.start) : fmt(e.start) + ' \u2192 ' + fmt(e.end);
    }
    function el(tag, cls, text) {
        var n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text) n.textContent = text;
        return n;
    }
    function image(e) {
        var img = el('img');
        img.src = e.image;
        img.alt = 'Visuel de ' + e.title;
        img.loading = 'lazy';
        img.addEventListener('error', function () { img.src = 'images/placeholder.svg'; }, { once: true });
        return img;
    }
    function link(e) { return 'event.html?id=' + encodeURIComponent(e.id); }
    function isRunning(e) { return !e.recurring && !e.approximate && day(e.start) <= today; }

    function upcomingCard(e) {
        var card = el('article', 'event-card');
        card.appendChild(image(e));
        var body = el('div', 'event-body');
        body.appendChild(el('span', 'event-tag', (LABELS[e.category] || 'Événement') + (isRunning(e) ? ' \u00b7 En cours' : '')));
        body.appendChild(el('div', 'event-date', when(e)));
        body.appendChild(el('h3', '', e.title));
        var meta = el('div', 'event-meta');
        if (e.time) meta.appendChild(el('span', '', e.time));
        if (e.location) meta.appendChild(el('span', '', e.location));
        body.appendChild(meta);
        body.appendChild(el('p', '', e.summary));
        var a = el('a', 'text-link', 'D\u00e9couvrir');
        a.href = link(e);
        body.appendChild(a);
        card.appendChild(body);
        return card;
    }
    function pastCard(e) {
        var a = el('a', 'past-card');
        a.href = link(e);
        a.appendChild(image(e));
        var box = el('div');
        box.appendChild(el('strong', '', e.title));
        box.appendChild(el('small', '', when(e)));
        a.appendChild(box);
        return a;
    }

    var dated = events.filter(function (e) { return !e.recurring && e.start; });
    var upcoming = dated.filter(function (e) { return day(e.end) >= today; })
        .sort(function (a, b) { return day(a.start) - day(b.start); });
    var recurring = events.filter(function (e) { return e.recurring; });
    var past = dated.filter(function (e) { return day(e.end) < today; })
        .sort(function (a, b) { return day(b.end) - day(a.end); });

    var shown = upcoming.concat(recurring).slice(0, 3);
    shown.forEach(function (e) { upEl.appendChild(upcomingCard(e)); });
    if (!shown.length) {
        var empty = el('p', 'agenda-empty', PENDING + ' ');
        var c = el('a', 'text-link', 'Nous contacter');
        c.href = 'contact.html';
        empty.appendChild(c);
        upEl.appendChild(empty);
    }
    past.slice(0, 3).forEach(function (e) { pastEl.appendChild(pastCard(e)); });
    if (!past.length) pastEl.parentNode.removeChild(pastEl.previousElementSibling);

    if (leadEl) leadEl.textContent = upcoming.length ? 'Spectacles, expositions et ateliers \u00e0 venir au Centre.' : PENDING + ' Contactez-nous pour conna\u00eetre les prochaines dates.';
    if (nextEl) {
        var first = upcoming[0] || recurring[0];
        nextEl.textContent = first ? first.title + ' \u00b7 ' + when(first) : PENDING;
    }
})();
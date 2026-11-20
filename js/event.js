(function () {
    'use strict';

    function getParam(name) {
        const params = new URLSearchParams(window.location.search);
        return params.get(name);
    }

    function sanitize(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function renderEvent(eventData) {
        const hero = document.getElementById('eventHero');
        const title = document.getElementById('eventTitle');
        const meta = document.getElementById('eventMeta');
        const description = document.getElementById('eventDescription');
        const image = document.getElementById('eventImage');
        const relatedContainer = document.getElementById('relatedEvents');
        const tagsContainer = document.getElementById('eventTags');

        if (!eventData) {
            document.getElementById('eventRoot').innerHTML = '<section class="section"><div class="container"><h1>Événement non trouvé</h1><p>Veuillez vérifier le lien ou revenir à la <a href="programmes.html">programmation</a>.</p></div></section>';
            return;
        }

        title.textContent = eventData.title;
        meta.textContent = [eventData.date, eventData.time, eventData.location].filter(Boolean).join(' • ');
        [eventData.date, eventData.time || '\u00c0 pr\u00e9ciser', eventData.location].forEach((value, i) => { const n = document.getElementById(['eventDate', 'eventTime', 'eventLocation'][i]); if (n) n.textContent = value; });
        description.textContent = eventData.description;
        image.src = eventData.image;
        image.alt = `Visuel de ${eventData.title}`;
        image.addEventListener('error', () => { image.src = 'images/placeholder.svg'; }, { once: true });
        if (hero) {
            hero.style.backgroundImage = `linear-gradient(180deg, rgba(15, 107, 58, 0.88), rgba(15, 107, 58, 0.55)), url('${eventData.image}')`;
            hero.style.backgroundSize = 'cover';
            hero.style.backgroundPosition = 'center';
        }
        if (document.querySelector('meta[name="description"]')) {
            document.querySelector('meta[name="description"]').setAttribute('content', eventData.summary);
        }
        document.title = `${eventData.title} — Centre culturel congolais « Le Zoo »`;

        if (tagsContainer) {
            eventData.tags.forEach(tag => {
                const span = document.createElement('span');
                span.className = 'event-tag';
                span.textContent = tag;
                tagsContainer.appendChild(span);
            });
        }

        const relatedEvents = window.CZOO_EVENTS.filter(e => e.category === eventData.category && e.id !== eventData.id).slice(0, 3);
        relatedEvents.forEach(event => {
            const card = document.createElement('article');
            card.className = 'event-card reveal';
            card.innerHTML = `<a href="event.html?id=${event.id}"><img src="${event.image}" alt="${sanitize(event.title)}" loading="lazy" onerror="this.src='images/placeholder.svg'"></a>
        <div class="event-card-body">
          <span class="event-label">${sanitize(event.category)}</span>
          <h3>${sanitize(event.title)}</h3>
          <p>${sanitize(event.summary)}</p>
          <a href="event.html?id=${event.id}" class="btn btn-secondary">Voir l’événement</a>
        </div>`;
            relatedContainer.appendChild(card);
        });
    }

    function renderReport(e) {
        const box = document.getElementById('eventReport');
        if (!e || !box) return;
        const reports = window.CZOO_REPORTS || {};
        const past = !e.recurring && e.end && new Date(e.end + 'T23:59:59') < new Date();
        const add = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; n.textContent = text; box.appendChild(n); return n; };
        box.hidden = false;
        add('h3', '', 'Rapport de l\u2019\u00e9v\u00e9nement');
        if (reports[e.id]) {
            add('p', '', 'Le bilan complet de cet \u00e9v\u00e9nement est disponible.');
            const a = add('a', 'btn btn-cta', 'Lire le rapport'); a.href = 'rapport.html?id=' + encodeURIComponent(e.id);
        } else if (past) {
            add('p', '', 'Le rapport de cet \u00e9v\u00e9nement est en cours de r\u00e9daction.');
            const a = add('a', 'btn btn-outline-cta', 'Voir le mod\u00e8le du rapport'); a.href = 'rapport.html?id=' + encodeURIComponent(e.id);
        } else {
            add('p', '', 'Le rapport sera publi\u00e9 apr\u00e8s l\u2019\u00e9v\u00e9nement.');
        }
        if (past) { const f = add('a', 'btn btn-outline-cta mt-2', 'Donner mon avis'); f.href = 'contact.html?objet=avis&event=' + encodeURIComponent(e.id); }
    }
    document.addEventListener('DOMContentLoaded', () => {
        const eventId = getParam('id');
        const eventData = (window.CZOO_EVENTS || []).find(evt => evt.id === eventId);
        renderEvent(eventData);
        renderReport(eventData);
    });
})();

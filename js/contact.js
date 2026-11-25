(function () {
    'use strict';
    function el(tag, cls, text) {
        var n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text) n.textContent = text;
        return n;
    }

    // 1) Equipe de direction : cartes compactes, details au survol / au focus clavier / au toucher
    var grid = document.getElementById('team-grid');
    var def = window.CZOO_CONTACT_DEFAULT || {};
    if (grid) {
        (window.CZOO_DIRECTIONS || []).forEach(function (d) {
            var card = el('figure', 'team-card');
            card.tabIndex = 0;
            var img = el('img');
            img.src = d.image;
            img.alt = d.role;
            img.loading = 'lazy';
            img.decoding = 'async';
            img.addEventListener('error', function () {
                if (img.getAttribute('data-fallback')) return;
                img.setAttribute('data-fallback', '1');
                img.src = 'images/placeholder.svg';
            });
            card.appendChild(img);
            card.appendChild(el('figcaption', 'role', d.role));
            var info = el('div', 'team-info');
            if (d.name) {
                info.appendChild(el('strong', '', d.name));
                info.appendChild(el('small', '', d.role));
            } else {
                info.appendChild(el('strong', '', d.role));
            }
            info.appendChild(el('span', '', d.desc));
            var email = d.email || def.email;
            var phone = d.phone || def.phone;
            if (email) { var m = el('a', '', email); m.href = 'mailto:' + email; info.appendChild(m); }
            if (phone) { var t = el('a', '', phone); t.href = 'tel:' + phone.replace(/\s+/g, ''); info.appendChild(t); }
            card.appendChild(info);
            grid.appendChild(card);
        });
    }

    // 2) Retour du formulaire (?success=1 / ?error=1)
    var params = new URLSearchParams(window.location.search);
    var status = document.getElementById('form-status');
    if (status) {
        if (params.get('success') === '1') {
            status.textContent = 'Merci ! Votre message a bien \u00e9t\u00e9 enregistr\u00e9. Nous vous r\u00e9pondrons sous 48 h ouvr\u00e9es.';
            status.classList.add('is-visible', 'success');
        } else if (params.get('error') === '1') {
            status.textContent = 'Votre message n\u2019a pas pu \u00eatre envoy\u00e9. V\u00e9rifiez les champs ou \u00e9crivez-nous directement \u00e0 contact@ccclezoo.cd.';
            status.classList.add('is-visible', 'error');
        }
        if (status.classList.contains('is-visible')) status.scrollIntoView({ block: 'center' });
    }

    // 3) Preremplissage depuis les liens du site (?objet=...&event=...)
    var presets = {
        projet: ['artiste', 'Proposition de projet artistique'],
        location: ['reservation', 'Demande de location d\u2019espace'],
        billetterie: ['reservation', 'Billetterie et r\u00e9servations'],
        visite: ['autre', 'Visite scolaire ou de groupe'],
        partenariat: ['partenariat', 'Demande de partenariat'],
        actualite: ['autre', 'Proposition d\u2019information culturelle'],
        avis: ['autre', 'Avis sur un \u00e9v\u00e9nement']
    };
    var preset = presets[params.get('objet')];
    var subject = document.getElementById('subject');
    var category = document.getElementById('category');
    if (preset && subject && category) {
        if (!category.value) category.value = preset[0];
        if (!subject.value) subject.value = preset[1];
        var ev = (window.CZOO_EVENTS || []).filter(function (e) { return e.id === params.get('event'); })[0];
        if (ev && params.get('objet') === 'avis') subject.value = 'Avis : ' + ev.title;
    }
})();
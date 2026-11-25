(function () {
    'use strict';
    var albums = window.CZOO_ALBUMS || [];
    var reports = window.CZOO_REPORTS || {};
    var host = document.getElementById('albums-grid');
    document.querySelectorAll('.reveal').forEach(function (n) { n.classList.add('is-visible'); });
    if (!host) return;
    albums.forEach(function (album) { host.appendChild(window.CZOO_albumCard(album, { reports: reports })); });
    if (!albums.length) {
        var p = document.createElement('p');
        p.textContent = 'Les albums seront bient\u00f4t disponibles.';
        host.appendChild(p);
    }
})();
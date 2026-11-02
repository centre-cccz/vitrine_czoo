(function () {
    'use strict';

    const slides = Array.from(document.querySelectorAll('.hero-slide'));
    if (slides.length > 1) {
        let current = 0;
        setInterval(() => {
            slides[current].classList.remove('is-active');
            current = (current + 1) % slides.length;
            slides[current].classList.add('is-active');
        }, 5000);
    }

    const weather = document.getElementById('kinshasa-weather');
    if (weather) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        fetch('https://api.open-meteo.com/v1/forecast?latitude=-4.325&longitude=15.322&current=temperature_2m,weather_code&timezone=Africa%2FKinshasa', { signal: controller.signal })
            .then(response => {
                if (!response.ok) throw new Error('Weather request failed');
                return response.json();
            })
            .then(data => {
                const temperature = data.current && data.current.temperature_2m;
                if (typeof temperature !== 'number') throw new Error('Weather data unavailable');
                weather.textContent = `${Math.round(temperature)} °C actuellement · Open-Meteo`;
            })
            .catch(() => {
                weather.textContent = 'Donnée indisponible';
            })
            .finally(() => clearTimeout(timeout));
    }
})();
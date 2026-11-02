document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-current-page]').forEach((link) => {
    const page = link.getAttribute('data-current-page');
    if (!page) return;
    const currentPath = window.location.pathname.split('/').pop() || 'accueil.html';
    if (currentPath.includes(page)) {
      link.classList.add('active');
    }
  });
});

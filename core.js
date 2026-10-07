/* Shared header / footer / mobile-menu behaviour for the new pages */
const header = document.querySelector('.site-header');
addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 8));

(function () {
  const footer = document.getElementById('siteFooter');
  const box = document.getElementById('footerBox');
  if (!footer || !box) return;
  function measure() {
    box.style.transition = 'none';
    box.style.width = '100%'; box.style.height = 'auto';
    const h = box.offsetHeight;
    box.style.width = ''; box.style.height = '';
    void box.offsetWidth;
    box.style.transition = '';
    footer.style.setProperty('--footer-h', h + 'px');
  }
  measure();
  addEventListener('load', measure);
  addEventListener('resize', measure);
  new IntersectionObserver(es => es.forEach(e => footer.classList.toggle('in-view', e.isIntersecting)), { threshold: 0.25 }).observe(footer);
})();

(function () {
  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('mobileMenu');
  const closeBtn = document.getElementById('menuClose');
  if (!toggle || !menu || !closeBtn) return;
  const panels = menu.querySelectorAll('.mm-panel');
  const showPanel = n => panels.forEach(p => p.classList.toggle('is-active', p.dataset.panel === n));
  const open = () => { showPanel('main'); menu.classList.add('is-open'); menu.setAttribute('aria-hidden', 'false'); toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('menu-open'); };
  const close = () => { menu.classList.remove('is-open'); menu.setAttribute('aria-hidden', 'true'); toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open'); };
  toggle.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  menu.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => showPanel(b.dataset.open)));
  menu.querySelectorAll('.mm-back').forEach(b => b.addEventListener('click', () => showPanel('main')));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('is-open')) close(); });
  addEventListener('resize', () => { if (innerWidth > 1024) close(); });
})();
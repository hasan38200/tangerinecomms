/* ==========================================================
   EXTRAS — site-wide animations (all pages)
   Reversible scroll reveals + word-by-word text reveal.
   ========================================================== */
(function () {
  console.log('[extras.js] loaded — ' + new Date().toLocaleTimeString());

  // FORCED OFF so animations run even when OS "Reduce motion" is enabled.
  // Change back to: matchMedia('(prefers-reduced-motion: reduce)').matches
  // when you want the OS setting to be respected again.
  const reduce = false;
  const EASE = 'cubic-bezier(.22,1,.36,1)';

  /* ---------- scroll progress bar ---------- */
  const bar = document.createElement('div');
  bar.className = 'x-progress';
  document.body.appendChild(bar);
  const upd = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')';
  };
  addEventListener('scroll', upd, { passive: true });
  addEventListener('resize', upd);
  upd();

  if (reduce) {
    console.log('[extras.js] prefers-reduced-motion → skipping reveals');
    return;
  }

  /* ---------- split [data-words] into word spans ---------- */
  let wordCount = 0;
  document.querySelectorAll('[data-words]').forEach(el => {
    let i = 0;
    const walk = node => {
      Array.from(node.childNodes).forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(p => {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
            const s = document.createElement('span');
            s.className = 'w';
            s.style.setProperty('--w', i++);
            s.textContent = p;
            frag.appendChild(s);
            wordCount++;
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    };
    walk(el);
  });
  console.log('[extras.js] split into word spans: ' + wordCount);

  /* ---------- REVERSIBLE reveal for [data-rv] + [data-words] ---------- */
  const revealTargets = document.querySelectorAll('[data-rv], [data-words]');
  console.log('[extras.js] reveal targets: ' + revealTargets.length);

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      e.target.classList.toggle('in', e.isIntersecting);
    });
  }, { threshold: 0, rootMargin: '0px' });

  revealTargets.forEach(el => io.observe(el));

  /* ---------- AUTO reveal for cards / inner text ---------- */
  const AUTO = '.rt-card, .rt-ico, .np-cta h3, .rt-note p';
  const autoTargets = document.querySelectorAll(AUTO);
  console.log('[extras.js] auto targets: ' + autoTargets.length);

  const aio = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const el = e.target;
      if (e.isIntersecting) {
        el.animate(
          [{ opacity: 0, translate: '0 46px', scale: '.96' }, { opacity: 1, translate: '0 0', scale: '1' }],
          { duration: 700, easing: EASE, fill: 'both' }
        );
      } else {
        el.animate(
          [{ opacity: 1, translate: '0 0', scale: '1' }, { opacity: 0, translate: '0 46px', scale: '.96' }],
          { duration: 450, easing: EASE, fill: 'both' }
        );
      }
    });
  }, { threshold: 0, rootMargin: '0px' });

  autoTargets.forEach(el => {
    el.style.opacity = '0';
    aio.observe(el);
  });

  /* ---------- image parallax ---------- */
  const imgs = Array.from(document.querySelectorAll('.np-parallax img'));
  imgs.forEach(i => { i.style.scale = '1.14'; });
  let ticking = false;
  const par = () => {
    ticking = false;
    imgs.forEach(img => {
      const box = img.parentElement.getBoundingClientRect();
      if (box.bottom < 0 || box.top > innerHeight) return;
      const mid = box.top + box.height / 2 - innerHeight / 2;
      const max = box.height * 0.06;
      const y = Math.max(-max, Math.min(max, mid * -0.08));
      img.style.translate = '0 ' + y + 'px';
    });
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(par); } }, { passive: true });
  par();

  /* ---------- magnetic buttons ---------- */
  if (matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.np-btn, .cta-button').forEach(b => {
      b.addEventListener('mousemove', e => {
        const r = b.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.18;
        const y = (e.clientY - r.top - r.height / 2) * 0.28;
        b.style.translate = x + 'px ' + y + 'px';
      });
      b.addEventListener('mouseleave', () => {
        b.animate([{ translate: b.style.translate || '0 0' }, { translate: '0 0' }], { duration: 500, easing: EASE });
        b.style.translate = '';
      });
    });
  }
})();
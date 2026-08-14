/* AMER — comportements de defilement.
   Amelioration progressive : sans ce script, le site reste entierement lisible.
   Rien n'est masque par defaut en CSS ; c'est le JS qui masque puis revele,
   et uniquement si l'utilisateur ne demande pas de reduire les animations. */
(function () {
  'use strict';

  /* ---------- Nav condensee qui apparait apres le hero ---------- */
  function buildStickyNav() {
    var links = [
      ['amer_page_agenda.html', 'Agenda'],
      ['amer_page_le_lieu.html', 'Le lieu'],
      ['amer_page_participer.html', 'Participer'],
      ['amer_page_contact.html', 'Contact']
    ];
    var here = (location.pathname.split('/').pop() || 'index.html');

    var bar = document.createElement('div');
    bar.className = 'stnav';

    var brand = document.createElement('a');
    brand.href = 'index.html';
    brand.className = 'brand';
    brand.textContent = 'AMER';
    bar.appendChild(brand);

    var nav = document.createElement('nav');
    links.forEach(function (l) {
      var a = document.createElement('a');
      a.href = l[0];
      a.textContent = l[1];
      if (l[0] === here) a.className = 'active';
      nav.appendChild(a);
    });
    bar.appendChild(nav);
    document.body.appendChild(bar);

    var shown = false;
    var threshold = function () { return window.innerHeight * 0.75; };
    function update() {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      var on = y > threshold();
      if (on !== shown) { shown = on; bar.classList.toggle('show', on); }
    }
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(function () { update(); ticking = false; });
      }
    }, { passive: true });
    update();
  }

  /* ---------- Apparitions au defilement ---------- */
  function buildReveals() {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) return;

    var selector = [
      '.events .top', '.ev',
      '.lieu .wrap > p', '.lieu .wrap > h2', '.lieu .wrap > a.ink-link', '.trip figure',
      '.pano',
      '.participer .wrap > p', '.participer-grid > div',
      '.insta-head', '.foot-cols',
      '.chips', '.ag-row', '.past',
      '.story-grid',
      '.sec-head', '.sub-head', '.tv-inner > *',
      '.stats-band .eyebrow', '.stats-band h2', '.stats-band .lede', '.stats', '.offer-grid',
      '.band-center > *',
      '.contact-grid > div'
    ].join(',');

    var els = Array.prototype.slice.call(document.querySelectorAll(selector));
    if (!els.length) return;

    els.forEach(function (el) {
      el.classList.add('rv');
      // leger decalage en cascade entre freres directs
      var idx = Array.prototype.indexOf.call(el.parentNode.children, el);
      var delay = Math.min(idx, 5) * 70;
      if (delay) el.style.transitionDelay = delay + 'ms';
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('rv-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Menu mobile (hamburger plein ecran) ---------- */
  function buildMobileMenu() {
    var links = [
      ['index.html', 'Accueil'],
      ['amer_page_agenda.html', 'Agenda'],
      ['amer_page_le_lieu.html', 'Le lieu'],
      ['amer_page_participer.html', 'Participer'],
      ['amer_page_contact.html', 'Contact']
    ];
    var here = (location.pathname.split('/').pop() || 'index.html');

    var burger = document.createElement('button');
    burger.className = 'burger';
    burger.setAttribute('aria-label', 'Ouvrir le menu');
    burger.setAttribute('aria-expanded', 'false');
    burger.innerHTML = '<span></span><span></span><span></span>';

    var menu = document.createElement('div');
    menu.className = 'mobile-menu';
    var nav = document.createElement('nav');
    links.forEach(function (l) {
      var a = document.createElement('a');
      a.href = l[0];
      a.textContent = l[1];
      if (l[0] === here) a.className = 'active';
      nav.appendChild(a);
    });
    menu.appendChild(nav);

    document.body.appendChild(burger);
    document.body.appendChild(menu);

    function setOpen(open) {
      document.body.classList.toggle('menu-open', open);
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    }
    burger.addEventListener('click', function () {
      setOpen(!document.body.classList.contains('menu-open'));
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  buildMobileMenu();
  buildStickyNav();
  buildReveals();
})();

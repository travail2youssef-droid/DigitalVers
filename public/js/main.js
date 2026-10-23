/* DigitalVerse — interactions du site vitrine */
(function () {
  'use strict';

  /* ------------------------------------------------ menu mobile + header */
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      })
    );
  }
  const header = document.querySelector('.site-header');
  const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------ scrollspy */
  const spies = document.querySelectorAll('[data-spy]');
  if (spies.length && 'IntersectionObserver' in window) {
    const targets = new Map();
    spies.forEach((a) => {
      const sec = document.getElementById(a.dataset.spy);
      if (sec) targets.set(sec, a);
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            spies.forEach((a) => a.classList.remove('active'));
            const link = targets.get(e.target);
            if (link) link.classList.add('active');
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    targets.forEach((_, sec) => io.observe(sec));
  }

  /* ------------------------------------------------ reveal on scroll */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      reveals.forEach((el) => el.classList.add('visible'));
    } else {
      let i = 0;
      reveals.forEach((el) => el.style.setProperty('--d', `${(i++ % 4) * 0.07}s`));
      const ro = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('visible');
              ro.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      reveals.forEach((el) => ro.observe(el));
    }
  }

  /* ------------------------------------------------ FAQ accordion */
  document.querySelectorAll('.faq-q').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      const open = btn.getAttribute('aria-expanded') === 'true';
      // referme les autres
      document.querySelectorAll('.faq-item.open').forEach((other) => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
          other.querySelector('.faq-a').hidden = true;
        }
      });
      btn.setAttribute('aria-expanded', String(!open));
      item.classList.toggle('open', !open);
      panel.hidden = open;
    });
  });

  /* ------------------------------------------------ onglets tarifs */
  const tabs = document.querySelectorAll('.pricing-tab');
  const tabsWrap = document.querySelector('.pricing-tabs');
  if (tabs.length && tabsWrap) {
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => {
          t.classList.toggle('active', t === tab);
          t.setAttribute('aria-selected', String(t === tab));
        });
        tabsWrap.dataset.active = tab.id === 'tab-agent' ? 'agent' : 'site';
        ['offres-site', 'offres-agent'].forEach((pid) => {
          const p = document.getElementById(pid);
          const show = p.id === tab.getAttribute('aria-controls');
          p.hidden = !show;
          p.classList.toggle('hidden', !show);
        });
      });
    });
    // ouvre directement l'onglet Agents IA si l'URL le demande
    if (location.hash === '#offres-agent' || location.hash === '#agents') {
      const t = document.getElementById('tab-agent');
      if (t) t.click();
    }
  }

  /* ------------------------------------------------ formulaire de contact */
  const form = document.getElementById('contact-form');
  if (form) {
    const setErr = (id, msg) => {
      const err = document.getElementById(id);
      const input = err && err.previousElementSibling?.closest?.('.form-field')?.querySelector('input,textarea');
      if (err) {
        err.textContent = msg || '';
        err.hidden = !msg;
      }
      const field = err && document.querySelector(`[aria-describedby="${id}"]`);
      if (field) field.setAttribute('aria-invalid', msg ? 'true' : 'false');
    };
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      ['c-name-err', 'c-email-err', 'c-message-err', 'c-consent-err'].forEach((id) => setErr(id, ''));
      const globalErr = document.getElementById('contact-error');
      globalErr.hidden = true;

      const data = {
        name: form.name.value.trim(),
        company: form.company.value.trim(),
        email: form.email.value.trim(),
        projectType: form.projectType.value,
        budget: form.budget.value,
        message: form.message.value.trim(),
        consent: form.consent.checked,
      };
      let invalid = false;
      if (data.name.length < 2) { setErr('c-name-err', 'Indiquez votre nom (2 caractères minimum).'); invalid = true; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) { setErr('c-email-err', 'Adresse e-mail invalide.'); invalid = true; }
      if (data.message.length < 10) { setErr('c-message-err', 'Décrivez votre projet en quelques mots (10 caractères minimum).'); invalid = true; }
      if (!data.consent) { setErr('c-consent-err', 'Votre consentement est nécessaire pour traiter votre demande.'); invalid = true; }
      if (invalid) return;

      const btn = document.getElementById('contact-submit');
      btn.classList.add('loading');
      btn.disabled = true;
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const out = await res.json();
        if (res.ok && out.ok) {
          form.reset();
          const ok = document.getElementById('contact-success');
          ok.hidden = false;
          ok.classList.remove('hidden');
          ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (out && out.errors) {
          const map = { name: 'c-name-err', email: 'c-email-err', message: 'c-message-err', consent: 'c-consent-err' };
          Object.entries(out.errors).forEach(([k, v]) => map[k] && setErr(map[k], v));
        } else {
          throw new Error();
        }
      } catch {
        globalErr.textContent = 'Une erreur est survenue. Réessayez dans un instant, ou écrivez-nous via la page de commande.';
        globalErr.hidden = false;
      } finally {
        btn.classList.remove('loading');
        btn.disabled = false;
      }
    });
  }

  /* ------------------------------------------------ moteur parallax unifié (scroll + souris) */
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop = window.matchMedia('(min-width: 921px) and (pointer: fine)').matches;
  const fxActive = !prefersReduced && isDesktop;

  const fxItems = [];
  if (fxActive) {
    document.querySelectorAll('[data-speed], [data-mouse]').forEach((el) => {
      fxItems.push({
        el,
        speed: parseFloat(el.dataset.speed || '0'),
        m: parseFloat(el.dataset.mouse || '0'),
        cx: 0, cy: 0, tx: 0, ty: 0,
      });
    });
    let px = 0, py = 0;
    window.addEventListener('pointermove', (e) => {
      px = (e.clientX / window.innerWidth) * 2 - 1;
      py = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });

    (function fxTick() {
      const vh = window.innerHeight;
      for (const f of fxItems) {
        const rect = f.el.getBoundingClientRect();
        if (rect.bottom < -420 || rect.top > vh + 420) continue;
        const delta = (rect.top + rect.height / 2 - vh / 2) / vh; // -1..1 environ
        const nx = f.m * px * 1.6;
        const ny = f.speed * delta * 170 + f.m * py * 0.9;
        f.cx += (nx - f.cx) * 0.08;
        f.cy += (ny - f.cy) * 0.08;
        f.el.style.transform = 'translate3d(' + f.cx.toFixed(2) + 'px,' + f.cy.toFixed(2) + 'px,0)';
      }
      requestAnimationFrame(fxTick);
    })();
  }

  /* ------------------------------------------------ barre de progression du scroll */
  const sp = document.createElement('div');
  sp.className = 'scroll-progress';
  sp.setAttribute('aria-hidden', 'true');
  document.body.prepend(sp);
  const updateSp = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    sp.style.setProperty('--sp', h > 40 ? Math.min(1, window.scrollY / h).toFixed(4) : 0);
  };
  window.addEventListener('scroll', updateSp, { passive: true });
  window.addEventListener('resize', updateSp);
  updateSp();

  /* ------------------------------------------------ inclinaison 3D au survol */
  const tiltTargets = document.querySelectorAll('.tilt-3d, .tilt-soft');
  tiltTargets.forEach((target) => {
    const strong = target.classList.contains('tilt-3d');
    const max = strong ? 6 : 4.5;
    const scale = strong ? 1.02 : 1.012;
    target.addEventListener('mousemove', (e) => {
      if (prefersReduced) return;
      const rect = target.getBoundingClientRect();
      const rx = ((e.clientY - rect.top - rect.height / 2) / rect.height) * -2 * max;
      const ry = ((e.clientX - rect.left - rect.width / 2) / rect.width) * 2 * max;
      target.style.transform = 'perspective(1000px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) scale(' + scale + ')';
    });
    target.addEventListener('mouseleave', () => {
      target.style.transform = strong ? 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)' : '';
    });
  });

  /* ------------------------------------------------ halo rouge suivant le curseur sur les cartes */
  if (!prefersReduced) {
    document.querySelectorAll('.spotlight').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--sx', (((e.clientX - r.left) / r.width) * 100).toFixed(1) + '%');
        el.style.setProperty('--sy', (((e.clientY - r.top) / r.height) * 100).toFixed(1) + '%');
      });
    });
  }

  /* ------------------------------------------------ boutons magnétiques */
  if (fxActive) {
    document.querySelectorAll('.magnetic').forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = 'translate(' + (x * 0.18).toFixed(1) + 'px,' + (y * 0.22).toFixed(1) + 'px)';
      });
      btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
    });
  }

  /* ------------------------------------------------ reveal 3D au scroll */
  const reveals3d = document.querySelectorAll('.reveal-3d');
  if (reveals3d.length && 'IntersectionObserver' in window) {
    const ro = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            ro.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals3d.forEach((el, i) => {
      el.style.setProperty('--d', `${(i % 6) * 0.08}s`);
      ro.observe(el);
    });
  } else {
    reveals3d.forEach((el) => el.classList.add('visible'));
  }

  /* ------------------------------------------------ champ d'étoiles 3D en perspective (hero) */
  const heroEl = document.querySelector('.hero');
  const heroBg = document.querySelector('.hero-bg');
  if (heroEl && heroBg && fxActive) {
    const cv = document.createElement('canvas');
    cv.id = 'fx-stars';
    heroBg.appendChild(cv);
    const cx = cv.getContext('2d');
    const N = Math.min(170, Math.round(window.innerWidth / 9));
    let W = 0, H = 0, raf = 0, visible = true, mx = 0, my = 0;
    const stars = [];
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const r = heroEl.getBoundingClientRect();
      W = r.width; H = r.height;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      cv.style.width = W + 'px'; cv.style.height = H + 'px';
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    for (let i = 0; i < N; i++) stars.push({ x: Math.random(), y: Math.random(), z: Math.random() * 0.9 + 0.1, red: Math.random() < 0.18 });
    window.addEventListener('pointermove', (e) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });
    const tick = () => {
      cx.clearRect(0, 0, W, H);
      const sc = window.scrollY;
      for (const st of stars) {
        st.z -= 0.0012;
        if (st.z <= 0.06) { st.z = 1; st.x = Math.random(); st.y = Math.random(); }
        const k = (0.55 / st.z) * 0.35;
        const px = (st.x - 0.5) * W * k + W / 2 + mx * (1 - st.z) * 26;
        const py = (st.y - 0.5) * H * k + H / 2 - sc * 0.1 * (1 - st.z) + my * (1 - st.z) * 18;
        if (px < -20 || px > W + 20 || py < -20 || py > H + 20) continue;
        const r = (1 - st.z) * 1.9 + 0.25;
        cx.globalAlpha = Math.min(1, (1 - st.z) * 0.8 + 0.12);
        cx.fillStyle = st.red ? '#f20d25' : 'rgba(255,255,255,0.92)';
        cx.beginPath();
        cx.arc(px, py, r, 0, 6.283);
        cx.fill();
      }
      cx.globalAlpha = 1;
      if (visible) raf = requestAnimationFrame(tick); else raf = 0;
    };
    resize();
    tick();
    window.addEventListener('resize', resize);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        for (const en of entries) {
          if (en.isIntersecting && !raf) { visible = true; raf = requestAnimationFrame(tick); }
          else if (!en.isIntersecting) { visible = false; if (raf) { cancelAnimationFrame(raf); raf = 0; } }
        }
      }, { threshold: 0.01 }).observe(heroEl);
    }
  }

  /* ------------------------------------------------ scène 3D du hero : rotation au curseur */
  const scene = document.querySelector('[data-scene]');
  if (scene && fxActive && heroEl) {
    const inner = scene.querySelector('.hero-scene-inner');
    const glare = scene.querySelector('.scene-glare');
    heroEl.addEventListener('pointermove', (e) => {
      const r = scene.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      inner.style.transform = 'rotateX(' + (ny * -9).toFixed(2) + 'deg) rotateY(' + (nx * 13).toFixed(2) + 'deg)';
      if (glare) {
        glare.style.setProperty('--gx', (e.clientX - r.left) / r.width * 100 + '%');
        glare.style.setProperty('--gy', (e.clientY - r.top) / r.height * 100 + '%');
      }
    }, { passive: true });
    heroEl.addEventListener('pointerleave', () => { inner.style.transform = 'rotateX(0deg) rotateY(0deg)'; });
  }

  /* ------------------------------------------------ flip des cartes services (tactile + clavier) */
  const coarse = !window.matchMedia('(hover: hover)').matches;
  document.querySelectorAll('.flip-card').forEach((card) => {
    if (coarse) {
      card.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        card.classList.toggle('flipped');
      });
    }
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.classList.toggle('flipped'); }
    });
  });
})();

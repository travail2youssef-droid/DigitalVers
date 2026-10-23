/* DigitalVerse — tunnel de commande (étape 1 : besoin, étape 2 : coordonnées) */
(function () {
  'use strict';
  const PLANS = JSON.parse(document.getElementById('plans-data').textContent);
  const form = document.getElementById('order-form');
  if (!form) return;

  const planGroup = document.getElementById('plan-group');
  const dateInput = document.getElementById('o-date');
  const summary = document.getElementById('order-summary');
  const stepsInd = document.querySelectorAll('.step-item');

  // Date minimale : demain
  const tomorrow = new Date(Date.now() + 86400000);
  dateInput.min = tomorrow.toISOString().split('T')[0];

  const fmtPrice = (p) =>
    `${p.from ? 'd�s ' : ''}${p.price.toLocaleString('fr-FR')} €${p.mode === 'monthly' ? '/mois' : ''}`;

  /* ------------------------------------------ rendu des offres selon le type */
  function renderPlans(type) {
    planGroup.innerHTML = '';
    Object.entries(PLANS)
      .filter(([, p]) => p.type === type)
      .forEach(([slug, p]) => {
        const label = document.createElement('label');
        label.className = 'plan-option';
        label.innerHTML = `
          <input type="radio" name="planSlug" value="${slug}">
          <span class="plan-option-body">
            <span class="plan-name">${p.name}${p.mode === 'monthly' ? ' <span class="pill-mini">Abonnement</span>' : ''}</span>
            <span class="plan-tagline">${p.tagline}</span>
            <span class="plan-price">${p.from ? 'dès ' : ''}${p.price.toLocaleString('fr-FR')} €<small>${p.unit}</small></span>
          </span>`;
        planGroup.appendChild(label);
      });
    planGroup.querySelectorAll('input[name="planSlug"]').forEach((r) =>
      r.addEventListener('change', updateSummary)
    );
  }

  function updateSummary() {
    const type = form.type?.value;
    const slug = form.planSlug?.value;
    if (!type || !slug || !PLANS[slug]) { summary.hidden = true; return; }
    const p = PLANS[slug];
    summary.hidden = false;
    document.getElementById('sum-plan').textContent = p.name;
    document.getElementById('sum-price').textContent = fmtPrice(p);
    document.getElementById('sum-type').textContent = type === 'agent' ? 'Projet : agent IA' : 'Projet : site web';
    document.getElementById('sum-date').textContent = dateInput.value
      ? 'Échéance souhaitée : ' + new Date(dateInput.value).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
      : '';
  }

  document.querySelectorAll('input[name="type"]').forEach((r) =>
    r.addEventListener('change', () => {
      renderPlans(r.value);
      hideErr('err-type');
      updateSummary();
    })
  );
  dateInput.addEventListener('change', updateSummary);

  // Présélection depuis /commander?offre=...
  if (window.PRESELECT_OFFRE && PLANS[window.PRESELECT_OFFRE]) {
    const p = PLANS[window.PRESELECT_OFFRE];
    const typeRadio = document.querySelector(`input[name="type"][value="${p.type}"]`);
    if (typeRadio) {
      typeRadio.checked = true;
      renderPlans(p.type);
      const planRadio = planGroup.querySelector(`input[value="${window.PRESELECT_OFFRE}"]`);
      if (planRadio) planRadio.checked = true;
      updateSummary();
    }
  }

  /* ------------------------------------------ erreurs */
  function showErr(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    const field = document.querySelector(`[aria-describedby="${id}"]`);
    if (field) field.setAttribute('aria-invalid', 'true');
  }
  function hideErr(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.hidden = true;
    el.textContent = '';
    const field = document.querySelector(`[aria-describedby="${id}"]`);
    if (field) field.setAttribute('aria-invalid', 'false');
  }

  /* ------------------------------------------ navigation entre étapes */
  const step1 = form.querySelector('[data-step="1"]');
  const step2 = form.querySelector('[data-step="2"]');
  function goStep(n) {
    const s1 = n === 1;
    step1.classList.toggle('hidden', !s1);
    step1.hidden = !s1;
    step2.classList.toggle('hidden', s1);
    step2.hidden = s1;
    stepsInd.forEach((el) => {
      const i = Number(el.dataset.stepInd);
      el.classList.toggle('active', i === n || (n === 1 && i === 1));
      el.classList.toggle('done', i < n);
    });
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  document.getElementById('to-step-2').addEventListener('click', () => {
    let ok = true;
    if (!form.type.value) { showErr('err-type', 'Choisissez le type de projet.'); ok = false; } else hideErr('err-type');
    if (!form.planSlug || !form.planSlug.value) { showErr('err-plan', 'Choisissez une offre.'); ok = false; } else hideErr('err-plan');
    if (!dateInput.value) { showErr('err-date', 'Indiquez une échéance souhaitée.'); ok = false; } else if (dateInput.value < dateInput.min) { showErr('err-date', 'Choisissez une date à venir (au minimum demain).'); ok = false; } else hideErr('err-date');
    if (ok) { updateSummary(); goStep(2); }
  });
  document.getElementById('back-step-1').addEventListener('click', () => goStep(1));

  // Copie du lien privé de suivi
  const copyBtn = document.getElementById('copy-link');
  async function copyText(input, btn) {
    const val = input.value;
    try {
      await navigator.clipboard.writeText(val);
    } catch {
      input.select();
      document.execCommand('copy');
    }
    const old = btn.textContent;
    btn.textContent = 'Copié ✓';
    setTimeout(() => (btn.textContent = old), 2500);
  }
  copyBtn?.addEventListener('click', () => copyText(document.getElementById('success-link'), copyBtn));

  /* ------------------------------------------ soumission */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let ok = true;
    const v = (id) => document.getElementById(id).value.trim();
    if (v('o-firstname').length < 2) { showErr('err-firstname', 'Prénom requis (2 caractères minimum).'); ok = false; } else hideErr('err-firstname');
    if (v('o-lastname').length < 2) { showErr('err-lastname', 'Nom requis (2 caractères minimum).'); ok = false; } else hideErr('err-lastname');
    if (!/^\+?[0-9 .\-()]{8,20}$/.test(v('o-phone'))) { showErr('err-phone', 'Numéro de téléphone invalide.'); ok = false; } else hideErr('err-phone');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v('o-email'))) { showErr('err-email', 'Adresse e-mail invalide.'); ok = false; } else hideErr('err-email');
    if (!document.getElementById('o-consent').checked) { showErr('err-consent', 'Votre consentement est nécessaire pour traiter votre commande.'); ok = false; } else hideErr('err-consent');
    if (!ok) return;

    const btn = document.getElementById('order-submit');
    const globalErr = document.getElementById('order-error');
    globalErr.hidden = true;
    btn.classList.add('loading');
    btn.disabled = true;
    try {
      const res = await fetch('/api/commande', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: form.type.value,
          planSlug: form.planSlug.value,
          desiredDate: dateInput.value,
          firstName: v('o-firstname'),
          lastName: v('o-lastname'),
          phone: v('o-phone'),
          email: v('o-email'),
          comment: document.getElementById('o-comment').value.trim(),
          consent: true,
        }),
      });
      const out = await res.json();
      if (res.ok && out.ok && out.redirect) {
        const url = location.origin + out.redirect;
        form.hidden = true;
        form.classList.add('hidden');
        document.querySelectorAll('.order-steps .step-item').forEach((el) => {
          el.classList.remove('active');
          el.classList.add('done');
        });
        const box = document.getElementById('order-success');
        box.hidden = false;
        box.classList.remove('hidden');
        document.getElementById('success-link').value = url;
        document.getElementById('go-brief').href = out.redirect;
        box.focus();
        box.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      if (out && out.errors) {
        const map = { firstName: 'err-firstname', lastName: 'err-lastname', phone: 'err-phone', email: 'err-email', consent: 'err-consent', desiredDate: 'err-date' };
        Object.entries(out.errors).forEach(([k, msg]) => { if (map[k]) showErr(map[k], msg); });
        if (out.errors.type || out.errors.planSlug || out.errors.desiredDate) goStep(1);
      } else {
        throw new Error(out && out.error ? out.error : 'erreur');
      }
    } catch (err) {
      globalErr.textContent = 'Une erreur est survenue lors de l’enregistrement. Réessayez dans un instant.';
      globalErr.hidden = false;
    } finally {
      btn.classList.remove('loading');
      btn.disabled = false;
    }
  });
})();

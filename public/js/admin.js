/* DigitalVerse — espace administrateur : gestionnaire de commandes
   (auto-actualisation 8 s), messages, registre et configuration de l'API IA. */
(function () {
  'use strict';

  const STATUTS = {
    nouveau: 'Nouvelle',
    brief: 'Brief en cours',
    brief_termine: 'Brief terminé',
    confirmee: 'Confirmée',
    prete: 'Prête',
    archivee: 'Archivée',
  };
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmtDate = (iso) => new Date(iso).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  const fmtDay = (iso) => new Date(iso).toLocaleDateString('fr-FR');

  /* ------------------------------------------------------------- onglets */
  const tabs = document.querySelectorAll('.admin-tab');
  tabs.forEach((t) =>
    t.addEventListener('click', () => {
      tabs.forEach((x) => { x.classList.toggle('active', x === t); x.setAttribute('aria-selected', String(x === t)); });
      document.querySelectorAll('.admin-panel').forEach((p) => (p.hidden = p.id !== 'panel-' + t.dataset.tab));
      if (t.dataset.tab === 'messages') loadMessages();
      if (t.dataset.tab === 'statistiques') loadStats();
    })
  );

  /* ============================================ COMMANDES (auto-refresh) */
  const tbody = document.getElementById('orders-tbody');
  const filter = document.getElementById('filter-status');
  const lastRefresh = document.getElementById('last-refresh');
  const countEl = document.getElementById('count-commandes');
  const banner = document.getElementById('new-order-banner');
  let knownIds = new Set();
  let latestOrders = [];

  function rowOrder(o, isNew) {
    const plan = o.planName ? `${o.planName} — ${o.planPrice} €${o.planUnit === '/mois' ? '/mois' : ''}` : o.planSlug;
    return `<tr class="${isNew ? 'is-new' : ''}">
      <td>${fmtDate(o.createdAt)}</td>
      <td><span class="cell-main">${isNew ? '<span class="row-new-badge" aria-label="nouveau"></span>' : ''}${esc(o.client.firstName)} ${esc(o.client.lastName)}</span><br>
          <span class="cell-sub">${esc(o.client.email)} · ${esc(o.client.phone)}</span></td>
      <td>${o.type === 'agent' ? '🤖 Agent IA' : '🌐 Site web'}</td>
      <td>${esc(plan)}</td>
      <td>${esc(fmtDay(o.desiredDate))}</td>
      <td><span class="pill" data-status="${esc(o.status)}">${STATUTS[o.status] || esc(o.status)}</span>${o.brief ? ' <span class="cell-sub">brief ✓</span>' : ''}</td>
      <td><a class="btn btn-outline btn-sm" href="/admin/commandes/${encodeURIComponent(o.id)}">Ouvrir</a></td>
    </tr>`;
  }

  function renderOrders(orders) {
    const f = filter.value;
    const list = f ? orders.filter((o) => o.status === f) : orders;
    countEl.textContent = orders.filter((o) => !['archivee'].includes(o.status)).length;
    if (!list.length) {
      tbody.innerHTML = `<tr><td colspan="7" class="muted" style="padding:2rem">Aucune commande${f ? ' avec ce statut' : ''} pour le moment.</td></tr>`;
      return;
    }
    tbody.innerHTML = list.map((o) => rowOrder(o, !knownIds.has(o.id))).join('');
  }

  function renderRegistry(orders) {
    const reg = document.getElementById('registry-tbody');
    const done = orders.filter((o) => ['prete', 'archivee'].includes(o.status));
    if (!done.length) {
      reg.innerHTML = '<tr><td colspan="5" class="muted" style="padding:2rem">Aucune livraison enregistrée pour le moment.</td></tr>';
      return;
    }
    reg.innerHTML = done
      .map(
        (o) => `<tr>
        <td><span class="cell-main">${esc(o.id)}</span></td>
        <td>${esc(o.client.firstName)} ${esc(o.client.lastName)}</td>
        <td>${esc(o.planName || o.planSlug)}</td>
        <td>${o.livraison && o.livraison.url ? `<a href="${esc(o.livraison.url)}" target="_blank" rel="noopener">${esc(o.livraison.url)}</a>${o.livraison.note ? `<br><span class="cell-sub">${esc(o.livraison.note)}</span>` : ''}` : '<span class="muted">—</span>'}</td>
        <td><span class="pill" data-status="${esc(o.status)}">${STATUTS[o.status]}</span></td>
      </tr>`
      )
      .join('');
  }

  async function loadOrders() {
    try {
      const res = await fetch('/api/admin/commandes');
      if (res.status === 401) { location.href = '/admin/connexion'; return; }
      const out = await res.json();
      if (!out.ok) return;
      const fresh = out.orders.filter((o) => !knownIds.has(o.id) && !['archivee'].includes(o.status));
      // première charge : pas de bannière
      if (knownIds.size > 0 && fresh.length > 0) {
        banner.hidden = false;
        setTimeout(() => (banner.hidden = true), 12000);
      }
      knownIds = new Set(out.orders.map((o) => o.id));
      latestOrders = out.orders;
      renderOrders(latestOrders);
      renderRegistry(latestOrders);
      lastRefresh.textContent = 'à ' + new Date().toLocaleTimeString('fr-FR');
    } catch { /* conserver l'affichage actuel */ }
  }

  filter.addEventListener('change', () => renderOrders(latestOrders));
  loadOrders();
  setInterval(loadOrders, 8000);

  /* ============================================ STATISTIQUES (CA réel) */
  const statCA = document.getElementById('stat-ca');
  const statCADetail = document.getElementById('stat-ca-detail');
  const statNbPaye = document.getElementById('stat-nbpaye');
  const statNbPayeDetail = document.getElementById('stat-nbpaye-detail');
  const statEnAttente = document.getElementById('stat-enattente');
  const statTarifChatbot = document.getElementById('stat-tarif-chatbot');
  const statTarifAutomation = document.getElementById('stat-tarif-automation');
  const statCAAgent = document.getElementById('stat-ca-agent');
  const statNbAgent = document.getElementById('stat-nb-agent');
  const chartEmpty = document.getElementById('chart-ca-empty');
  const canvas = document.getElementById('chart-ca');
  const ctx = canvas ? canvas.getContext('2d') : null;

  let lastParMois = [];

  async function loadStats() {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.status === 401) { location.href = '/admin/connexion'; return; }
      const out = await res.json();
      if (!out.ok) return;
      lastParMois = out.parMois;
      document.getElementById('count-ca').textContent = out.caTotal.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
      if (statCA) statCA.textContent = out.caTotal.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
      if (statCADetail) statCADetail.textContent = out.nbPaye + ' commande' + (out.nbPaye > 1 ? 's' : '') + ' payée' + (out.nbPaye > 1 ? 'es' : '');
      if (statNbPaye) statNbPaye.textContent = out.nbPaye;
      if (statNbPayeDetail) statNbPayeDetail.textContent = 'Panier moyen : ' + (out.panierMoyen || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
      if (statEnAttente) statEnAttente.textContent = out.nbEnAttente;

      // Tarifs des offres Agents IA
      if (out.tarifsAgents && statTarifChatbot && statTarifAutomation) {
        const chatbot = out.tarifsAgents.find((t) => t.slug === 'chatbot-ia');
        const automation = out.tarifsAgents.find((t) => t.slug === 'automatisation-ia');
        if (chatbot) statTarifChatbot.textContent = chatbot.price.toLocaleString('fr-FR') + ' € ' + chatbot.unit;
        if (automation) statTarifAutomation.textContent = automation.price.toLocaleString('fr-FR') + ' € ' + automation.unit;
      }

      // Ventilation CA par type
      if (out.parType) {
        if (statCAAgent) statCAAgent.textContent = out.parType.agent.ca.toLocaleString('fr-FR') + ' €';
        if (statNbAgent) statNbAgent.textContent = out.parType.agent.nb + ' commande' + (out.parType.agent.nb > 1 ? 's' : '') + ' payée' + (out.parType.agent.nb > 1 ? 'es' : '');
      }

      drawCAChart(out.parMois);
    } catch { /* silencieux */ }
  }

  function drawCAChart(parMois) {
    if (!ctx || !canvas) return;
    chartEmpty && (chartEmpty.style.display = 'none');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const w = rect.width, h = rect.height;
    ctx.clearRect(0, 0, w, h);

    const values = parMois.map((m) => m.ca);
    const max = Math.max(...values, 1);
    const pad = 24;
    const bw = (w - pad * 2) / parMois.length - 16;
    let hasData = false;

    // barres
    ctx.fillStyle = '#f20d25';
    parMois.forEach((m, i) => {
      if (m.ca <= 0) return;
      hasData = true;
      const bx = pad + i * (bw + 16) + 8;
      const by = h - 26 - (m.ca / max) * (h - 56);
      ctx.fillRect(bx, by, bw, h - 26 - by);
      ctx.fillStyle = '#b8b8b8';
      ctx.font = '11px Inter, system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(m.label, bx + bw / 2, h - 10);
      ctx.fillStyle = '#f20d25';
    });

    // ligne max
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad, h - 26);
    ctx.lineTo(w - pad, h - 26);
    ctx.stroke();

    if (!hasData) {
      chartEmpty && (chartEmpty.style.display = 'block');
    }
  }

  window.addEventListener('resize', () => {
    const p = document.getElementById('panel-statistiques');
    if (p && !p.hidden && lastParMois.length) drawCAChart(lastParMois);
  });

  /* ------------------------------------------------------------ messages */
  const msgList = document.getElementById('messages-list');
  async function loadMessages() {
    try {
      const res = await fetch('/api/admin/messages');
      const out = await res.json();
      if (!out.ok) return;
      document.getElementById('count-messages').textContent = out.messages.filter((m) => !m.read).length;
      if (!out.messages.length) {
        msgList.innerHTML = '<p class="muted" style="padding:1.2rem">Aucun message reçu via le formulaire de contact.</p>';
        return;
      }
      msgList.innerHTML = out.messages
        .map(
          (m) => `<div class="message-item ${m.read ? '' : 'unread'}" data-id="${esc(m.id)}">
          <div class="message-meta">
            <span><strong>${esc(m.name)}</strong>${m.company ? ' — ' + esc(m.company) : ''} · <a href="mailto:${esc(m.email)}">${esc(m.email)}</a></span>
            <span>${fmtDate(m.createdAt)} · ${esc(m.projectType)}${m.budget ? ' · Budget : ' + esc(m.budget) : ''}</span>
          </div>
          <p class="message-body">${esc(m.message)}</p>
          ${m.read ? '' : '<div><button class="btn btn-ghost btn-sm mark-read">Marquer comme lu</button></div>'}
        </div>`
        )
        .join('');
    } catch { /* silencieux */ }
  }
  msgList.addEventListener('click', async (e) => {
    const btn = e.target.closest('.mark-read');
    if (!btn) return;
    const item = btn.closest('.message-item');
    await fetch('/api/admin/messages/' + encodeURIComponent(item.dataset.id) + '/lu', { method: 'POST' });
    item.classList.remove('unread');
    btn.remove();
  });

  /* --------------------------------------------------------- configuration API */
  const apiForm = document.getElementById('api-form');
  const apiResult = document.getElementById('api-result');
  const modeSelect = document.getElementById('api-mode');
  const fieldsApi = document.getElementById('fields-api');
  const fieldsN8n = document.getElementById('fields-n8n');
  function toggleModeFields() {
    const m = modeSelect.value;
    if (fieldsApi) fieldsApi.hidden = m !== 'api';
    if (fieldsN8n) fieldsN8n.hidden = m !== 'n8n';
  }
  modeSelect.addEventListener('change', toggleModeFields);
  toggleModeFields();

  function settingsPayload() {
    return {
      mode: modeSelect.value,
      endpoint: document.getElementById('api-endpoint').value,
      model: document.getElementById('api-model').value,
      n8nUrl: document.getElementById('api-n8nurl').value,
      apiKey: document.getElementById('api-key').value,
      systemPrompt: document.getElementById('api-prompt').value,
    };
  }

  apiForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('api-save');
    btn.classList.add('loading');
    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settingsPayload()),
    });
    btn.classList.remove('loading');
    const out = await res.json().catch(() => ({}));
    apiResult.textContent = res.ok && out.ok ? 'Configuration enregistrée ✓' : 'Erreur lors de l’enregistrement.';
    setTimeout(() => (apiResult.textContent = ''), 5000);
  });

  document.getElementById('api-test').addEventListener('click', async () => {
    apiResult.textContent = 'Test en cours (jusqu’à 25 s)…';
    // sauvegarde d'abord la config courante pour tester la bonne cible
    await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settingsPayload()),
    });
    const res = await fetch('/api/admin/settings/test', { method: 'POST' });
    const out = await res.json().catch(() => ({}));
    apiResult.textContent = out.ok ? `Connexion réussie ✓ — réponse : « ${out.reply} »` : `Échec : ${out.error || 'erreur inconnue'}`;
  });

  // compte messages au chargement
  loadMessages();
})();

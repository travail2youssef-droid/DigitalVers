/* DigitalVerse — page de brief IA (client) */
(function () {
  'use strict';
  const data = JSON.parse(document.getElementById('order-data').textContent);
  const messagesEl = document.getElementById('chat-messages');
  const formEl = document.getElementById('chat-form');
  const textEl = document.getElementById('chat-text');
  const sendBtn = document.getElementById('send-btn');
  const finishBtn = document.getElementById('finish-btn');
  const progressBar = document.getElementById('progress-bar');
  const progressLabel = document.getElementById('progress-label');
  const briefResult = document.getElementById('brief-result');
  const statusPill = document.getElementById('status-pill');
  const agentStatus = document.getElementById('agent-status');

  const STATUTS = {
    nouveau: 'Commande reçue',
    brief: 'Brief en cours',
    brief_termine: 'Brief transmis — étude en cours',
    confirmee: 'Commande confirmée — en production',
    prete: 'Livrée',
    archivee: 'Clôturée',
  };

  let finished = Boolean(data.brief);
  let userCount = data.chat.filter((m) => m.role === 'user').length;

  /* ------------------------------------------------------------- affichage */
  function addBubble(role, text, at) {
    const b = document.createElement('div');
    b.className = `bubble ${role}`;
    const p = document.createElement('p');
    p.className = 'bubble-text';
    p.textContent = text;
    b.appendChild(p);
    if (at) {
      const t = document.createElement('p');
      t.className = 'bubble-time muted small';
      t.textContent = new Date(at).toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' });
      b.appendChild(t);
    }
    messagesEl.appendChild(b);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return b;
  }

  function showTyping() {
    const b = document.createElement('div');
    b.className = 'bubble assistant';
    b.id = 'typing-bubble';
    const p = document.createElement('p');
    p.className = 'bubble-text typing';
    p.innerHTML = '<span></span><span></span><span></span>';
    b.appendChild(p);
    messagesEl.appendChild(b);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }
  function hideTyping() {
    document.getElementById('typing-bubble')?.remove();
  }

  function setProgress(progress) {
    if (!progress || !progress.total) return;
    progressBar.style.width = Math.round((progress.done / progress.total) * 100) + '%';
    progressLabel.textContent = `${progress.done}/${progress.total}`;
  }

  function updateFinishBtn(canConclude) {
    if (finished) { finishBtn.disabled = true; finishBtn.textContent = 'Brief transmis ✓'; return; }
    finishBtn.disabled = !(canConclude || userCount >= 2);
  }

  function setStatusPill(status) {
    statusPill.textContent = STATUTS[status] || status;
    statusPill.dataset.status = status;
  }

  function verdicteLabel(v) {
    return v === 'compatible' ? '✓ Demande compatible avec votre offre' : v === 'ajustements' ? '⚠ Compatible avec quelques ajustements' : '✕ Certains éléments dépassent votre offre';
  }

  function showBrief(brief) {
    finished = true;
    updateFinishBtn(false);
    briefResult.hidden = false;
    briefResult.innerHTML = '';
    const h = document.createElement('h3');
    h.textContent = 'Synthèse de votre brief';
    briefResult.appendChild(h);

    if (brief.description) {
      const d = document.createElement('p');
      d.className = 'brief-line';
      d.innerHTML = '<strong>Votre projet — </strong>';
      d.appendChild(document.createTextNode(brief.description));
      briefResult.appendChild(d);
    }
    (brief.sections || []).forEach((sec) => {
      const d = document.createElement('p');
      d.className = 'brief-line';
      const s = document.createElement('strong');
      s.textContent = sec.label + ' — ';
      d.appendChild(s);
      d.appendChild(document.createTextNode(sec.value));
      briefResult.appendChild(d);
    });
    if (brief.features && brief.features.length) {
      const wrap = document.createElement('div');
      brief.features.forEach((f) => {
        const t = document.createElement('span');
        t.className = 'tag';
        t.textContent = f;
        wrap.appendChild(t);
      });
      briefResult.appendChild(wrap);
    }
    const v = document.createElement('div');
    v.className = `verdict-box verdict-${brief.compat.verdict}`;
    const vp = document.createElement('p');
    const vs = document.createElement('strong');
    vs.textContent = verdicteLabel(brief.compat.verdict);
    vp.appendChild(vs);
    v.appendChild(vp);
    const vd = document.createElement('p');
    vd.textContent = brief.compat.summary + (brief.compat.points && brief.compat.points.length
      ? ' Points signalés : ' + brief.compat.points.map((p) => p.label).join(', ') + '.'
      : '');
    v.appendChild(vd);
    briefResult.appendChild(v);
    briefResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /* ------------------------------------------------------------------ init */
  data.chat.forEach((m) => addBubble(m.role, m.text, m.at));
  setStatusPill(data.status);
  if (data.brief) {
    showBrief(data.brief);
    progressBar.style.width = '100%';
    progressLabel.textContent = 'Brief terminé ✓';
    agentStatus.textContent = 'Brief transmis à DigitalVerse';
    textEl.disabled = true;
    sendBtn.disabled = true;
    formEl.classList.add('disabled');
    textEl.placeholder = 'Brief transmis — vous pouvez fermer cette page, nous revenons vers vous.';
  }
  if (data.livraison && data.livraison.url) showLivraison(data.livraison);
  updateFinishBtn(false);

  // Lien privé de suivi : affichage + copie
  const suiviInput = document.getElementById('suivi-link');
  const suiviBtn = document.getElementById('copy-suivi');
  if (suiviInput && suiviBtn) {
    suiviInput.value = location.href;
    suiviBtn.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(location.href); }
      catch { suiviInput.select(); document.execCommand('copy'); }
      const old = suiviBtn.textContent;
      suiviBtn.textContent = 'Copié ✓';
      setTimeout(() => (suiviBtn.textContent = old), 2500);
    });
  }

  function showLivraison(liv) {
    const box = document.getElementById('livraison-box');
    box.hidden = false;
    const a = document.getElementById('livraison-url');
    a.href = liv.url;
    document.getElementById('livraison-note').textContent = liv.note || '';
  }

  /* ------------------------------------------------------------- envoi msg */
  let sending = false;
  async function send() {
    const text = textEl.value.trim();
    if (!text || sending || finished) return;
    sending = true;
    textEl.value = '';
    textEl.style.height = 'auto';
    userCount += 1;
    addBubble('user', text, new Date().toISOString());
    sendBtn.disabled = true;
    textEl.disabled = true;
    agentStatus.textContent = 'L’assistant rédige…';
    showTyping();
    try {
      const res = await fetch(`/api/chat/${encodeURIComponent(data.id)}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: data.key, text }),
      });
      const out = await res.json();
      hideTyping();
      if (res.ok && out.ok) {
        addBubble('assistant', out.reply, new Date().toISOString());
        setProgress(out.progress);
        updateFinishBtn(out.canConclude);
        if (out.closed) setStatusPill('brief_termine');
      } else {
        addBubble('assistant', out.error || 'Une erreur est survenue, réessayez.', new Date().toISOString());
      }
    } catch {
      hideTyping();
      addBubble('assistant', 'Problème de connexion. Votre message n’a peut-être pas été enregistré — réessayez.', new Date().toISOString());
    } finally {
      sending = false;
      sendBtn.disabled = false;
      textEl.disabled = false;
      textEl.focus();
      agentStatus.textContent = 'En ligne — répond instantanément';
      updateFinishBtn(false);
    }
  }

  formEl.addEventListener('submit', (e) => { e.preventDefault(); send(); });
  textEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });
  // auto-resize textarea
  textEl.addEventListener('input', () => {
    textEl.style.height = 'auto';
    textEl.style.height = Math.min(textEl.scrollHeight, 140) + 'px';
  });

  /* ----------------------------------------------------------- terminer */
  finishBtn.addEventListener('click', async () => {
    if (finished) return;
    const ok = window.confirm('Terminer le brief ? Vos réponses seront transmises à DigitalVerse pour étude.');
    if (!ok) return;
    finishBtn.disabled = true;
    finishBtn.textContent = 'Transmission…';
    try {
      const res = await fetch(`/api/chat/${encodeURIComponent(data.id)}/terminer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: data.key }),
      });
      const out = await res.json();
      if (res.ok && out.ok) {
        addBubble('assistant', 'Votre brief est prêt et vient d’être transmis à DigitalVerse. Nous étudions votre demande et revenons vers vous pour confirmer la suite. Merci pour votre confiance !', new Date().toISOString());
        showBrief(out.brief);
        setStatusPill(out.status);
        finishBtn.textContent = 'Brief transmis ✓';
        agentStatus.textContent = 'Brief transmis à DigitalVerse';
        textEl.placeholder = 'Brief transmis — ajoutez des précisions par la suite via DigitalVerse si besoin.';
      } else {
        finishBtn.textContent = out.error || 'Terminer le brief';
        finishBtn.disabled = false;
      }
    } catch {
      finishBtn.textContent = 'Terminer le brief';
      finishBtn.disabled = false;
    }
  });

  /* ------------------------------------- suivi du statut (toutes les 15 s) */
  setInterval(async () => {
    try {
      const res = await fetch(`/api/chat/${encodeURIComponent(data.id)}/statut?key=${encodeURIComponent(data.key)}`);
      const out = await res.json();
      if (out.ok) {
        setStatusPill(out.status);
        if (out.livraison && out.livraison.url) showLivraison(out.livraison);
      }
    } catch { /* silencieux */ }
  }, 15000);
})();

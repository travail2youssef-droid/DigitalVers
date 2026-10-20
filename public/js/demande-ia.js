/* DigitalVerse — démarrage d'une demande directement avec l'assistant IA.
   Aucun formulaire : un clic crée la conversation (seule une offre
   éventuellement présélectionnée depuis les cartes tarifaires est
   transmise), puis l'assistant collecte tout le reste en discutant. */
(function () {
  'use strict';
  const btn = document.getElementById('start-ia');
  if (!btn) return;
  const errEl = document.getElementById('ia-error');
  const label = btn.querySelector('.btn-label');
  const defaultLabel = label ? label.textContent : '';

  let starting = false;
  btn.addEventListener('click', async () => {
    if (starting) return;
    starting = true;
    if (errEl) { errEl.hidden = true; errEl.textContent = ''; }
    btn.classList.add('loading');
    btn.disabled = true;
    if (label) label.textContent = 'Ouverture de la conversation…';
    try {
      const res = await fetch('/api/demande-ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planSlug: btn.dataset.offre || '' }),
      });
      const out = await res.json().catch(() => ({}));
      if (res.ok && out.ok && out.redirect) {
        window.location.href = out.redirect;
        return;
      }
      throw new Error(out.error || 'Impossible d’ouvrir la conversation pour le moment.');
    } catch (e) {
      if (errEl) {
        errEl.textContent = (e && e.message) || 'Une erreur est survenue. Réessayez dans un instant.';
        errEl.hidden = false;
      }
      starting = false;
      btn.classList.remove('loading');
      btn.disabled = false;
      if (label) label.textContent = defaultLabel;
    }
  });
})();

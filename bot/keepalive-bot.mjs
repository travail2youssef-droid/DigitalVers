/* ═══════════════════════════════════════════════════════════════════════════
   DigitalVerse — bot de veille (zéro dépendance, Node ≥ 21)

   Rôle : tant que ce processus tourne, il
     1. reste « en ligne » sur Discord (connexion gateway, intents 0 — le bot
        ne lit AUCUN message des serveurs) ;
     2. ping SITE_URL toutes les PING_EVERY_SECONDS (défaut 240 s) pour
        empêcher l'instance Render gratuite de s'endormir ;
     3. annonce sur le salon Discord REPORT_CHANNEL_ID uniquement les
        transitions (site KO puis retour OK) — pas de spam périodique.

   Configuration par variables d'environnement ou via bot/.env (non commité) :
     DISCORD_TOKEN        token du bot (Reset Token dans le portail développeur)
     SITE_URL             défaut https://digitalvers.onrender.com
     PING_EVERY_SECONDS   défaut 240
     REPORT_CHANNEL_ID    ID du salon texte où poster les alertes (optionnel)
     PORT                 si défini : micro-serveur /health (déploiement
                          Render/Koyeb en service web)

   Ce fichier ne contient AUCUN secret. Ne jamais committer le .env.
   ═══════════════════════════════════════════════════════════════════════════ */
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

/* — mini chargeur .env (lignes KEY=VALUE, sans écraser l'environnement réel) — */
const here = path.dirname(fileURLToPath(import.meta.url));
const envFile = path.join(here, '.env');
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const env = (k, d) => (process.env[k] !== undefined && process.env[k] !== '' ? process.env[k] : d);
const TOKEN = env('DISCORD_TOKEN', '');
const SITE_URL = env('SITE_URL', 'https://digitalvers.onrender.com').replace(/\/+$/, '');
const PING_URL = SITE_URL + '/robots.txt';
const PING_MS = Math.max(60, parseInt(env('PING_EVERY_SECONDS', '240'), 10) || 240) * 1000;
const CHANNEL_ID = env('REPORT_CHANNEL_ID', '');
const HEALTH_PORT = parseInt(env('PORT', ''), 10) || null;
const UA = 'DigitalVerse-KeepAliveBot/1.0 (+bot de surveillance; ne modifie rien)';
const ts = () => new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
const log = (...a) => console.log(`[${ts()}]`, ...a);

const stats = { pings: 0, ok: 0, fail: 0, lastMs: 0, lastCode: 0, state: 'inconnu', since: Date.now() };

/* ─────────────────────────── notifications Discord (REST, token bot) ───── */
async function discordSay(text) {
  if (!TOKEN || !CHANNEL_ID) return;
  try {
    await fetch(`https://discord.com/api/v10/channels/${CHANNEL_ID}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bot ${TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: text.slice(0, 1900) }),
      signal: AbortSignal.timeout(15000),
    });
  } catch (e) { log('· notification Discord impossible :', e.message); }
}

/* ───────────────────────────────── ping de veille ───────────────────────── */
async function pingSite() {
  stats.pings++;
  const t0 = Date.now();
  let code = 0;
  try {
    const res = await fetch(PING_URL, { method: 'GET', headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(65000) });
    code = res.status;
    await res.arrayBuffer().catch(() => {}); // vider le corps, éviter un socket suspendu
  } catch { code = -1; }
  stats.lastMs = Date.now() - t0;
  stats.lastCode = code;
  const ok = code === 200;
  if (ok) stats.ok++; else stats.fail++;
  const newState = ok ? 'ok' : 'ko';
  log(`ping #${stats.pings} → HTTP ${code} en ${stats.lastMs} ms (ok:${stats.ok} ko:${stats.fail})`);
  if (newState !== stats.state) {
    if (stats.state !== 'inconnu') {
      await discordSay(ok
        ? `:white_check_mark: **DigitalVerse réveillé / rétabli** — ${SITE_URL} répond 200 en ${stats.lastMs} ms (hors ligne pendant ${Math.round((Date.now() - stats.since) / 1000)} s au dernier cycle d'erreur).`
        : `:red_circle: **DigitalVerse ne répond pas** — ${SITE_URL} renvoie HTTP ${code}. Nouvelle tentative dans ${Math.round(PING_MS / 1000)} s.`);
      stats.since = Date.now();
    }
    stats.state = newState;
  }
}

/* ─────────────── micro-serveur /health (utile si déployé en web service) ── */
if (HEALTH_PORT) {
  http.createServer((req, res) => {
    if (req.url === '/health' || req.url === '/') {
      res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' });
      res.end(`digitalvers-keepalive ${stats.state} — pings:${stats.pings} ok:${stats.ok} ko:${stats.fail} dernier:${stats.lastCode} (${stats.lastMs}ms)\n`);
    } else { res.writeHead(404); res.end(); }
  }).listen(HEALTH_PORT, '0.0.0.0', () => log(`serveur /health sur le port ${HEALTH_PORT}`));
}

/* ───────────────────────── présence Discord (gateway, intents 0) ────────── */
let ws = null;
let hbTimer = null;
let lastSeq = null;
let reconnaitre = 1000;
function gatewayConnect() {
  if (!TOKEN) { log('DISCORD_TOKEN absent → mode « pinger seul » (pas de présence en ligne).'); return; }
  try { ws = new WebSocket('wss://gateway.discord.gg/?v=10&encoding=json'); } catch (e) { log('WebSocket indisponible :', e.message); return; }
  ws.onmessage = (ev) => {
    let msg; try { msg = JSON.parse(ev.data); } catch { return; }
    const { op, d, s, t } = msg;
    if (s) lastSeq = s;
    if (op === 10) { // HELLO
      clearInterval(hbTimer);
      const ack = () => ws && ws.readyState === 1 && ws.send(JSON.stringify({ op: 1, d: lastSeq }));
      hbTimer = setInterval(ack, d.heartbeat_interval);
      ack();
      ws.send(JSON.stringify({
        op: 2,
        d: { token: TOKEN, intents: 0, properties: { os: 'linux', browser: 'digitalvers-keepalive', device: 'digitalvers-keepalive' } },
      }));
    } else if (op === 0 && t === 'READY') {
      reconnaitre = 1000;
      log('bot Discord en ligne ✓ (user :', d?.user?.username, ')');
      ws.send(JSON.stringify({ op: 3, d: { status: 'online', since: 0, activities: [{ type: 3, name: 'la veille de digitalvers.onrender.com' }] } }));
    } else if (op === 9 && d === false) {
      log('session gateway invalide → re-identification');
      lastSeq = null;
    } else if (op === 7) {
      log('reconnect demandé par Discord');
      try { ws.close(4000); } catch {}
    }
  };
  ws.onerror = () => {}; // un error est toujours suivi de close : traité là
  ws.onclose = (ev) => {
    clearInterval(hbTimer); hbTimer = null;
    if (ev && (ev.code === 4004 || ev.code === 4014 || ev.code === 4010 || ev.code === 4011 || ev.code === 4012)) {
      log('gateway : Discord refuse cette connexion (code ' + ev.code + ' — token invalide/expiré, intents privilégiés manquants ou version). Réglé sur une nouvelle tentative toutes les 10 min au lieu de spammer.');
      reconnaitre = 600000;
    }
    setTimeout(gatewayConnect, reconnaitre);
    reconnaitre = Math.min(reconnaitre * 2, 60000);
  };
}

/* ───────────────────────────────────────────── démarrage ────────────────── */
log(`veille DigitalVerse — cible ${PING_URL} toutes les ${Math.round(PING_MS / 1000)} s${CHANNEL_ID ? ' · alertes salon ' + CHANNEL_ID : ' · alertes console seulement'}`);
if (!TOKEN) log('ASTUCE : ajoute DISCORD_TOKEN dans bot/.env pour la présence en ligne + les alertes sur un salon.');
pingSite();
setInterval(pingSite, PING_MS);
gatewayConnect();
process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => process.exit(0));
process.on('unhandledRejection', (e) => log('erreur ignorée (volontaire — le bot doit rester vivant) :', e?.message || e));

/* Persistance JSON simple — fichiers dans ./data (créés automatiquement). */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
/* Répertoire des données. En hébergement avec disque persistant (ex. Render
   Disk), définir DATA_DIR vers le point de montage pour ne pas perdre les
   commandes au redéploiement. Sans DATA_DIR : ./data en local. */
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

const DEFAULT_DB = { orders: [], messages: [] };
const DEFAULT_SETTINGS = {
  ai: {
    mode: 'builtin', // 'builtin' | 'api' | 'n8n'
    endpoint: '', // API compatible OpenAI, ex. https://api.openai.com/v1/chat/completions
    model: '',
    apiKey: '',
    n8nUrl: '', // Webhook n8n Chat Trigger, ex. https://votre-n8n/webhook/<id>/chat
    systemPrompt: '',
    updatedAt: null,
  },
};

/* Le démarrage du site ne doit JAMAIS dépendre de l'état du disque :
   si DATA_DIR est momentanément indisponible (montage du disque Render en
   retard après un redéploiement), on démarre quand même — les pages
   répondent 200 (Google ne voit plus de 5xx) et les écritures retenteront
   de créer les fichiers à la première commande. */
function ensure() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2));
    if (!fs.existsSync(SETTINGS_FILE)) fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2));
  } catch (e) {
    console.error('[store] DATA_DIR indisponible (' + DATA_DIR + ') : ' + e.message + ' — le site démarre sans écriture pour le moment.');
  }
}

ensure();

/* Écriture atomique (tmp + rename) : si le conteneur est stoppé en plein
   milieu d'une sauvegarde (mise en veille Render), l'ancien fichier reste
   intact — plus jamais de db.json tronqué donc d'orders perdues. */
function writeFileAtomic(file, content) {
  const tmp = file + '.' + process.pid + '.tmp';
  try {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(tmp, content);
    fs.renameSync(tmp, file);
  } catch (e) {
    try { fs.unlinkSync(tmp); } catch { /* rien à nettoyer */ }
    console.error('[store] écriture impossible sur ' + file + ' : ' + e.message);
    throw e; // on remonte : une commande perdue en silence serait pire qu'une erreur visible
  }
}

/* Fichier corrompu (héritage d'une écriture interrompue) : on le conserve
   en sauvegarde horodatée au lieu de l'écraser — récupération possible. */
function backupCorrupt(file) {
  try { fs.renameSync(file, file + '.corrompu-' + new Date().toISOString().replace(/[:.]/g, '-')); return true; }
  catch { return false; }
}

export function loadDb() {
  let raw;
  try {
    raw = fs.readFileSync(DB_FILE, 'utf8');
  } catch (e) {
    if (e.code === 'ENOENT') return structuredClone(DEFAULT_DB); // disque pas encore prêt
    throw e;
  }
  try {
    const d = JSON.parse(raw);
    return { orders: d.orders || [], messages: d.messages || [] };
  } catch {
    const kept = backupCorrupt(DB_FILE);
    console.error('[store] db.json illisible' + (kept ? ' (sauvegardé en ' + DB_FILE + '.corrompu-*)' : '') + ' — redémarrage sur base vide.');
    return structuredClone(DEFAULT_DB);
  }
}

export function saveDb(db) {
  writeFileAtomic(DB_FILE, JSON.stringify(db, null, 2));
}

export function loadSettings() {
  let raw;
  try {
    raw = fs.readFileSync(SETTINGS_FILE, 'utf8');
  } catch (e) {
    if (e.code === 'ENOENT') return structuredClone(DEFAULT_SETTINGS);
    throw e;
  }
  try {
    const s = JSON.parse(raw);
    return { ai: { ...DEFAULT_SETTINGS.ai, ...(s.ai || {}) } };
  } catch {
    const kept = backupCorrupt(SETTINGS_FILE);
    console.error('[store] settings.json illisible' + (kept ? ' (sauvegardé)' : '') + ' — réglages par défaut.');
    return structuredClone(DEFAULT_SETTINGS);
  }
}

export function saveSettings(s) {
  writeFileAtomic(SETTINGS_FILE, JSON.stringify(s, null, 2));
}

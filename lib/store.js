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

function ensure() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2));
  if (!fs.existsSync(SETTINGS_FILE)) fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2));
}

ensure();

export function loadDb() {
  try {
    const d = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    return { orders: d.orders || [], messages: d.messages || [] };
  } catch {
    return structuredClone(DEFAULT_DB);
  }
}

export function saveDb(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

export function loadSettings() {
  try {
    const s = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
    return { ai: { ...DEFAULT_SETTINGS.ai, ...(s.ai || {}) } };
  } catch {
    return structuredClone(DEFAULT_SETTINGS);
  }
}

export function saveSettings(s) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(s, null, 2));
}

/* =========================================================================
   DIGITALVERSE — serveur Express
   Site vitrine + tunnel de commande + brief IA + espace administrateur.
   Démarrage : npm start   (PORT par défaut : 3000)
   Variables d'environnement :
     PORT            Port d'écoute (défaut 3000)
     ADMIN_PASSWORD  Mot de passe de l'espace administrateur
                     (défaut : « digitalverse-admin » — À CHANGER)
   ========================================================================= */
import express from 'express';
import compression from 'compression';
import fs from 'node:fs';
import cookieParser from 'cookie-parser';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BRAND, PLANS, SERVICES, AVANTAGES, PORTFOLIO, PROCESSUS, FAQ, PRICING_GLOBAL_NOTE, SUBSCRIPTION_CANCELLATION_NOTE, PROJECT_TYPES } from './config/site.config.js';
import { LANDING_PAGES, GUIDES, CASE_PAGES } from './config/landing.config.js';
import { loadDb, saveDb, loadSettings, saveSettings } from './lib/store.js';
import { agentReply, buildBrief, testExternalApi, openingMessage } from './lib/agent.js';
import {
  notifyAdminNewOrder, notifyAdminBriefDone, notifyAdminNewMessage,
  confirmOrderToClient, ackContactToClient,
} from './lib/mailer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.set('trust proxy', 1); // URL publique correcte derrière le proxy (Render…)
const PORT = process.env.PORT || 3000;
/* Double authentification de l'espace admin (2 mots de passe distincts).
   Configurables via les variables d'environnement ADMIN_PASSWORD et
   ADMIN_PASSWORD_2 — définissez-les sur votre hébergeur (Render : onglet
   Environment) plutôt que de garder les valeurs par défaut. */
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'DVenter@ADM';
const ADMIN_PASSWORD_2 = process.env.ADMIN_PASSWORD_2 || 'D.vrs@adsp';

app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});
/* Compression gzip/brotli : indispensable pour le poids du HTML/CSS/JS. */
app.use(compression());

/* Empreinte des fichiers publics : sert à versionner les URL d'assets
   (?v=…) pour pouvoir les cacher longtemps sans jamais servir du périmé. */
const PUBLIC_DIR = path.join(__dirname, 'public');
const ASSET_V = (() => {
  try {
    const h = crypto.createHash('sha1');
    const walk = (d, rel) => {
      for (const e of fs.readdirSync(d, { withFileTypes: true }).sort((x, y) => x.name.localeCompare(y.name))) {
        if (e.isDirectory()) { walk(path.join(d, e.name), rel ? rel + '/' + e.name : e.name); continue; }
        const st = fs.statSync(path.join(d, e.name));
        h.update(rel ? rel + '/' + e.name : e.name).update(String(st.size)).update(String(Math.round(st.mtimeMs)));
      }
    };
    walk(PUBLIC_DIR, '');
    return h.digest('hex').slice(0, 10);
  } catch { return 'dev'; }
})();
app.use((req, res, next) => { res.locals.assetV = ASSET_V; next(); });

app.use(express.json({ limit: '200kb' }));
app.use(express.urlencoded({ extended: true, limit: '200kb' }));
app.use(cookieParser());
app.use(express.static(PUBLIC_DIR, {
  index: false,
  maxAge: '7d', // sûr : toutes les URL d'assets sont versionnées (?v=…)
  setHeaders(res0, filePath) {
    // le fichier de vérification Google doit rester toujours frais
    if (/google[0-9a-f]+\.html$/.test(filePath)) res0.setHeader('Cache-Control', 'public, max-age=300');
  },
}));
/* Zones privées : interdiction stricte même si un lien fuite quelque part. */
app.use((req, res, next) => {
  if (/^\/(admin|chat|api)(\/|$)/.test(req.path)) res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
  next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* ------------------------------------------------------------ outils */
const isEmail = (s) => typeof s === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim()) && s.length < 120;
const isPhone = (s) => typeof s === 'string' && /^\+?[0-9 .\-()]{8,20}$/.test(s.trim());
const clean = (s, max = 500) => (typeof s === 'string' ? s.trim().slice(0, max) : '');
const uid = (n = 12) => crypto.randomBytes(n).toString('hex');

/* URL canonique du site : BRAND.url si configuré, hôte de la requête sinon */
function siteUrl(req) {
  const configured = String(BRAND.url || '').replace(/\/+$/, '');
  return configured || req.protocol + '://' + req.get('host');
}

function jsonForScript(obj) {
  return JSON.stringify(obj).replace(/</g, '\\u003c');
}

/* Petit limiteur de débit en mémoire (anti-abus basique). */
const buckets = new Map();
function rateLimit(max = 120, windowMs = 15 * 60 * 1000) {
  return (req, res, next) => {
    const key = req.ip || 'anon';
    const now = Date.now();
    let b = buckets.get(key);
    if (!b || now - b.t0 > windowMs) { b = { t0: now, n: 0 }; buckets.set(key, b); }
    b.n += 1;
    if (b.n > max) return res.status(429).json({ ok: false, error: 'Trop de requêtes. Réessayez dans quelques minutes.' });
    next();
  };
}

/* ------------------------------------------------------------------ sessions admin
   Double vérification : l'étape 1 délivre un jeton temporaire « pending »
   (10 min) qui autorise l'étape 2 ; seule l'étape 2 crée la vraie session. */
const sessions = new Map(); // token -> expiresAt
const pendingSteps = new Map(); // token -> expiresAt
function createSession() {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, Date.now() + 12 * 60 * 60 * 1000);
  return token;
}
function createPending() {
  const token = crypto.randomBytes(24).toString('hex');
  pendingSteps.set(token, Date.now() + 10 * 60 * 1000);
  return token;
}
function validPending(req) {
  const t = req.cookies?.dv_pending;
  if (!t) return false;
  const exp = pendingSteps.get(t);
  if (!exp || exp < Date.now()) { pendingSteps.delete(t); return false; }
  return true;
}
function validSession(req) {
  const t = req.cookies?.dv_admin;
  if (!t) return false;
  const exp = sessions.get(t);
  if (!exp || exp < Date.now()) { sessions.delete(t); return false; }
  return true;
}
function requireAdmin(req, res, next) {
  if (validSession(req)) return next();
  if (req.path.startsWith('/api/')) return res.status(401).json({ ok: false, error: 'Non authentifié.' });
  return res.redirect('/admin/connexion');
}

/* ------------------------------------------------------------ helpers data */
function getOrder(id) {
  const db = loadDb();
  return { db, order: db.orders.find((o) => o.id === id) };
}
function orderPublic(o) {
  const p = PLANS[o.planSlug] || {};
  return { ...o, planName: p.name || o.planSlug, planPrice: p.price, planUnit: p.unit };
}
function checkOrderKey(req, res, order) {
  const key = req.query.key || req.body?.key;
  if (!order) { res.status(404).json({ ok: false, error: 'Commande introuvable.' }); return false; }
  if (!key || key !== order.accessKey) { res.status(403).json({ ok: false, error: 'Lien invalide.' }); return false; }
  return true;
}

/* Origine publique du site (pour les liens contenus dans les e-mails). */
function siteOrigin(req) {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '');
  return `${req.protocol}://${req.get('host')}`;
}
/* Envois d'e-mails sans bloquer la réponse HTTP, erreurs loguées seulement. */
function fireAndForget(...promises) {
  for (const p of promises) p?.catch?.((e) => console.error('[mail] erreur :', e?.message || e));
}

/* ==================================================================== SITE */
app.get('/', (req, res) => {
  const site = siteUrl(req);
  const seoGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': site + '/#organisation',
        name: BRAND.name,
        url: site,
        logo: site + '/assets/logo-emblem.png',
        description: BRAND.description,
        knowsAbout: [
          'Création de sites web sur mesure',
          'Chatbots IA pour entreprises',
          'Automatisation des processus métier',
          'SEO technique et performance web',
          'Hébergement web et maintenance',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': site + '/#site',
        name: BRAND.name,
        url: site,
        inLanguage: 'fr-FR',
        publisher: { '@id': site + '/#organisation' },
      },
      {
        '@type': 'ProfessionalService',
        '@id': site + '/#agence',
        name: BRAND.name,
        url: site,
        description: BRAND.description,
        areaServed: { '@type': 'Country', name: 'France' },
        knowsLanguage: ['fr-FR'],
        provider: { '@id': site + '/#organisation' },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Offres DigitalVerse',
          itemListElement: Object.values(PLANS).map((pl) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: pl.name, description: pl.tagline },
            price: pl.price,
            priceCurrency: 'EUR',
            category: pl.mode === 'monthly' ? 'Abonnement mensuel' : 'Paiement unique',
          })),
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };
  res.render('index', {
    BRAND, PLANS, SERVICES, AVANTAGES, PORTFOLIO, PROCESSUS, FAQ,
    PRICING_GLOBAL_NOTE, SUBSCRIPTION_CANCELLATION_NOTE, PROJECT_TYPES,
    sent: req.query.envoye === '1',
    jsonLd: jsonForScript(seoGraph),
    page: {
      title: 'DigitalVerse — Agence web, chatbots IA & automatisation',
      description: 'Agence web & IA en Île-de-France : sites sur mesure, chatbots IA et automatisation pour entreprises. Tarifs clairs, commande en ligne, accompagnement complet.',
      path: '/',
    },
  });
});

app.get('/mentions-legales', (req, res) => res.render('mentions-legales', { BRAND, page: { title: 'Mentions légales — DigitalVerse', description: 'Mentions légales de DigitalVerse : éditeur, hébergement, propriété intellectuelle et responsabilités.', path: '/mentions-legales' } }));
app.get('/politique-de-confidentialite', (req, res) => res.render('confidentialite', { BRAND, page: { title: 'Politique de confidentialité — DigitalVerse', description: 'Politique de confidentialité de DigitalVerse : données collectées via les formulaires et la commande, finalités, durées de conservation et vos droits.', path: '/politique-de-confidentialite' } }));

/* ================================================================== COMMANDE */
app.get('/commander', (req, res) => {
  const offre = PLANS[req.query.offre] ? req.query.offre : '';
  const site = siteUrl(req);
  const commanderGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: site + '/' },
          { '@type': 'ListItem', position: 2, name: 'Commander', item: site + '/commander' },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': site + '/commander',
        name: 'Commander une offre — DigitalVerse',
        isPartOf: { '@id': site + '/#site' },
        about: { '@id': site + '/#agence' },
      },
    ],
  };
  res.render('commander', {
    jsonLd: jsonForScript(commanderGraph),
    BRAND, PLANS, SUBSCRIPTION_CANCELLATION_NOTE,
    plansJson: jsonForScript(Object.fromEntries(Object.entries(PLANS).map(([s, p]) => [s, { type: p.type, name: p.name, price: p.price, unit: p.unit, mode: p.mode, tagline: p.tagline, from: !!p.from }]))),
    offre,
    page: { title: 'Commander un site web ou un agent IA en ligne — DigitalVerse', description: 'Commandez en ligne : choisissez votre offre, indiquez vos coordonnées, puis détaillez votre projet à notre assistant IA. Aucun paiement demandé à cette étape.', path: '/commander' },
  });
});

const ORDER_FIELDS = ['type', 'planSlug', 'desiredDate', 'firstName', 'lastName', 'phone', 'email'];
app.post('/api/commande', rateLimit(30), (req, res) => {
  const b = req.body || {};
  const errors = {};
  b.type = b.type === 'agent' ? 'agent' : b.type === 'site' ? 'site' : '';
  if (!b.type) errors.type = 'Choisissez le type de projet (site web ou agent IA).';
  const plan = PLANS[b.planSlug];
  if (!plan) errors.planSlug = 'Choisissez une offre.';
  else if (plan.type !== b.type) errors.planSlug = 'Cette offre ne correspond pas au type de projet choisi.';
  if (!clean(b.desiredDate, 30)) errors.desiredDate = 'Indiquez une échéance souhaitée.';
  else if (Number.isNaN(Date.parse(b.desiredDate))) errors.desiredDate = 'Date invalide.';
  if (clean(b.firstName).length < 2) errors.firstName = 'Prénom requis (2 caractères minimum).';
  if (clean(b.lastName).length < 2) errors.lastName = 'Nom requis (2 caractères minimum).';
  if (!isPhone(b.phone)) errors.phone = 'Numéro de téléphone invalide.';
  if (!isEmail(b.email)) errors.email = 'Adresse e-mail invalide.';
  if (b.consent !== true && b.consent !== 'true' && b.consent !== 'on') errors.consent = 'Votre consentement est nécessaire pour traiter votre demande.';
  if (Object.keys(errors).length) return res.status(400).json({ ok: false, errors });

  const db = loadDb();
  const order = {
    id: 'DV-' + Date.now().toString(36).toUpperCase() + '-' + uid(3).toUpperCase(),
    accessKey: uid(16),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: b.type,
    planSlug: b.planSlug,
    desiredDate: clean(b.desiredDate, 30),
    comment: clean(b.comment, 800),
    client: {
      firstName: clean(b.firstName, 60),
      lastName: clean(b.lastName, 60),
      phone: clean(b.phone, 30),
      email: clean(b.email, 120),
    },
    status: 'nouveau',
    chat: [],
    agentState: null,
    brief: null,
    livraison: null,
    adminNotes: '',
  };
  order.chat.push({ role: 'assistant', text: openingMessage(order), at: new Date().toISOString() });
  order.agentState = { asked: [], covered: [] };
  db.orders.unshift(order);
  saveDb(db);
  fireAndForget(
    notifyAdminNewOrder(order, siteOrigin(req)),
    confirmOrderToClient(order, siteOrigin(req))
  );
  res.json({ ok: true, redirect: `/chat/${order.id}?key=${order.accessKey}` });
});

/* ===================================================================== CHAT */
app.get('/chat/:id', (req, res) => {
  const { order } = getOrder(req.params.id);
  if (!order) return res.status(404).render('404', { BRAND, page: { title: 'Page introuvable — DigitalVerse', robots: 'noindex, nofollow' } });
  if (req.query.key !== order.accessKey) return res.status(403).render('404', { BRAND, page: { title: 'Lien invalide — DigitalVerse', robots: 'noindex, nofollow' }, invalidLink: true });
  const plan = PLANS[order.planSlug];
  res.render('chat', {
    BRAND,
    order: orderPublic(order),
    orderJson: jsonForScript({ id: order.id, key: order.accessKey, chat: order.chat, brief: order.brief, status: order.status, livraison: order.livraison }),
    plan,
    page: { title: 'Votre brief — DigitalVerse', description: 'Décrivez votre projet à l’assistant de brief DigitalVerse.', robots: 'noindex, nofollow' },
  });
});

app.post('/api/chat/:id/message', rateLimit(90), async (req, res) => {
  const { db, order } = getOrder(req.params.id);
  if (!checkOrderKey(req, res, order)) return;
  if (order.status === 'brief_termine' || order.brief) {
    return res.json({ ok: true, closed: true, reply: 'Votre brief a déjà été transmis à DigitalVerse. Nous revenons vers vous rapidement par e-mail ou téléphone.', progress: null, canConclude: false });
  }
  const text = clean(req.body?.text, 1500);
  if (!text) return res.status(400).json({ ok: false, error: 'Message vide.' });
  if (order.status === 'nouveau') order.status = 'brief';
  order.chat.push({ role: 'user', text, at: new Date().toISOString() });
  const settings = loadSettings();
  const r = await agentReply(order, settings);
  if (r.apiError) console.error(`[brief IA] repli intégré pour ${order.id} — moteur ${settings.ai.mode} :`, r.apiError);
  order.agentState = r.state;
  order.chat.push({ role: 'assistant', text: r.text, at: new Date().toISOString() });
  order.updatedAt = new Date().toISOString();
  saveDb(db);
  res.json({ ok: true, reply: r.text, progress: r.progress, canConclude: r.canConclude || false, apiError: r.apiError || null });
});

app.post('/api/chat/:id/terminer', rateLimit(30), async (req, res) => {
  const { db, order } = getOrder(req.params.id);
  if (!checkOrderKey(req, res, order)) return;
  const userCount = order.chat.filter((m) => m.role === 'user').length;
  if (userCount === 0) return res.status(400).json({ ok: false, error: 'Décrivez d’abord votre projet à l’assistant.' });
  if (!order.brief) {
    order.brief = buildBrief(order);
    order.status = 'brief_termine';
    order.chat.push({
      role: 'assistant',
      text: 'Votre brief est prêt et vient d’être transmis à DigitalVerse. Nous étudions votre demande (avec la vérification de compatibilité ci-dessous) et revenons vers vous pour confirmer la suite. Merci pour votre confiance !',
      at: new Date().toISOString(),
    });
    order.updatedAt = new Date().toISOString();
    saveDb(db);
    fireAndForget(notifyAdminBriefDone(order, siteOrigin(req)));
  }
  res.json({ ok: true, brief: order.brief, status: order.status });
});

app.get('/api/chat/:id/statut', (req, res) => {
  const { order } = getOrder(req.params.id);
  if (!checkOrderKey(req, res, order)) return;
  res.json({ ok: true, status: order.status, livraison: order.livraison || null });
});

/* ================================================================== CONTACT */
app.post('/api/contact', rateLimit(20), (req, res) => {
  const b = req.body || {};
  const errors = {};
  if (clean(b.name).length < 2) errors.name = 'Votre nom est requis.';
  if (!isEmail(b.email)) errors.email = 'Adresse e-mail invalide.';
  if (clean(b.message, 2000).length < 10) errors.message = 'Décrivez votre projet en quelques mots (10 caractères minimum).';
  if (b.consent !== true && b.consent !== 'true') errors.consent = 'Votre consentement est nécessaire.';
  if (Object.keys(errors).length) return res.status(400).json({ ok: false, errors });
  const db = loadDb();
  const msg = {
    id: 'MSG-' + uid(6).toUpperCase(),
    createdAt: new Date().toISOString(),
    name: clean(b.name, 80),
    company: clean(b.company, 80),
    email: clean(b.email, 120),
    projectType: clean(b.projectType, 80),
    budget: clean(b.budget, 40),
    message: clean(b.message, 2000),
    read: false,
  };
  db.messages.unshift(msg);
  saveDb(db);
  fireAndForget(
    notifyAdminNewMessage(msg, siteOrigin(req)),
    ackContactToClient(msg)
  );
  res.json({ ok: true });
});

/* ===================================== PAGES SEO — offres détaillées, guides, concepts */
function fmtFr(iso) {
  const d = new Date(iso + 'T12:00:00Z');
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Paris' });
}
const GUIDE_BY_SLUG = new Map(GUIDES.map((g) => [g.slug, g]));
const CASE_BY_SLUG = new Map(CASE_PAGES.map((c) => [c.slug, c]));
const orgNode = (site) => ({ '@type': 'Organization', '@id': site + '/#organisation', name: BRAND.name, url: site });
const crumbNode = (site, items) => ({ '@type': 'BreadcrumbList', itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: site + it.path })) });
const faqNode = (list) => (list && list.length ? { '@type': 'FAQPage', mainEntity: list.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) } : null);
const offerNodes = (site, slugs) => ({ '@type': 'OfferCatalog', name: 'Offres DigitalVerse', itemListElement: slugs.map((slug) => { const pl = PLANS[slug]; return { '@type': 'Offer', itemOffered: { '@type': 'Service', name: pl.name, description: pl.tagline }, price: pl.price, priceCurrency: 'EUR', category: pl.mode === 'monthly' ? 'Abonnement mensuel' : 'Paiement unique', url: site + '/commander?offre=' + slug }; }) });

LANDING_PAGES.forEach((lp) => {
  app.get(lp.path, (req, res) => {
    const site = siteUrl(req);
    const faqAll = [...lp.faqGlobal.map((i) => FAQ[i]), ...(lp.faq || [])];
    res.render('offre', {
      BRAND, PLANS, PROCESSUS, PRICING_GLOBAL_NOTE, SUBSCRIPTION_CANCELLATION_NOTE,
      lp, faqAll,
      jsonLd: jsonForScript({ '@context': 'https://schema.org', '@graph': [
        crumbNode(site, [{ name: 'Accueil', path: '/' }, { name: lp.nav, path: lp.path }]),
        orgNode(site),
        { '@type': 'Service', '@id': site + lp.path + '#service', name: lp.serviceName, serviceType: lp.serviceType, description: lp.metaDescription, url: site + lp.path, areaServed: { '@type': 'Country', name: 'France' }, provider: { '@id': site + '/#organisation' }, hasOfferCatalog: offerNodes(site, lp.plans) },
        faqNode(faqAll),
      ].filter(Boolean) }),
      page: { title: lp.title, description: lp.metaDescription, path: lp.path },
    });
  });
});

app.get('/guides', (req, res) => {
  const site = siteUrl(req);
  res.render('guides', {
    BRAND, GUIDES,
    jsonLd: jsonForScript({ '@context': 'https://schema.org', '@graph': [
      crumbNode(site, [{ name: 'Accueil', path: '/' }, { name: 'Guides', path: '/guides' }]),
      { '@type': 'CollectionPage', '@id': site + '/guides', name: 'Guides DigitalVerse', description: 'Guides pratiques : prix d’un site, choix d’une agence web, IA et automatisation pour les PME.', isPartOf: { '@id': site + '/#site' }, mainEntity: { '@type': 'ItemList', itemListElement: GUIDES.map((g, i) => ({ '@type': 'ListItem', position: i + 1, url: site + '/guides/' + g.slug, name: g.title })) } },
    ] }),
    page: { title: 'Guides : site internet, agence web et IA pour PME — DigitalVerse', description: 'Les guides DigitalVerse : ce que coûte vraiment un site, quelles questions poser avant de signer, comment démarrer un projet IA. Notre propre grille tarifaire y figure — la transparence commence là.', path: '/guides' },
  });
});

app.get('/guides/:slug', (req, res) => {
  const g = GUIDE_BY_SLUG.get(req.params.slug);
  if (!g) return res.status(404).render('404', { BRAND, page: { title: 'Page introuvable — DigitalVerse', robots: 'noindex, nofollow' } });
  const site = siteUrl(req);
  res.render('guide', {
    BRAND, g, fmtFr,
    jsonLd: jsonForScript({ '@context': 'https://schema.org', '@graph': [
      crumbNode(site, [{ name: 'Accueil', path: '/' }, { name: 'Guides', path: '/guides' }, { name: g.title, path: '/guides/' + g.slug }]),
      orgNode(site),
      { '@type': 'Article', '@id': site + '/guides/' + g.slug + '#article', headline: g.title, description: g.metaDescription, inLanguage: 'fr-FR', datePublished: g.date, dateModified: g.date, image: site + '/assets/og-image.jpg', author: { '@id': site + '/#organisation' }, publisher: { '@id': site + '/#organisation' }, mainEntityOfPage: { '@type': 'WebPage', '@id': site + '/guides/' + g.slug } },
    ] }),
    page: { title: g.title, description: g.metaDescription, path: '/guides/' + g.slug, ogType: 'article' },
  });
});

app.get('/realisations/:slug', (req, res) => {
  const c = CASE_BY_SLUG.get(req.params.slug);
  const work = PORTFOLIO.find((x) => x.slug === req.params.slug);
  if (!c || !work) return res.status(404).render('404', { BRAND, page: { title: 'Page introuvable — DigitalVerse', robots: 'noindex, nofollow' } });
  const site = siteUrl(req);
  res.render('concept', {
    BRAND, PLANS, work, c, PRICING_GLOBAL_NOTE, fmtFr,
    jsonLd: jsonForScript({ '@context': 'https://schema.org', '@graph': [
      crumbNode(site, [{ name: 'Accueil', path: '/' }, { name: 'Réalisations', path: '/#realisations' }, { name: work.name, path: '/realisations/' + work.slug }]),
      orgNode(site),
      { '@type': 'CreativeWork', '@id': site + '/realisations/' + work.slug + '#concept', name: work.name, alternateName: work.category, description: c.metaDescription, image: site + work.image, creator: { '@id': site + '/#organisation' }, keywords: 'projet concept, démonstration d’agence' },
      faqNode(c.faq),
    ].filter(Boolean) }),
    page: { title: c.title, description: c.metaDescription, path: '/realisations/' + c.slug },
  });
});

/* ============================================================== SEO — ROBOTS/SITEMAP */
app.get('/robots.txt', (req, res) => {
  const site = siteUrl(req);
  res.type('text/plain').send([
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /chat',
    'Disallow: /api',
    '',
    'Sitemap: ' + site + '/sitemap.xml',
    '',
  ].join('\n'));
});
app.get('/sitemap.xml', (req, res) => {
  const site = siteUrl(req);
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    { p: '/', pr: '1.0', freq: 'weekly' },
    { p: '/commander', pr: '0.9', freq: 'monthly' },
    ...LANDING_PAGES.map((l) => ({ p: l.path, pr: '0.8', freq: 'monthly' })),
    { p: '/guides', pr: '0.7', freq: 'monthly' },
    ...GUIDES.map((g) => ({ p: '/guides/' + g.slug, pr: '0.6', freq: 'yearly', mod: g.date })),
    ...CASE_PAGES.map((c) => ({ p: '/realisations/' + c.slug, pr: '0.5', freq: 'yearly' })),
    { p: '/mentions-legales', pr: '0.3', freq: 'yearly' },
    { p: '/politique-de-confidentialite', pr: '0.3', freq: 'yearly' },
  ];
  const body = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + urls.map((u) => '  <url><loc>' + site + u.p + '</loc><lastmod>' + (u.mod || today) + '</lastmod><changefreq>' + u.freq + '</changefreq><priority>' + u.pr + '</priority></url>').join('\n')
    + '\n</urlset>\n';
  res.type('application/xml').send(body);
});

/* ==================================================================== ADMIN */
app.get('/admin/connexion', (req, res) => {
  if (validSession(req)) return res.redirect('/admin');
  if (validPending(req)) return res.redirect('/admin/connexion/etape-2');
  res.render('admin/login', { BRAND, step: 1, error: req.query.erreur === '1', page: { title: 'Connexion — Espace DigitalVerse', robots: 'noindex, nofollow' } });
});
app.post('/admin/connexion', rateLimit(15), (req, res) => {
  const pwd = req.body?.password || '';
  if (pwd && pwd === ADMIN_PASSWORD) {
    const token = createPending();
    res.cookie('dv_pending', token, { httpOnly: true, sameSite: 'lax', maxAge: 10 * 60 * 1000 });
    return res.redirect('/admin/connexion/etape-2');
  }
  return res.redirect('/admin/connexion?erreur=1');
});
app.get('/admin/connexion/etape-2', (req, res) => {
  if (validSession(req)) return res.redirect('/admin');
  if (!validPending(req)) return res.redirect('/admin/connexion');
  res.render('admin/login', { BRAND, step: 2, error: req.query.erreur === '1', page: { title: 'Vérification 2/2 — Espace DigitalVerse', robots: 'noindex, nofollow' } });
});
app.post('/admin/connexion/etape-2', rateLimit(15), (req, res) => {
  if (!validPending(req)) return res.redirect('/admin/connexion');
  const pwd = req.body?.password || '';
  if (pwd && pwd === ADMIN_PASSWORD_2) {
    pendingSteps.delete(req.cookies?.dv_pending);
    res.clearCookie('dv_pending');
    const token = createSession();
    res.cookie('dv_admin', token, { httpOnly: true, sameSite: 'lax', maxAge: 12 * 60 * 60 * 1000 });
    return res.redirect('/admin');
  }
  return res.redirect('/admin/connexion/etape-2?erreur=1');
});
app.get('/admin/deconnexion', (req, res) => {
  sessions.delete(req.cookies?.dv_admin);
  pendingSteps.delete(req.cookies?.dv_pending);
  res.clearCookie('dv_admin');
  res.clearCookie('dv_pending');
  res.redirect('/admin/connexion');
});

app.get('/admin', requireAdmin, (req, res) => {
  const settings = loadSettings();
  res.render('admin/dashboard', {
    BRAND,
    page: { title: 'Espace administrateur — DigitalVerse', robots: 'noindex, nofollow' },
    ai: {
      mode: settings.ai.mode,
      endpoint: settings.ai.endpoint,
      model: settings.ai.model,
      n8nUrl: settings.ai.n8nUrl || '',
      hasKey: Boolean(settings.ai.apiKey),
      keyPreview: settings.ai.apiKey ? '••••••••' + settings.ai.apiKey.slice(-4) : '',
      systemPrompt: settings.ai.systemPrompt,
      updatedAt: settings.ai.updatedAt,
    },
  });
});

app.get('/admin/commandes/:id', requireAdmin, (req, res) => {
  const { order } = getOrder(req.params.id);
  if (!order) return res.status(404).render('404', { BRAND, page: { title: 'Commande introuvable — DigitalVerse', robots: 'noindex, nofollow' } });
  res.render('admin/order', { BRAND, order: orderPublic(order), plan: PLANS[order.planSlug], page: { title: `Commande ${order.id} — DigitalVerse`, robots: 'noindex, nofollow' } });
});

/* ------- API admin (JSON, utilisée par le tableau de bord auto-actualisé) */
app.get('/api/admin/commandes', requireAdmin, (req, res) => {
  const db = loadDb();
  res.json({ ok: true, at: new Date().toISOString(), orders: db.orders.map(orderPublic) });
});
app.get('/api/admin/messages', requireAdmin, (req, res) => {
  const db = loadDb();
  res.json({ ok: true, messages: db.messages });
});
app.post('/api/admin/messages/:id/lu', requireAdmin, (req, res) => {
  const db = loadDb();
  const m = db.messages.find((x) => x.id === req.params.id);
  if (m) { m.read = true; saveDb(db); }
  res.json({ ok: true });
});
app.post('/api/admin/commandes/:id', requireAdmin, (req, res) => {
  const { db, order } = getOrder(req.params.id);
  if (!order) return res.status(404).json({ ok: false, error: 'Commande introuvable.' });
  const b = req.body || {};
  const STATUTS = ['nouveau', 'brief', 'brief_termine', 'confirmee', 'prete', 'archivee'];
  if (b.status && STATUTS.includes(b.status)) order.status = b.status;
  if (typeof b.livraisonUrl === 'string') {
    order.livraison = { url: clean(b.livraisonUrl, 400), note: clean(b.livraisonNote, 400) };
  }
  if (typeof b.adminNotes === 'string') order.adminNotes = clean(b.adminNotes, 1000);
  if (typeof b.paye === 'boolean') {
    order.paye = b.paye;
    if (b.paye) {
      order.montantReel = typeof b.montantReel === 'number' && b.montantReel > 0 ? b.montantReel : (order.montantReel || order.planPrice || 0);
      order.datePaiement = new Date().toISOString();
    } else {
      order.montantReel = null;
      order.datePaiement = null;
    }
  }
  order.updatedAt = new Date().toISOString();
  saveDb(db);
  res.json({ ok: true, order: orderPublic(order) });
});

/* Marquer / dé-marquer une vente comme accomplie (payée). Données réelles : le montant
   est celui de l'offre, sauf si le montant réel saisi est différent. */
app.post('/api/admin/commandes/:id/paye', requireAdmin, (req, res) => {
  const { db, order } = getOrder(req.params.id);
  if (!order) return res.status(404).json({ ok: false, error: 'Commande introuvable.' });
  const b = req.body || {};
  const paye = b.paye === true;
  order.paye = paye;
  if (paye) {
    order.montantReel = typeof b.montantReel === 'number' && b.montantReel > 0 ? b.montantReel : (order.montantReel || order.planPrice || 0);
    order.datePaiement = new Date().toISOString();
  } else {
    order.montantReel = null;
    order.datePaiement = null;
  }
  order.updatedAt = new Date().toISOString();
  saveDb(db);
  res.json({ ok: true, order: orderPublic(order) });
});

/* Statistiques réelles du chiffre d’affaires (basées sur les commandes payées). */
app.get('/api/admin/stats', requireAdmin, (req, res) => {
  const db = loadDb();
  const now = new Date();
  const mois = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    mois.push({ key: d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'), label: d.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }), ca: 0 });
  }
  const moisMap = new Map(mois.map((m) => [m.key, m]));
  let caTotal = 0;
  let nbPaye = 0;
  let nbEnAttente = 0;
  const orders = db.orders.map(orderPublic);
  for (const o of orders) {
    const prix = typeof o.montantReel === 'number' && o.montantReel > 0 ? o.montantReel : (o.planPrice || 0);
    if (o.paye) {
      caTotal += prix;
      nbPaye += 1;
      const key = (o.datePaiement || o.createdAt).slice(0, 7).replace('/', '-');
      const m = moisMap.get(key);
      if (m) m.ca += prix;
    } else if (!['archivee'].includes(o.status)) {
      nbEnAttente += 1;
    }
  }
  const panierMoyen = nbPaye ? caTotal / nbPaye : 0;
  /* Ventilation du CA par type de projet : site web ou agent IA */
  const parType = { site: { ca: 0, nb: 0, label: 'Sites web' }, agent: { ca: 0, nb: 0, label: 'Agents IA' } };
  for (const o of orders) {
    if (!o.paye) continue;
    const prix = typeof o.montantReel === 'number' && o.montantReel > 0 ? o.montantReel : (o.planPrice || 0);
    const t = o.type === 'agent' ? 'agent' : 'site';
    parType[t].ca += prix;
    parType[t].nb += 1;
  }
  /* Tarifs publics des offres Agents IA (source : config/site.config.js) */
  const tarifsAgents = Object.entries(PLANS)
    .filter(([, p]) => p.type === 'agent')
    .map(([slug, p]) => ({ slug, name: p.name, price: p.price, unit: p.unit, from: !!p.from }));
  res.json({ ok: true, caTotal, nbPaye, nbEnAttente, panierMoyen, parMois: mois, parType, tarifsAgents });
});
app.post('/api/admin/settings', requireAdmin, (req, res) => {
  const b = req.body || {};
  const s = loadSettings();
  s.ai.mode = ['api', 'n8n', 'builtin'].includes(b.mode) ? b.mode : 'builtin';
  s.ai.endpoint = clean(b.endpoint, 300);
  s.ai.model = clean(b.model, 120);
  s.ai.n8nUrl = clean(b.n8nUrl, 300);
  if (typeof b.apiKey === 'string' && b.apiKey.trim()) s.ai.apiKey = b.apiKey.trim().slice(0, 200);
  if (b.clearKey === true) s.ai.apiKey = '';
  s.ai.systemPrompt = clean(b.systemPrompt, 4000);
  s.ai.updatedAt = new Date().toISOString();
  saveSettings(s);
  res.json({ ok: true });
});
app.post('/api/admin/settings/test', requireAdmin, async (req, res) => {
  const s = loadSettings();
  const r = await testExternalApi(s.ai);
  res.json({ ok: r.ok, reply: r.reply || null, error: r.error || null });
});

/* ================================================================= divers */
app.use((req, res) => res.status(404).render('404', { BRAND, page: { title: 'Page introuvable — DigitalVerse', robots: 'noindex, nofollow' } }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('404', { BRAND, page: { title: 'Erreur — DigitalVerse', robots: 'noindex, nofollow' }, serverError: true });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`DigitalVerse — http://0.0.0.0:${PORT}`);
  console.log(`Espace admin : /admin (double vérification — ADMIN_PASSWORD + ADMIN_PASSWORD_2)`);
});

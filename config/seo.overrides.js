/* =========================================================================
   SEO — titres (<= 60 car.) et meta descriptions (<= 155 car.) optimisés,
   appliqués au démarrage sur LANDING_PAGES et GUIDES, + contenu llms.txt.
   ========================================================================= */
import { EXTRA_GUIDES } from './content.extra.js';
import { EXTRA_GUIDES_2 } from './content.extra2.js';
import { EXTRA_GUIDES_3 } from './content.extra3.js';

export const LANDING_SEO = {
  '/creation-site-internet': {
    title: 'Création de site internet pour entreprise | DigitalVerse',
    metaDescription: 'Site vitrine ou d’activité sur mesure : design responsive, formulaire de contact, SEO de base, mise en ligne incluse. Devis clair avant engagement.',
  },
  '/refonte-site-internet': {
    title: 'Refonte de site internet pour entreprise | DigitalVerse',
    metaDescription: 'Site vieillissant, lent ou peu convaincant ? Refonte sur mesure : contenus repris, design moderne, périmètre écrit avant tout engagement.',
  },
  '/chatbot-ia-entreprise': {
    title: 'Chatbot IA pour votre entreprise | DigitalVerse',
    metaDescription: 'Un assistant IA sur votre site qui répond aux questions courantes et oriente vos visiteurs. Configuration incluse, périmètre défini par contrat.',
  },
  '/automatisation-ia': {
    title: 'Automatisation IA des tâches d’entreprise | DigitalVerse',
    metaDescription: 'Relances, saisie, synthèses : des scénarios d’automatisation connectés à vos outils, périmètre écrit et suivi technique inclus. Sur mesure.',
  },
  '/maintenance-site-internet': {
    title: 'Maintenance de site internet, périmètre écrit | DigitalVerse',
    metaDescription: 'Mises à jour, sauvegardes, corrections et assistance. Deux formules selon la criticité, périmètre défini par contrat, annulation affichée.',
  },
};

export const GUIDE_SEO = {
  'prix-site-internet': {
    title: 'Combien coûte un site internet en 2026 ? Grille honnête',
    metaDescription: 'Vitrine, activité, maintenance, IA : ce que couvre chaque poste d’un devis web et les questions à poser avant de signer. Exemple chiffré.',
  },
  'choisir-agence-web': {
    title: 'Agence web : les 8 questions à poser avant de signer',
    metaDescription: 'Prix, propriété du site, maintenance, engagement, promesses SEO : la check-list pour distinguer une vraie agence d’un vendeur de gabarits.',
  },
  'chatbot-ia-pme': {
    title: 'Chatbot IA pour PME : par où commencer (guide)',
    metaDescription: 'Ce qu’un assistant IA fait vraiment, ce qu’on ne doit pas vous promettre, comment préparer son brief. Mode d’emploi honnête, tarifs inclus.',
  },
};

export const PAGE_SEO = {
  home: {
    title: 'DigitalVerse, agence web, chatbots IA et automatisation',
    description: 'Agence web et IA en Île-de-France : sites sur mesure, chatbots IA et automatisation pour entreprises. Tarifs clairs, commande en ligne.',
  },
  guides: {
    title: 'Guides site internet, agence web et IA | DigitalVerse',
    description: 'Ce que coûte vraiment un site, les questions à poser avant de signer, comment démarrer un projet IA. Notre grille tarifaire y figure.',
  },
  commander: {
    title: 'Commander un site web ou un agent IA | DigitalVerse',
    description: 'Commandez en ligne : choisissez votre offre, indiquez vos coordonnées, détaillez votre projet à notre assistant IA. Aucun paiement à cette étape.',
  },
};

export function applySeoOverrides(LANDING_PAGES, GUIDES) {
  /* Articles de fond et pages ville (config/content.extra*.js) */
  for (const extra of [...EXTRA_GUIDES, ...EXTRA_GUIDES_2, ...EXTRA_GUIDES_3]) {
    if (!GUIDES.some((g) => g.slug === extra.slug)) GUIDES.push(extra);
  }
  for (const lp of LANDING_PAGES) {
    const o = LANDING_SEO[lp.path];
    if (o) { lp.title = o.title; lp.metaDescription = o.metaDescription; }
  }
  for (const g of GUIDES) {
    const o = GUIDE_SEO[g.slug];
    if (o) { g.title = o.title; g.metaDescription = o.metaDescription; }
  }
}

export function buildLlmsTxt(site, LANDING_PAGES, GUIDES) {
  const lines = [
    '# DigitalVerse',
    '',
    '> Agence web et IA en Île-de-France : création et refonte de sites internet sur mesure, chatbots IA et automatisation des tâches pour les entreprises. Tarifs publics, périmètre écrit avant tout engagement.',
    '',
    '## Services',
    ...LANDING_PAGES.map((l) => '- [' + l.nav + '](' + site + l.path + ') : ' + l.metaDescription),
    '',
    '## Guides',
    ...GUIDES.filter((g) => !g.ville).map((g) => '- [' + g.title + '](' + site + '/guides/' + g.slug + ') : ' + g.metaDescription),
    '',
    '## Création de site par ville',
    ...GUIDES.filter((g) => g.ville).map((g) => '- [' + g.title + '](' + site + '/guides/' + g.slug + ') : ' + g.metaDescription),
    '',
    '## Contact et commande',
    '- [Commander en ligne](' + site + '/commander) : choix de l’offre puis brief avec un assistant IA, sans paiement à cette étape.',
    '- [Contact](' + site + '/#contact) : formulaire de contact.',
    '',
  ];
  return lines.join('\n');
}

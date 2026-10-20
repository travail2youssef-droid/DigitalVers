/* =========================================================================
   CONFIGURATION CENTRALISÉE — DIGITALVERSE
   Tous les contenus métier et tarifs du site sont définis ici.
   Modifiez ce fichier pour mettre à jour le site sans toucher au code.
   ========================================================================= */

export const BRAND = {
  name: 'DigitalVerse',
  tagline: 'Websites / AI / Automation',
  label: 'Agence digitale — Web & IA',
  sloganA: 'Construisez plus qu’un site.',
  sloganB: 'Construisez votre avenir.',
  intro:
    'DigitalVerse conçoit des sites web sur mesure et des solutions intelligentes pour aider les entreprises à se développer, gagner en efficacité et se démarquer.',
  description:
    'DigitalVerse est une agence digitale spécialisée dans la création de sites web sur mesure et l’intégration de solutions d’intelligence artificielle pour les entreprises.',
  url: 'https://digitalverse.fr', // à remplacer par le domaine réel en production
};

/* -------------------------------------------------------------------------
   OFFRES & TARIFS — source unique de vérité pour les prix affichés sur le
   site, le formulaire de commande et l’espace administrateur.
   - type : 'site' | 'agent'
   - unit : libellé de facturation affiché
   - mode : 'one_shot' | 'monthly'
   ------------------------------------------------------------------------- */
export const PLANS = {
  'vitrine-starter': {
    type: 'site',
    mode: 'one_shot',
    name: 'Vitrine Starter',
    price: 300,
    unit: 'paiement unique',
    tagline: 'Une présence professionnelle en ligne pour présenter votre activité.',
    features: [
      'Site vitrine (présentation de votre activité)',
      'Design personnalisé selon le périmètre défini au devis',
      'Site responsive : ordinateur, tablette et mobile',
      'Formulaire de contact',
      'Optimisation SEO de base (titres, descriptions, structure)',
      'Mise en ligne initiale',
    ],
    note: 'Hébergement, nom de domaine, maintenance et fonctionnalités supplémentaires : à préciser dans le devis.',
    cta: 'Choisir Vitrine Starter',
    recommended: false,
  },
  'vitrine-care': {
    type: 'site',
    mode: 'monthly',
    name: 'Vitrine Care',
    price: 60,
    unit: '/mois',
    tagline: 'Un suivi technique régulier pour maintenir votre site en bon état de fonctionnement.',
    features: [
      'Maintenance technique du site',
      'Mises à jour logicielles compatibles',
      'Sauvegardes lorsque l’hébergement le permet',
      'Corrections de bugs dans le périmètre convenu',
      'Assistance technique',
      'Périmètre de maintenance défini par écrit au contrat',
    ],
    note: 'Offre de maintenance : la création du site n’est pas incluse. Sans engagement annoncé — conditions précisées au contrat.',
    cta: 'Choisir Vitrine Care',
    recommended: false,
  },
  'business-fonctionnel': {
    type: 'site',
    mode: 'one_shot',
    name: 'Business Fonctionnel',
    price: 600,
    unit: 'paiement unique',
    tagline: 'Un site plus complet, avec des fonctionnalités adaptées à votre activité.',
    features: [
      'Tout le périmètre d’un site vitrine complet',
      'Fonctionnalités supplémentaires définies ensemble en amont',
      'Formulaires avancés ou prise de rendez-vous simple le cas échéant',
      'Tests complets et mise en ligne',
    ],
    note: 'Intégrations complexes, paiement en ligne, portails clients et fonctionnalités IA sur mesure : devis spécifique, sauf mention explicite.',
    cta: 'Choisir Business Fonctionnel',
    recommended: true,
  },
  'business-care': {
    type: 'site',
    mode: 'monthly',
    name: 'Business Care',
    price: 200,
    unit: '/mois',
    tagline: 'Un accompagnement technique continu pour un site plus complet.',
    features: [
      'Maintenance du site fonctionnel convenu',
      'Assistance technique',
      'Corrections de bugs dans le périmètre du contrat',
      'Mises à jour compatibles et sauvegardes lorsque supportées',
      'Enveloppe de petites modifications si prévue au contrat final',
    ],
    note: 'Offre de maintenance : la création du site n’est pas incluse. Périmètre précis défini au contrat.',
    cta: 'Choisir Business Care',
    recommended: false,
  },
  'chatbot-ia': {
    type: 'agent',
    mode: 'monthly',
    name: 'Chatbot IA',
    price: 40,
    unit: '/mois',
    tagline: 'Un assistant conversationnel IA pour répondre à vos visiteurs et clients.',
    features: [
      'Chatbot IA entraîné sur vos informations (FAQ, services, tarifs)',
      'Intégration sur votre site web',
      'Réponses instantanées en français, 24h/24',
      'Personnalisation du ton et des réponses',
      'Ajustements du périmètre convenu',
    ],
    note: 'Frais d’usage des modèles IA tiers éventuels : précisés au devis. Nombre de conversations et périmètre définis au contrat — pas d’usage « illimité » implicite.',
    cta: 'Choisir Chatbot IA',
    recommended: false,
  },
  'automatisation-ia': {
    type: 'agent',
    mode: 'monthly',
    name: 'Automatisation personnalisée',
    price: 100,
    unit: '/mois',
    tagline: 'Des automatisations IA sur mesure, connectées à vos outils.',
    features: [
      'Scénarios d’automatisation adaptés à vos processus',
      'Connexion à vos outils existants (emails, CRM, agendas… selon compatibilité)',
      'Qualification de demandes, relances, traitement de documents…',
      'Supervision et ajustements du périmètre convenu',
    ],
    note: 'Intégrations complexes, licences tierces et coûts d’API externes : devis spécifique. Périmètre défini au contrat.',
    cta: 'Choisir Automatisation personnalisée',
    recommended: true,
  },
};

/* -------------------------------------------------------------------------
   SERVICES
   ------------------------------------------------------------------------- */
export const SERVICES = [
  {
    icon: 'code',
    title: 'Création de sites web',
    text: 'Des sites modernes, rapides et sur mesure, conçus pour valoriser votre entreprise et convertir vos visiteurs.',
  },
  {
    icon: 'brain',
    title: 'Solutions IA',
    text: 'Des solutions intelligentes adaptées à vos besoins pour améliorer l’expérience client et optimiser vos opérations.',
  },
  {
    icon: 'bolt',
    title: 'Automatisation',
    text: 'Automatisez certaines tâches répétitives pour gagner du temps et améliorer votre efficacité.',
  },
];

export const AVANTAGES = [
  {
    icon: 'pen',
    title: 'Design soigné et professionnel',
    text: 'Chaque interface est pensée dans les moindres détails pour inspirer confiance et refléter votre image.',
  },
  {
    icon: 'target',
    title: 'Solutions adaptées aux besoins réels',
    text: 'Pas de superflu : nous construisons des réponses concrètes à vos objectifs, au juste périmètre.',
  },
  {
    icon: 'devices',
    title: 'Expérience fluide sur tous les appareils',
    text: 'Ordinateur, tablette ou mobile : votre site reste rapide, lisible et agréable à utiliser.',
  },
  {
    icon: 'shield',
    title: 'Accompagnement technique transparent',
    text: 'Des périmètres écrits, des tarifs clairs et un interlocuteur disponible, avant comme après la mise en ligne.',
  },
];

/* -------------------------------------------------------------------------
   PORTFOLIO — projets CONCEPTS (démonstrations), pas des clients réels.
   Remplacez par de vraies réalisations dès qu’elles sont disponibles.
   ------------------------------------------------------------------------- */
export const PORTFOLIO = [
  {
    slug: 'maison-velora',
    name: 'Maison Vélora',
    kind: 'Projet concept',
    category: 'Site vitrine premium',
    text: 'Site vitrine haut de gamme pour une maison d’hôtes : identité raffinée, galerie immersive, demandes de séjour.',
    image: '/assets/portfolio-velora.png',
    alt: 'Concept de site vitrine premium « Maison Vélora » affiché sur un ordinateur portable',
  },
  {
    slug: 'table-dauguste',
    name: 'Table d’Auguste',
    kind: 'Projet concept',
    category: 'Site restaurant',
    text: 'Site élégant pour un restaurant gastronomique : carte consultable, ambiance visuelle soignée, prise de contact.',
    image: '/assets/portfolio-restaurant.png',
    alt: 'Concept de site de restaurant « Table d’Auguste » sur smartphone et ordinateur portable',
  },
  {
    slug: 'nexora-flow',
    name: 'Nexora Flow',
    kind: 'Projet concept',
    category: 'Tableau de bord d’automatisation',
    text: 'Interface de suivi d’automatisations : indicateurs en temps réel, scénarios actifs et synthèses d’activité.',
    image: '/assets/portfolio-dashboard.png',
    alt: 'Concept de tableau de bord d’automatisation « Nexora Flow » sur écran',
  },
];

export const PROCESSUS = [
  { n: '01', title: 'Échange et compréhension du besoin', text: 'Un premier échange et un brief guidé pour cerner précisément votre projet et vos objectifs.' },
  { n: '02', title: 'Conception et validation du design', text: 'Une proposition visuelle claire, ajustée avec vous jusqu’à validation.' },
  { n: '03', title: 'Développement et tests', text: 'Réalisation technique soignée, vérifiée sur tous les appareils avant livraison.' },
  { n: '04', title: 'Mise en ligne et accompagnement', text: 'Déploiement, explications d’usage et suivi technique selon l’offre choisie.' },
];

export const FAQ = [
  {
    q: 'Combien coûte la création d’un site web ?',
    a: 'Nos offres de création démarrent à 300 € pour un site vitrine (Vitrine Starter) et 600 € pour un site avec fonctionnalités (Business Fonctionnel). Chaque projet fait l’objet d’un devis clair qui précise le périmètre exact avant tout engagement.',
  },
  {
    q: 'Quel est le délai de réalisation ?',
    a: 'Le délai dépend du périmètre du projet et des contenus disponibles. Il est estimé dans le devis, une fois votre besoin précisé. Indiquez simplement votre échéance souhaitée dans le formulaire de commande : nous vous confirmons ce qui est réalisable.',
  },
  {
    q: 'Le site sera-t-il adapté aux mobiles ?',
    a: 'Oui. Tous nos sites sont conçus en responsive design : l’affichage s’adapte automatiquement aux ordinateurs, tablettes et smartphones. C’est inclus dans toutes nos offres de création.',
  },
  {
    q: 'L’hébergement et le nom de domaine sont-ils inclus ?',
    a: 'Ils ne sont pas inclus par défaut dans les offres de création : ils sont précisés dans le devis, au même titre que d’éventuelles licences tierces. Nous pouvons les gérer pour vous dans un cadre défini ensemble.',
  },
  {
    q: 'Que comprend la maintenance ?',
    a: 'Les offres Care (60 €/mois ou 200 €/mois) couvrent la maintenance technique, les mises à jour compatibles, les sauvegardes lorsque l’hébergement le permet, les corrections de bugs dans le périmètre convenu et l’assistance technique. Le périmètre exact est défini par écrit au contrat — il ne s’agit pas d’un support illimité.',
  },
  {
    q: 'Puis-je demander des fonctionnalités supplémentaires ?',
    a: 'Bien sûr. Formulaires avancés, prise de rendez-vous, paiement en ligne, espaces clients : décrivez votre besoin. Les fonctionnalités hors périmètre de l’offre choisie font l’objet d’un devis complémentaire transparent.',
  },
  {
    q: 'Proposez-vous des solutions d’intelligence artificielle ?',
    a: 'Oui : chatbots IA pour votre site (dès 40 €/mois) et automatisations personnalisées connectées à vos outils (dès 100 €/mois). Après votre commande, notre assistant IA vous aide à définir précisément le besoin avant toute mise en production.',
  },
  {
    q: 'Comment obtenir un devis personnalisé ?',
    a: 'Deux options : commandez directement une offre en ligne (vous serez ensuite guidé par notre assistant IA pour détailler votre projet), ou décrivez votre besoin via le formulaire de contact. Vous recevez une réponse claire avec le périmètre et le tarif proposés.',
  },
];

/* -------------------------------------------------------------------------
   COMPATIBILITÉ OFFRE ↔ DEMANDE
   Règles utilisées par l’assistant de brief pour vérifier qu’une demande est
   compatible avec l’offre choisie. Severity : 'ajustements' | 'hors_perimetre'
   ------------------------------------------------------------------------- */
export const COMPAT_RULES = {
  'vitrine-starter': [
    {
      re: /(e[-\s]?commerce|boutique|panier|vendre en ligne|paiement|stripe|paypal|encaisse)/i,
      severity: 'hors_perimetre',
      label: 'Vente en ligne / paiement',
      msg: 'La vente en ligne et le paiement ne sont pas inclus dans l’offre Vitrine Starter : cela nécessite un devis spécifique.',
    },
    {
      re: /(espace (client|membre|abonn)|portail|compte(s)? (utilisateur|client)|connexion utilisateur|登录)/i,
      severity: 'hors_perimetre',
      label: 'Espace client / portail',
      msg: 'Un espace client ou un portail avec comptes utilisateurs dépasse le périmètre Vitrine Starter (devis spécifique).',
    },
    {
      re: /(chatbot|intelligence artificielle|\bia\b|agent (ia|virtuel))/i,
      severity: 'hors_perimetre',
      label: 'Fonctionnalité IA',
      msg: 'Les fonctionnalités d’intelligence artificielle ne sont pas incluses dans Vitrine Starter : voir nos offres IA dédiées ou un devis spécifique.',
    },
    {
      re: /(réservation|booking|agenda|prise de rendez[-\s]?vous|calendly|disponibilités)/i,
      severity: 'ajustements',
      label: 'Réservation / rendez-vous',
      msg: 'Une prise de rendez-vous ou réservation simple relève plutôt de l’offre Business Fonctionnel.',
    },
    {
      re: /(multilingue|plusieurs langues|traduction|version anglaise|bilingue)/i,
      severity: 'ajustements',
      label: 'Site multilingue',
      msg: 'Un site multilingue n’est pas inclus dans Vitrine Starter : il sera chiffré au devis.',
    },
  ],
  'vitrine-care': [
    {
      re: /(créer|création|nouveau site|refaire|refonte|pas encore de site|lancer)/i,
      severity: 'ajustements',
      label: 'Création de site',
      msg: 'L’offre Vitrine Care couvre la maintenance d’un site existant : la création du site fait l’objet d’une offre de création dédiée.',
    },
    {
      re: /(e[-\s]?commerce|boutique en ligne|espace client|paiement en ligne)/i,
      severity: 'ajustements',
      label: 'Site avancé',
      msg: 'Pour un site avec fonctionnalités avancées, l’offre Business Care est plus adaptée : à confirmer ensemble.',
    },
  ],
  'business-fonctionnel': [
    {
      re: /(e[-\s]?commerce|boutique|panier|paiement en ligne|stripe| paypal)/i,
      severity: 'ajustements',
      label: 'Paiement en ligne / e-commerce',
      msg: 'Le paiement en ligne ou une boutique complète ne sont pas inclus par défaut dans Business Fonctionnel : devis complémentaire, sauf mention explicite.',
    },
    {
      re: /(espace (client|membre|abonn)|portail|compte(s)? (utilisateur|client))/i,
      severity: 'ajustements',
      label: 'Portail / espace client',
      msg: 'Un portail client complet relève d’un devis spécifique. Un périmètre simplifié peut parfois être évoqué : à valider ensemble.',
    },
    {
      re: /(chatbot|intelligence artificielle|\bia\b|agent (ia|virtuel))/i,
      severity: 'ajustements',
      label: 'Fonctionnalité IA sur mesure',
      msg: 'Les fonctionnalités IA personnalisées sont chiffrées séparément : voir nos offres IA ou un devis complémentaire.',
    },
  ],
  'business-care': [
    {
      re: /(créer|création|nouveau site|refaire|refonte|pas encore de site)/i,
      severity: 'ajustements',
      label: 'Création de site',
      msg: 'Business Care couvre la maintenance d’un site existant : la création fait l’objet d’une offre de création dédiée.',
    },
  ],
  'chatbot-ia': [
    {
      re: /(automatiser|automatisation|workflow|scénario|relance(s)? auto|envoi(s)? auto|synchronis|crm|facture|devis auto)/i,
      severity: 'ajustements',
      label: 'Automatisation avancée',
      msg: 'Des automatisations métier (relances, synchronisations, scénarios multi-étapes) relèvent de l’offre Automatisation personnalisée (100 €/mois).',
    },
    {
      re: /(créer (un|mon) site|refonte de (mon|mon) site|site web complet|création de site)/i,
      severity: 'hors_perimetre',
      label: 'Création de site web',
      msg: 'L’offre Chatbot IA ne comprend pas la création d’un site web : voir nos offres Sites web.',
    },
  ],
  'automatisation-ia': [
    {
      re: /(créer (un|mon) site|refonte|création de site|site vitrine)/i,
      severity: 'ajustements',
      label: 'Création de site web',
      msg: 'La création d’un site web n’est pas incluse dans l’offre Automatisation : elle peut être combinée avec une offre Site web.',
    },
  ],
};

export const PRICING_GLOBAL_NOTE =
  'TVA : non précisée à ce stade — le statut de TVA applicable sera indiqué sur le devis. Hébergement, noms de domaine, licences tierces et coûts d’API/IA externes ne sont inclus que si mentionnés explicitement au devis. Aucune modification ou assistance illimitée n’est promise : chaque périmètre est défini par écrit.';

/* Types de projet proposés dans le formulaire de contact */
export const PROJECT_TYPES = [
  'Site vitrine',
  'Site avec fonctionnalités',
  'Chatbot IA',
  'Automatisation IA',
  'Refonte de site existant',
  'Autre / je ne sais pas encore',
];

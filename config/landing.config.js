/* =========================================================================
   CONTENU DES PAGES SEO — offres détaillées, guides, études de concept.
   Règle d'or : aucun chiffre, aucune promesse qui ne vienne pas de
   site.config.js (PLANS, FAQ, notes). Les prix ne sont jamais recopiés en
   dur dans les textes : ils sont lus depuis PLANS au rendu.
   ========================================================================= */

export const LANDING_PAGES = [
  {
    path: '/creation-site-internet',
    nav: 'Création de site internet',
    eyebrow: 'CRÉATION DE SITE WEB',
    title: 'Création de site internet pour entreprise — DigitalVerse',
    metaDescription:
      'Site vitrine ou site d’activité sur mesure : design responsive, formulaire de contact, référencement de base, mise en ligne incluse. Devis clair avant tout engagement.',
    h1: 'Création de site internet pour votre entreprise',
    lede:
      'Votre site est votre support commercial le plus visible : il doit rassurer en trois secondes, expliquer votre offre clairement et donner envie de vous contacter. DigitalVerse conçoit des sites sur mesure pour toute entreprise, quelle que soit sa taille — pas de gabarit — avec un périmètre écrit et un devis avant tout engagement. Et un site n’est pas une fin : nous l’équipons aussi de chatbot IA et d’automatisations quand votre activité le demande.',
    plans: ['vitrine-starter', 'business-fonctionnel', 'vitrine-care', 'business-care'],
    points: [
      {
        t: 'Un design qui vous ressemble',
        p: 'Interface pensée pour votre activité et votre clientèle, lisible sur ordinateur, tablette et smartphone : le responsive design est inclus dans toutes nos offres de création.',
      },
      {
        t: 'Le référencement de base, inclus dès le départ',
        p: 'Pages structurées, titres et descriptions soignés dès la mise en ligne. Pour un travail éditorial SEO plus profond, c’est un périmètre complémentaire chiffré au devis — nous ne promettons aucune position dans Google.',
      },
      {
        t: 'Zéro surprise sur le prix',
        p: 'Nom de domaine, contenus, fonctionnalités supplémentaires : tout est listé dans le devis avant le lancement. Vous savez ce que vous payez, et pourquoi.',
      },
    ],
    faqGlobal: [0, 1, 2, 3],
    faq: [],
    related: [
      { href: '/refonte-site-internet', t: 'Refonte de site internet', p: 'Votre site actuel mérite mieux qu’un coup de peinture ?' },
      { href: '/maintenance-site-internet', t: 'Maintenance de site', p: 'Pour qu’un site vive, il faut l’entretenir — par écrit.' },
      { href: '/guides/prix-site-internet', t: 'Guide : le prix d’un site', p: 'Grille de lecture honnête pour comparer les devis.' },
    ],
    serviceName: 'Création de site internet sur mesure',
    serviceType: 'Création de sites web',
  },
  {
    path: '/refonte-site-internet',
    nav: 'Refonte de site internet',
    eyebrow: 'REFONTE DE SITE WEB',
    title: 'Refonte de site internet : moderniser sans tout perdre — DigitalVerse',
    metaDescription:
      'Votre site a vieilli, il est lent ou ne convertit plus ? Refonte sur mesure : contenus repris, design moderne, périmètre écrit noir sur blanc avant tout engagement.',
    h1: 'Refonte de site internet pour entreprise',
    lede:
      'Refondre un site, ce n’est pas le repeindre : c’est repartir d’une base saine — vos contenus existants, ce qui fonctionne déjà, ce qui vous freine — pour reconstruire un site rapide, responsive et clair, aligné sur les usages actuels.',
    plans: ['vitrine-starter', 'business-fonctionnel'],
    points: [
      {
        t: 'On repart de l’existant',
        p: 'Textes, visuels, arborescence : l’état des lieux identifie ce qui est repris tel quel, ce qui est réécrit, ce qui disparaît. Le périmètre de reprise est écrit dans le devis — pas de reconstruction invisible facturée après coup.',
      },
      {
        t: 'Raccourcir le chemin vers l’action',
        p: 'Un site qui convertit se juge à ce qu’il déclenche : appels, demandes de devis, prises de contact. La nouvelle structure met en avant vos preuves et garde un chemin de contact à portée de clic.',
      },
      {
        t: 'Repartir sur du solide',
        p: 'Responsive, performance, structure de titres, contenus exploitables par les moteurs : une refonte remet la technique à niveau au lieu de colmater l’ancien site.',
      },
    ],
    faqGlobal: [1],
    faq: [
      {
        q: 'Faut-il prévoir une coupure pendant la bascule ?',
        a: 'Non : le nouveau site est construit à l’écart, puis mis en ligne une fois validé. La bascule se planifie avec vous, et les éventuelles redirections d’URL font partie du périmètre écrit.',
      },
      {
        q: 'Mon ancien site ne vient pas de vous. Est-ce un problème ?',
        a: 'Aucun. La refonte repart de ce que vous avez : technologies, contenus, hébergement. Un état des lieux technique précède le devis, et nous vous disons franchement ce qui vaut la peine d’être repris de l’ancien site.',
      },
    ],
    related: [
      { href: '/creation-site-internet', t: 'Création de site internet', p: 'Si vous partez de zéro, c’est par ici.' },
      { href: '/maintenance-site-internet', t: 'Maintenance de site', p: 'Après la refonte, entretenir ce qui vient d’être reconstruit.' },
      { href: '/guides/choisir-agence-web', t: 'Guide : choisir une agence web', p: 'Les 8 questions à poser avant de signer.' },
    ],
    serviceName: 'Refonte de site internet',
    serviceType: 'Refonte de sites web',
  },
  {
    path: '/chatbot-ia-entreprise',
    nav: 'Chatbot IA',
    eyebrow: 'SOLUTIONS IA',
    title: 'Chatbot IA pour votre entreprise — DigitalVerse',
    metaDescription:
      'Un assistant IA sur votre site qui répond aux questions courantes et oriente vos visiteurs. Configuration incluse, pilotage côté administrateur, périmètre défini par contrat.',
    h1: 'Chatbot IA pour votre site d’entreprise',
    lede:
      'Votre équipe passe un temps précieux à répéter les mêmes réponses ? Le chatbot IA prend le relais sur les questions simples, jour et nuit, et transmet à un humain quand le sujet le mérite. Chez DigitalVerse, il s’intègre à votre site et se règle selon votre activité réelle — pas l’inverse.',
    plans: ['chatbot-ia', 'automatisation-ia'],
    points: [
      {
        t: 'Configuré pour votre activité',
        p: 'Le périmètre de réponses — services, horaires, tarifs publics, démarches — est défini avec vous et inscrit au contrat. Le bot ne promet que ce que vous pouvez tenir.',
      },
      {
        t: 'Vous gardez la main',
        p: 'Gestion technique du côté administrateur de votre site : les ajustements se pilotent depuis votre site, pas depuis un service inaccessible.',
      },
      {
        t: 'Des coûts transparents',
        p: 'L’abonnement couvre l’intégration et la configuration. Si les frais d’utilisation de l’IA sont facturés séparément, c’est annoncé et chiffré avant la mise en service, pas découvert sur une facture.',
      },
    ],
    faqGlobal: [6],
    faq: [
      {
        q: 'Est-ce que le chatbot remplace une personne ?',
        a: 'Non, et nous ne le vendons pas comme tel : il traite les questions courantes et oriente vers un humain pour le reste. Le nombre de conversations prises en charge et la conduite à tenir sur les sujets sensibles sont définis au contrat.',
      },
    ],
    related: [
      { href: '/automatisation-ia', t: 'Automatisation IA', p: 'Quand le besoin dépasse la conversation : connecter l’IA à vos outils.' },
      { href: '/creation-site-internet', t: 'Création de site internet', p: 'Un chatbot se pose sur un site qui lui ressemble.' },
      { href: '/guides/chatbot-ia-pme', t: 'Guide : le chatbot IA en entreprise', p: 'Ce qu’il fait vraiment, ce qu’on ne doit pas vous promettre.' },
    ],
    serviceName: 'Chatbot IA pour site d’entreprise',
    serviceType: 'Intelligence artificielle appliquée au service client',
  },
  {
    path: '/automatisation-ia',
    nav: 'Automatisation IA',
    eyebrow: 'SOLUTIONS IA',
    title: 'Automatisation des tâches de votre entreprise, avec l’IA — DigitalVerse',
    metaDescription:
      'Relances, saisie, synthèses : scénarios d’automatisation connectés à vos outils compatibles, périmètre écrit et suivi technique inclus. Abonnement sur mesure, dès le premier scénario.',
    h1: 'Automatisation des tâches répétitives, avec l’IA',
    lede:
      'Avant d’acheter un logiciel ou d’embaucher, regardez vos journées : elles regorgent d’enchaînements mécaniques — copier des informations d’un outil à l’autre, relancer un devis, classer un e-mail, sortir un reporting. Ces bouts de temps-là s’automatisent, avec des scénarios branchés sur vos outils existants.',
    plans: ['automatisation-ia', 'chatbot-ia'],
    points: [
      {
        t: 'Connecté à vos outils',
        p: 'Nous automatisons dans les outils que vous utilisez déjà, quand ils le permettent : la liste des connexions compatibles est établie pendant le brief. Aucune obligation de déménager votre système d’information.',
      },
      {
        t: 'Des scénarios écrits, pas de la magie',
        p: 'Chaque automatisation a une entrée, un traitement, une sortie — et un retour à l’humain quand le doute est permis. Le périmètre est défini par écrit, au contrat.',
      },
      {
        t: 'Le socle, puis les étages',
        p: 'On commence par un ou deux scénarios à fort impact, puis on ajoute les briques qui ont fait leurs preuves. Licences tierces et coûts d’API restent explicités à part, jamais noyés dans l’abonnement.',
      },
    ],
    faqGlobal: [5],
    faq: [
      {
        q: 'Sur quels types de tâches travaillez-vous ?',
        a: 'Exemples typiques : reprise d’informations depuis un formulaire ou un e-mail vers votre tableur ou votre CRM, envois et relances automatiques, mise en forme de documents récurrents, synthèses d’activité. Tout dépend de vos outils : la faisabilité se vérifie pendant le brief, avant tout engagement.',
      },
    ],
    related: [
      { href: '/chatbot-ia-entreprise', t: 'Chatbot IA', p: 'La brique conversationnelle, si vos visiteurs en ont besoin.' },
      { href: '/realisations/nexora-flow', t: 'Concept : Nexora Flow', p: 'À quoi peut ressembler un tableau de bord d’automatisations.' },
      { href: '/guides/chatbot-ia-pme', t: 'Guide : automatiser sans se tromper', p: 'Préparer le terrain avant de brancher l’IA.' },
    ],
    serviceName: 'Automatisation de processus avec IA',
    serviceType: 'Automatisation des processus métier',
  },
  {
    path: '/maintenance-site-internet',
    nav: 'Maintenance de site',
    eyebrow: 'MAINTENANCE & SUIVI',
    title: 'Maintenance de site internet, périmètre écrit — DigitalVerse',
    metaDescription:
      'Mises à jour, sauvegardes, corrections et assistance pour votre site. Deux formules selon la criticité, périmètre défini par contrat, règle d’annulation affichée publiquement.',
    h1: 'Maintenance de site internet, par écrit',
    lede:
      'Un site sans maintenance, c’est un site qui prend lentement la poussière : dépendances qui vieillissent, formulaire qui casse un jour sans qu’on le sache, sauvegarde introuvable le jour où il en faut une. Nos offres couvrent l’essentiel — et uniquement ce qui est promis.',
    plans: ['vitrine-care', 'business-care'],
    points: [
      {
        t: 'Ce qui est inclus, noir sur blanc',
        p: 'Mises à jour techniques sur demandes, sauvegardes lorsque l’hébergement le permet, corrections de bugs et assistance encadrée : le périmètre exact tient dans le contrat, pas dans une plaquette commerciale.',
      },
      {
        t: 'Création et maintenance sont séparées',
        p: 'Ces offres entretiennent un site existant ; elles n’en incluent pas la création. Si votre site doit d’abord être refait, l’offre adaptée est chiffrée au devis, en transparence.',
      },
      {
        t: 'Six mois pour juger sur pièce',
        p: 'Sans résultat concluant au bout de six mois, avec justificatif valable, vous pouvez exiger l’annulation de l’abonnement. Cette règle figure sur notre site — pas seulement dans les conditions.',
      },
    ],
    faqGlobal: [4],
    faq: [
      {
        q: 'Mon site vient d’un autre prestataire. Vous le prenez en maintenance ?',
        a: 'Oui, après un état des lieux technique : selon l’hébergement et l’ancienneté du site, le périmètre réaliste est précisé avant le contrat. Si le site doit en réalité être reconstruit, nous vous le dirons franchement — c’est la refonte qu’il vous faut, pas la maintenance.',
      },
    ],
    related: [
      { href: '/refonte-site-internet', t: 'Refonte de site internet', p: 'Quand l’état des lieux dit “mieux vaut reconstruire”.' },
      { href: '/creation-site-internet', t: 'Création de site internet', p: 'Pour repartir sur une base neuve et bien pensée.' },
      { href: '/guides/prix-site-internet', t: 'Guide : le vrai coût d’un site', p: 'Comprendre ce que finance chaque poste, y compris la maintenance.' },
    ],
    serviceName: 'Maintenance de site internet',
    serviceType: 'Maintenance et support de sites web',
  },
];

/* -------------------------------------------------------------------------
   GUIDES — contenu éditorial utile, sans statistique inventée ni caution
   implicite. Tous les chiffres cités viennent de notre propre grille.
   ------------------------------------------------------------------------- */
export const GUIDES = [
  {
    slug: 'prix-site-internet',
    title: 'Combien coûte un site internet en 2026 ? Grille de lecture honnête',
    date: '2026-10-28',
    metaDescription:
      'Vitrine, activité, maintenance, IA : ce que couvre chaque poste d’un devis de site web, et les questions à poser avant de signer. Exemple chiffré avec notre propre grille.',
    lede:
      '« Un site, c’est entre 150 € et 15 000 €. » Voilà le problème : cette phrase est vraie, et elle ne vous aide en rien. Ce qui compte n’est pas le total affiché, mais ce que chaque poste finance réellement.',
    sections: [
      {
        h: 'Les quatre postes que vous payez, en fait',
        p: [
          'Tout devis de site recouvre quatre familles de coûts : le design (structure, identité, maquettes), le développement (la technique qui tient derrière), les contenus (textes, photos, et c’est souvent le grand oublié du budget), et la vie du site après la mise en ligne (hébergement, maintenance, évolutions).',
          'La plupart des mauvaises surprises ne viennent pas du prix total, mais d’un poste jamais discuté à la commande — presque toujours la maintenance ou les contenus.',
        ],
      },
      {
        h: 'Ce que coûte un site chez nous (grille publique)',
        p: [
          'Pour vous donner un repère concret, voici notre grille, telle qu’affichée sur le site :',
        ],
        ul: [
          'Site Vitrine : 400 € en paiement unique — design personnalisé et responsive, présentation des services, formulaire de contact, référencement de base, mise en ligne et hébergement.',
          'Site Business : 1 200 € en paiement unique — pour un site plus avancé, avec fonctionnalités administratives et de gestion incluses et fonctionnalités personnalisées définies avec vous.',
          'Vitrine Core : 80 €/mois — maintenance d’un site vitrine (mises à jour sur demandes, sauvegardes lorsque disponibles, corrections de bugs, assistance encadrée).',
          'Business Care : 245 €/mois — maintenance d’un site fonctionnel plus exposé, avec suivi technique et petites modifications encadrées.',
          'Chatbot IA : 79 €/mois ; automatisation sur mesure : dès 199 €/mois pour les scénarios connectés à vos outils.',
        ],
        pAfter: [
          'Un « site à 150 € » est presque toujours un gabarit sans vos contenus, ou un appel d’air : la vraie facture apparaît à la première demande de modification. À l’inverse, un devis à cinq chiffres ne vaut pas mieux qu’un autre s’il ne liste pas ce qui est inclus. La bonne question n’est jamais « combien ? » seule, mais « combien, et pour quoi ? ».',
        ],
      },
      {
        h: 'Les questions qui évitent les mauvaises surprises',
        ul: [
          'Le nom de domaine et l’hébergement sont-ils à mon nom ? Comment les récupère-t-on un jour ?',
          'Que couvre la maintenance — et surtout, que couvre-t-elle explicitement ? (« illimité » ne veut rien dire.)',
          'Qui rédige les textes, qui fournit les photos ? S’ils manquent, le projet n’avance pas.',
          'Le devis liste-t-il ce qui n’est PAS inclus, comme le nôtre liste domaine, contenus et fonctionnalités hors périmètre ?',
          'Que dit le contrat sur l’annulation et les frais de tiers (API, licences, coûts d’IA) ?',
        ],
      },
      {
        h: 'Site et visibilité : deux budgets, un plan',
        p: [
          'Un site tout neuf n’apparaît pas en première page par magie : le référencement de base inclus à la création (structure, balises, fichiers techniques) le met en règle avec Google, pas favori. Le travail éditorial — contenus réguliers, notoriété, liens — est un poste distinct, qui se planifie et se chiffre séparément. Méfiez-vous de toute promesse de « première place garantie » : personne ne peut la tenir.',
          'Notre position est simple : le site bien construit d’abord, la visibilité ensuite, avec un périmètre écrit à chaque étape. C’est moins vendeur qu’une promesse, et c’est la seule chose que l’on puisse garantir.',
        ],
      },
    ],
    cta: { label: 'Voir la grille tarifaire complète', href: '/#offres' },
    related: [
      { href: '/creation-site-internet', label: 'Création de site internet' },
      { href: '/maintenance-site-internet', label: 'Maintenance de site' },
      { href: '/guides/choisir-agence-web', label: 'Guide : les 8 questions à poser à une agence' },
    ],
  },
  {
    slug: 'choisir-agence-web',
    title: 'Agence web : les 8 questions à poser avant de signer',
    date: '2026-10-28',
    metaDescription:
      'Prix, propriété du site, maintenance, engagement, promesses SEO : la check-list qui sépare une vraie agence d’un vendeur de gabarits. Testez-la aussi sur DigitalVerse.',
    lede:
      'On choisit une agence web sur son portfolio et son prix. Erreur classique : c’est sur les questions suivantes que se joue la vraie qualité de la collaboration. Voici la check-list, dans l’ordre où les poser.',
    sections: [
      {
        h: 'Sur le prix',
        ul: [
          '« Le devis détaille-t-il ce qui n’est pas inclus ? » Un devis honnête a une liste d’exclusions visible : chez nous, domaine, contenus et fonctionnalités hors périmètre y figurent, avec la mention que les coûts de tiers (API, licences, hébergement) ne sont inclus que s’ils sont écrits.',
          '« Qu’est-ce qui déclenche un supplément, et à quel tarif ? » Mieux vaut connaître le taux horaire du hors-forfait avant le projet qu’après la première demande.',
        ],
      },
      {
        h: 'Sur la propriété',
        ul: [
          '« À qui appartiennent le nom de domaine, l’hébergement et l’accès à l’administration ? » Vous devriez répondre : à vous. Vérifiez dans le devis, pas dans la conversation.',
          '« Si un jour je pars, qu’est-ce que j’emporte ? » Un site dont on ne peut pas partir est une location, pas une création.',
        ],
      },
      {
        h: 'Sur le travail',
        ul: [
          '« Qui fait le design et qui rédige les textes ? » Beaucoup d’agences livrent une coquille vide et découvrent que les contenus, c’est pour vous.',
          '« Combien d’allers-retours avant validation ? » La réponse doit être un nombre ou un principe clair (« jusqu’à validation » se discute ; « deux tours inclus » se planifie).',
        ],
      },
      {
        h: 'Sur l’après',
        ul: [
          '« Que couvre exactement la maintenance : mises à jour, sauvegardes, corrections, assistance — avec quels délais d’intervention ? »',
          '« Que dit le contrat sur l’annulation ? » Notre règle, affichée sur le site : pour un abonnement mensuel, annulation possible au bout de six mois sans résultat concluant, justificatif valable. Si une agence cache cette clause au fond d’un PDF, vous avez votre réponse.',
        ],
      },
      {
        h: 'Sur les promesses',
        p: [
          '« Pouvez-vous me garantir la première place sur Google ? » La bonne réponse est non, net. Le référencement se construit avec un site techniquement propre, des contenus utiles et du temps ; quiconque vous vend une position vend du vent. En revanche, « je vous garantis un site structuré, rapide, avec des balises soignées et des fichiers techniques conformes » : ça, ça se promet et ça se livre.',
        ],
      },
      {
        h: 'Le test qui tranche',
        p: [
          'Posez ces huit questions à trois prestataires. Vous saurez en trente minutes lesquels travaillent par écrit — et lequel vous vend une relation. Ces questions sont écrites pour s’appliquer à nous aussi : testez-les sur DigitalVerse, la grille tarifaire, les exclusions et la règle d’annulation sont déjà sur le site.',
        ],
      },
    ],
    cta: { label: 'Parler de votre projet', href: '/#contact' },
    related: [
      { href: '/guides/prix-site-internet', label: 'Guide : le prix d’un site en 2026' },
      { href: '/creation-site-internet', label: 'Notre offre de création de site' },
    ],
  },
  {
    slug: 'chatbot-ia-pme',
    title: 'Chatbot IA pour votre entreprise : par où commencer, sans se faire avoir',
    date: '2026-10-28',
    metaDescription:
      'Ce qu’un assistant IA sur votre site fait vraiment, ce qu’on ne doit pas vous promettre, et comment préparer son brief. Mode d’emploi honnête, avec ce que ça coûte chez nous.',
    lede:
      'Le chatbot IA est le genre d’outil qu’on vend comme une baguette magique et qu’on range au bout de trois mois. Il a pourtant une vraie utilité — à condition de savoir exactement ce qu’on lui demande.',
    sections: [
      {
        h: 'Ce qu’il fait bien',
        ul: [
          'Répondre aux questions que votre équipe répète dix fois par jour : horaires, tarifs publics, zones d’intervention, délais, démarches.',
          'Orienter le visiteur selon son besoin : vers la bonne page, le bon interlocuteur, le bon créneau de rendez-vous.',
          'Capturer l’essentiel d’une demande (qui, quoi, quand) avant même qu’un humain ne s’en occupe — surtout en dehors des heures d’ouverture.',
        ],
      },
      {
        h: 'Ce qu’il ne fera pas',
        ul: [
          'Remplacer vos équipes sur les sujets sensibles : litige, négociation, technique pointue. Un bon chatbot sait dire « je transmets », un mauvais improvise.',
          'Deviner une information que vous ne lui avez pas fournie : ce qu’il ne sait pas, il ne doit pas l’inventer — c’est une règle de configuration, pas une limite de l’IA.',
          'Fonctionner sans surveillance : un assistant, ça se teste après chaque changement de tarifs ou d’offre, comme n’importe quel outil.',
        ],
      },
      {
        h: 'Préparer le terrain avant de commander',
        ul: [
          'Listez les 15 questions que l’on vous pose le plus souvent, avec les réponses exactes que vous aimeriez entendre.',
          'Décidez ce que le bot transmet à un humain, et vers quoi (e-mail, téléphone, formulaire).',
          'Rassemblez vos sources à jour : pages de votre site, tarifs publics, conditions.',
          'Fixez le volume de conversations attendu : c’est une ligne du contrat, pas une variable cachée.',
        ],
      },
      {
        h: 'Combien ça coûte, chez nous',
        p: [
          'Le Chatbot IA est à 79 €/mois : intégration à votre site, configuration adaptée à votre entreprise, et gestion technique du côté administrateur de votre site — vous restez maître du dispositif. Les frais d’utilisation de l’IA sont facturés séparément si nécessaire, et annoncés à l’avance ; nombre de conversations et périmètre sont définis au contrat. Et si votre besoin dépasse la conversation — connecter l’IA à vos outils, automatiser des tâches — c’est l’offre d’automatisation sur mesure (dès 199 €/mois) qu’il faut regarder, pas un chatbot surchargé.',
        ],
      },
    ],
    cta: { label: 'Discuter de votre besoin IA', href: '/commander?offre=chatbot-ia' },
    related: [
      { href: '/chatbot-ia-entreprise', label: 'L’offre Chatbot IA en détail' },
      { href: '/automatisation-ia', label: 'L’offre d’automatisation sur mesure' },
      { href: '/realisations/nexora-flow', label: 'Concept : un tableau de bord d’automatisations' },
    ],
  },
];

/* -------------------------------------------------------------------------
   ÉTUDES DE CONCEPT — démonstrations d'agence. Les PORTFOLIO sont des
   projets concepts (jamais des clients) : chaque page le dit, noir sur blanc.
   ------------------------------------------------------------------------- */
export const CASE_PAGES = [
  {
    slug: 'maison-velora',
    title: 'Concept de site vitrine pour maison d’hôtes — DigitalVerse',
    metaDescription:
      'À quoi devrait ressembler le site d’une maison d’hôtes ? Étude de concept par DigitalVerse : atmosphère, galerie immersive, demandes de séjour. Démonstration, pas un client réel.',
    h1: 'Maison Vélora — vendre une atmosphère, pas seulement des chambres',
    flag: 'Projet concept — démonstration d’agence, pas un client réel',
    contexte:
      'Une maison d’hôtes haut de gamme concurrente surtout des plateformes de réservation, qui prennent une commission sur chaque séjour et rendent l’établissement interchangeable. Le rôle du site : recréer le lien direct — donner à sentir la maison avant même la première demande.',
    objectifs: [
      'Donner envie avant même la première photo : le visiteur doit comprendre l’atmosphère en trois secondes.',
      'Rendre la demande de séjour aussi simple qu’un message à un ami — le formulaire est une conversation, pas un tunnel.',
      'Traduire le standing par la retenue : grandes images, typographie soignée, silence marketing.',
    ],
    montre: [
      'Une structure immersive : l’histoire de la maison, les chambres une par une, la table d’hôtes, puis la demande.',
      'Une galerie pensée comme une visite et non comme un dossier photo.',
      'Un chemin de contact unique et répété — le même geste du début à la fin.',
      'Des balises et une structure prêtes pour les recherches locales (« maison d’hôtes + ville »), sans promesse de position.',
    ],
    pourQui:
      'Ce type de structure convient aux maisons d’hôtes, gîtes de charme, locations saisonnières haut de gamme et petits hôtels indépendants qui veulent vendre leur atmosphère en direct plutôt que de dépendre des plateformes.',
    plans: ['vitrine-starter'],
    faq: [
      {
        q: 'Ce concept est-il adaptable à mon établissement ?',
        a: 'Oui — c’est une démonstration de direction, pas un gabarit : textes, photos, structure et parcours de demande sont reconstruits autour de votre maison. Le périmètre se définit lors du brief, et le concept lui-même n’engage à rien.',
      },
    ],
    related: [
      { href: '/creation-site-internet', label: 'L’offre Site Vitrine' },
      { href: '/realisations/table-dauguste', label: 'Concept voisin : site de restaurant' },
      { href: '/maintenance-site-internet', label: 'Maintenance après mise en ligne' },
    ],
  },
  {
    slug: 'table-dauguste',
    title: 'Concept de site pour restaurant gastronomique — DigitalVerse',
    metaDescription:
      'Le site d’un restaurant doit vendre la table avant le plat. Étude de concept par DigitalVerse : carte consultable, ambiance, prise de contact. Démonstration d’agence, pas un client réel.',
    h1: 'Table d’Auguste — le site qui met l’eau à la bouche avant la carte',
    flag: 'Projet concept — démonstration d’agence, pas un client réel',
    contexte:
      'Un restaurant a trois ennemis : le client qui hésite entre deux adresses à deux minutes d’intervalle, l’affiche Instagram qui ne dit rien de l’assiette, et le téléphone occupé au mauvais moment. Le site arbitre ces trois batailles.',
    objectifs: [
      'Une carte lisible sur mobile en moins de deux secondes, sans PDF à télécharger.',
      'Donner à voir la salle, la terrasse, l’assiette — dans cet ordre.',
      'Transformer l’envie en réservation en un geste, avec le numéro de téléphone toujours à portée.',
    ],
    montre: [
      'Une page d’accueil qui s’ouvre sur l’ambiance et la proposition du jour, pas sur un slogan.',
      'Une carte structurée (entrées, plats, desserts, menu) prête à être mise à jour selon les saisons.',
      'Les informations pratique — horaires, accès, parking, groupes — regroupées là où on les cherche.',
      'Des photos légères et nettes sur mobile : la vitesse de chargement fait partie de l’appétit.',
    ],
    pourQui:
      ' Restaurants, tables d’hôtes, caves et bars de qualité qui veulent exister autrement que par les annuaires, et garder la relation directe avec leurs habitués.',
    plans: ['vitrine-starter', 'business-fonctionnel'],
    faq: [
      {
        q: 'Et la réservation en ligne, dans ce concept ?',
        a: 'Le concept montre la carte et le contact direct. Pour la réservation en ligne, deux voies au devis : redirection vers votre outil de réservation existant, ou module de réservation intégré — dans ce second cas, l’offre Site Business est le bon point de départ.',
      },
    ],
    related: [
      { href: '/creation-site-internet', label: 'Création de site internet' },
      { href: '/refonte-site-internet', label: 'Refonte : moderniser un site de restaurant' },
      { href: '/realisations/maison-velora', label: 'Concept voisin : maison d’hôtes' },
    ],
  },
  {
    slug: 'nexora-flow',
    title: 'Concept de tableau de bord d’automatisation IA — DigitalVerse',
    metaDescription:
      'Que devient l’automatisation quand elle est bien pensée ? Étude de concept : tableau de bord de scénarios IA, indicateurs temps réel, synthèses. Démonstration d’agence, pas un client réel.',
    h1: 'Nexora Flow — voir ses automatisations travailler',
    flag: 'Projet concept — démonstration d’agence, pas un client réel',
    contexte:
      'Une automatisation invisible est une automatisation douteuse : au bout d’un mois, plus personne ne sait ce qui tourne, ce qui a échoué, ce que ça a rapporté. Le tableau de bord répond à ces trois questions en permanence.',
    objectifs: [
      'Un coup d’œil pour savoir si tout tourne : scénarios actifs, en erreur, en pause.',
      'Une synthèse hebdomadaire qui remplace cinq écrans : volume traité, temps gagné estimé prudemment, incidents.',
      'Un point d’entrée unique pour agir : réessayer un scénario, basculer sur un humain, ajustement.',
    ],
    montre: [
      'La vue temps réel : flux entrants, files en cours, connexions aux outils.',
      'Les scénarios comme des fiches vivantes : à quoi ils servent, ce qu’ils ont fait cette semaine.',
      'Les exceptions traitables en un clic, pas dans un journal de logs.',
      'Le vocabulaire humain partout : « relances de devis envoyées », jamais « jobs exécutés ».',
    ],
    pourQui:
      'Toutes les entreprises et indépendants dont l’activité dépend d’outils connectés — CRM, facturation, formulaires, e-mail — et qui veulent piloter leurs automatisations sans embaucher un technicien dédié. Le tableau de bord est une option de présentation : beaucoup de scénarios démarrent utilement avec une simple synthèse par e-mail.',
    plans: ['automatisation-ia'],
    faq: [
      {
        q: 'Faut-il un tableau de bord pour automatiser ?',
        a: 'Non. Pour un ou deux scénarios, une synthèse périodique par e-mail suffit souvent. Le tableau de bord devient utile quand les flux se multiplient et qu’il faut décider en dix secondes où regarder — il se justifie au cas par cas, jamais par défaut.',
      },
    ],
    related: [
      { href: '/automatisation-ia', label: 'L’offre d’automatisation sur mesure' },
      { href: '/chatbot-ia-entreprise', label: 'Le complément : chatbot IA' },
      { href: '/guides/chatbot-ia-pme', label: 'Guide : préparer son brief IA' },
    ],
  },
];

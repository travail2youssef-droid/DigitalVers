/* =========================================================================
   CONTENU SEO ADDITIONNEL — articles de fond et pages ville.
   Injecté dans GUIDES au démarrage (voir applySeoOverrides).
   Règle d'or : aucune statistique inventée, aucune référence locale
   inventée, aucun client cité. Les prix sont ceux de la grille publique.
   ========================================================================= */

const DATE = '2026-10-30';

/* ------------------------------------------------------------ ARTICLES */
const ARTICLES = [
  {
    slug: 'refonte-site-seo-checklist',
    title: 'Refonte de site : la checklist SEO pour ne rien perdre',
    date: DATE,
    metaDescription:
      'Refondre un site sans perdre sa visibilité : inventaire des URL, redirections 301, balises, sitemap, contrôle après mise en ligne. La checklist étape par étape.',
    lede:
      'Une refonte réussie à l’écran peut être un désastre dans Google : URL qui changent sans redirection, titres écrasés, pages supprimées par mégarde. Voici la checklist à suivre pour que le nouveau site hérite de la visibilité de l’ancien au lieu de repartir de zéro.',
    sections: [
      {
        h: 'Avant la refonte : faire l’inventaire',
        ul: [
          'Listez toutes les URL de l’ancien site (plan du site, export de votre outil de gestion, Search Console). Ce qui n’est pas listé sera oublié.',
          'Repérez les pages qui reçoivent des visites ou des liens : ce sont celles à protéger en priorité. Search Console indique les pages qui apparaissent dans Google.',
          'Notez pour chaque page importante son titre, sa description et son titre principal actuels : ce sont des contenus qui ont déjà fait leurs preuves, ne les jetez pas sans raison.',
        ],
      },
      {
        h: 'Pendant la refonte : conserver ou rediriger',
        ul: [
          'Gardez les mêmes URL quand c’est possible. Une URL qui ne change pas n’a besoin d’aucune redirection.',
          'Quand une URL change, prévoyez une redirection permanente (301) de l’ancienne vers la page équivalente la plus proche, pas vers l’accueil.',
          'Chaque page garde un titre unique, une description rédigée et un seul titre principal (H1).',
          'Les images portent un texte alternatif utile ; les pages importantes restent accessibles en peu de clics depuis l’accueil.',
          'Le nouveau site doit être rapide et lisible sur mobile : c’est une base technique, pas un bonus.',
        ],
      },
      {
        h: 'Au moment de la mise en ligne',
        ul: [
          'Vérifiez que le fichier robots.txt n’interdit pas l’accès au site (un réglage de préproduction oublié est une erreur classique).',
          'Publiez un sitemap.xml à jour et soumettez-le dans Search Console.',
          'Testez les redirections une par une sur un échantillon : l’ancienne URL doit mener à la bonne page en une seule étape.',
          'Demandez l’indexation de l’accueil et des pages clés dans Search Console.',
        ],
      },
      {
        h: 'Les semaines suivantes : surveiller',
        p: [
          'Consultez Search Console chaque semaine pendant le premier mois : erreurs d’exploration, pages exclues, évolution des impressions. Une baisse temporaire après une refonte est fréquente ; une baisse qui s’installe signale presque toujours une redirection manquante ou une page supprimée.',
          'Aucune méthode ne garantit de conserver exactement ses positions, et personne ne peut promettre une place dans Google. Mais une refonte préparée avec cette checklist supprime les causes de perte les plus évitables.',
        ],
      },
    ],
    cta: { label: 'Parler de votre refonte', href: '/refonte-site-internet' },
    related: [
      { href: '/refonte-site-internet', label: 'Notre offre de refonte de site' },
      { href: '/guides/prix-site-internet', label: 'Guide : le prix d’un site en 2026' },
      { href: '/guides/choisir-agence-web', label: 'Guide : choisir une agence web' },
    ],
  },
  {
    slug: 'automatiser-taches-entreprise-ia',
    title: 'Automatiser sa PME : 6 tâches à confier à l’IA en premier',
    date: DATE,
    metaDescription:
      'Relances de devis, tri d’e-mails, saisie, comptes rendus : 6 tâches répétitives à automatiser en premier, et comment choisir un premier scénario sans risque.',
    lede:
      'Automatiser, ce n’est pas tout remplacer : c’est repérer les enchaînements mécaniques qui mangent vos journées et leur donner un cadre fiable. Voici six candidats classiques, et la méthode pour choisir le premier.',
    sections: [
      {
        h: 'Six tâches qui s’automatisent bien',
        ul: [
          'Relancer un devis resté sans réponse, avec un message préparé et un rappel interne.',
          'Reporter les informations d’un formulaire de contact vers un tableur ou un outil de suivi des clients.',
          'Trier et classer les e-mails entrants par type de demande, avec réponse type pour les questions fréquentes.',
          'Produire un compte rendu ou une synthèse à partir de notes ou d’échanges, relu ensuite par un humain.',
          'Mettre en forme des documents récurrents : devis, factures, rapports d’activité.',
          'Envoyer une confirmation, un rappel de rendez-vous ou une demande d’avis après une prestation.',
        ],
      },
      {
        h: 'Comment choisir le premier scénario',
        ul: [
          'Il se répète souvent (plusieurs fois par semaine au moins) : le gain se voit vite.',
          'Ses règles sont claires : on peut écrire « si ceci, alors cela » sans ambiguïté.',
          'Une erreur reste réparable : on commence par un scénario où un humain peut corriger avant que cela ne parte chez un client.',
          'Les outils concernés permettent une connexion : la faisabilité se vérifie avant de s’engager.',
        ],
      },
      {
        h: 'Ce qu’il faut garder humain',
        p: [
          'Les litiges, les négociations, les décisions engageantes et tout message sensible restent à une personne. Une bonne automatisation sait s’arrêter et transmettre, elle n’improvise pas. Chaque scénario doit avoir une entrée, un traitement, une sortie et un point de retour vers l’humain.',
        ],
      },
      {
        h: 'Combien cela coûte, chez nous',
        p: [
          'L’automatisation sur mesure démarre à 199 €/mois pour des scénarios connectés à vos outils, périmètre écrit au contrat. Les licences d’outils tiers et les frais d’utilisation de l’IA sont annoncés et chiffrés à part, avant la mise en service. Si votre besoin est surtout de répondre aux visiteurs de votre site, le chatbot IA (79 €/mois) est plus adapté.',
        ],
      },
    ],
    cta: { label: 'Discuter d’un premier scénario', href: '/commander?offre=automatisation-ia' },
    related: [
      { href: '/automatisation-ia', label: 'L’offre d’automatisation IA' },
      { href: '/guides/chatbot-ia-pme', label: 'Guide : le chatbot IA en entreprise' },
      { href: '/chatbot-ia-entreprise', label: 'L’offre Chatbot IA' },
    ],
  },
];

/* ----------------------------------------------------------- PAGES VILLE */
/* Chaque ville a son angle propre, sans fait local inventé : on décrit la
   recherche locale (« site internet + ville ») et ce que nous faisons à
   distance pour les entreprises de la ville. */
const VILLES = [
  { slug: 'paris', nom: 'Paris', prep: 'à Paris', angle: 'Paris concentre un très grand nombre d’entreprises, et donc une recherche locale très disputée : un site flou ou lent s’y fait vite dépasser. La clarté de l’offre et la précision des pages comptent plus qu’ailleurs.', publics: 'commerces, restaurants, cabinets, artisans, start-up et indépendants' },
  { slug: 'lyon', nom: 'Lyon', prep: 'à Lyon', angle: 'Pour une entreprise lyonnaise, être trouvé quand un client tape « site internet Lyon » ou le nom d’un service suivi de la ville passe par des pages qui disent clairement ce que vous faites et où vous intervenez.', publics: 'commerces, restaurants, cabinets, artisans, PME de services et indépendants' },
  { slug: 'marseille', nom: 'Marseille', prep: 'à Marseille', angle: 'À Marseille comme ailleurs, la majorité des recherches de services locaux se font depuis un téléphone : un site rapide, lisible sur mobile, avec un contact à portée de pouce, est la base.', publics: 'commerces, restaurants, artisans, professionnels du tourisme et indépendants' },
  { slug: 'toulouse', nom: 'Toulouse', prep: 'à Toulouse', angle: 'Pour une entreprise toulousaine, le site sert autant à rassurer un client qui compare qu’à être trouvé : présentation de l’offre, tarifs lisibles, preuves de sérieux et moyen de contact évident.', publics: 'PME, cabinets, artisans, commerces et indépendants' },
  { slug: 'bordeaux', nom: 'Bordeaux', prep: 'à Bordeaux', angle: 'À Bordeaux, un site bien structuré permet d’apparaître sur les recherches « service + ville » sans dépendre uniquement des annuaires ou des réseaux sociaux, que vous ne contrôlez pas.', publics: 'commerces, restaurants, artisans, cabinets et indépendants' },
  { slug: 'lille', nom: 'Lille', prep: 'à Lille', angle: 'Pour une entreprise lilloise, un site propre et rapide, avec des pages claires par service, aide à transformer une recherche locale en demande de devis ou en appel.', publics: 'commerces, PME de services, artisans, cabinets et indépendants' },
  { slug: 'nantes', nom: 'Nantes', prep: 'à Nantes', angle: 'À Nantes, comme dans toute grande ville, un site qui présente clairement vos services et votre zone d’intervention est le premier support commercial, avant même le premier échange.', publics: 'commerces, PME, artisans, cabinets, start-up et indépendants' },
];

function pageVille(v) {
  return {
    slug: 'site-internet-' + v.slug,
    ville: v.nom,
    title: 'Création de site internet ' + v.prep + ' | DigitalVerse',
    date: DATE,
    metaDescription:
      'Création et refonte de site internet ' + v.prep + ' : site vitrine dès 400 €, chatbot IA et automatisation. Travail à distance, devis clair avant engagement.',
    lede:
      'Vous cherchez une agence pour créer ou refaire votre site internet ' + v.prep + ' ? DigitalVerse travaille à distance pour les entreprises de toute la France, avec des tarifs publics et un périmètre écrit avant tout engagement.',
    sections: [
      {
        h: 'Un site internet pour les entreprises ' + v.prep.replace('à ', 'de ').replace('de Marseille', 'de Marseille'),
        p: [
          v.angle,
          'Nous travaillons notamment pour des ' + v.publics + '. Nous n’avons pas de bureau ' + v.prep + ' : tout se fait à distance, par écrit et en visio, ce qui nous permet de garder des tarifs lisibles.',
        ],
      },
      {
        h: 'Ce que nous faisons pour vous',
        ul: [
          'Site Vitrine : 400 € en paiement unique, design personnalisé et responsive, formulaire de contact, référencement de base, mise en ligne et hébergement.',
          'Site Business : 1 200 € en paiement unique, pour un site avec fonctionnalités de gestion et fonctionnalités personnalisées définies avec vous.',
          'Refonte de votre site actuel : état des lieux, contenus repris, redirections prévues au périmètre.',
          'Maintenance (dès 80 €/mois), chatbot IA (79 €/mois) et automatisation sur mesure (dès 199 €/mois) si votre activité le demande.',
        ],
      },
      {
        h: 'Être trouvé ' + v.prep + ' sur Google',
        p: [
          'Le référencement de base est inclus à la création : pages structurées, titres et descriptions soignés, fichiers techniques conformes. Pour apparaître sur des recherches du type « ' + 'service + ' + v.nom + ' », il faut ensuite des contenus réguliers et de la notoriété, un travail distinct qui se chiffre séparément. Nous ne promettons aucune position dans Google.',
        ],
      },
      {
        h: 'Comment ça se passe',
        ul: [
          'Vous nous décrivez votre projet via la commande en ligne ou le formulaire de contact, sans paiement à cette étape.',
          'Un assistant de brief recueille vos besoins, puis nous vous confirmons le périmètre et le devis par écrit.',
          'Nous construisons, vous validez, nous mettons en ligne.',
        ],
      },
    ],
    cta: { label: 'Demander un devis', href: '/commander' },
    related: [
      { href: '/creation-site-internet', label: 'Création de site internet' },
      { href: '/refonte-site-internet', label: 'Refonte de site internet' },
      { href: '/guides/prix-site-internet', label: 'Guide : combien coûte un site en 2026' },
    ],
  };
}

export const EXTRA_GUIDES = [...ARTICLES, ...VILLES.map(pageVille)];

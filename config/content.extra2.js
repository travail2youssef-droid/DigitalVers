/* =========================================================================
   CONTENU SEO ADDITIONNEL (2) — articles à intention d'achat.
   Règle d'or : aucune statistique inventée, aucun client cité.
   Les prix sont ceux de la grille publique.
   ========================================================================= */

const DATE = '2026-10-30';

export const EXTRA_GUIDES_2 = [
  {
    slug: 'site-vitrine-ou-site-business',
    title: 'Site vitrine ou site business : comment choisir ?',
    date: DATE,
    metaDescription:
      'Site vitrine à 400 € ou site business à 1 200 € : ce que chacun contient, à qui il convient et les questions à se poser avant de commander.',
    lede:
      'Beaucoup d’entreprises hésitent entre un site simple et un site avec des fonctions de gestion. Choisir trop petit oblige à tout refaire, choisir trop grand fait payer des fonctions inutilisées. Voici comment trancher.',
    sections: [
      {
        h: 'Le site vitrine : se présenter et être contacté',
        p: [
          'Un site vitrine présente votre activité, vos services, vos tarifs ou votre démarche, et donne un moyen simple de vous joindre. Chez DigitalVerse, il est à 400 € en paiement unique : design personnalisé et responsive, formulaire de contact, référencement de base, mise en ligne et hébergement.',
        ],
        ul: [
          'Vous voulez exister en ligne et rassurer un client qui vous cherche après un contact.',
          'Votre prise de contact passe par un formulaire, un appel ou un e-mail.',
          'Vous n’avez pas besoin d’espace client ni de gestion de contenus complexes.',
        ],
      },
      {
        h: 'Le site business : gérer une activité depuis le site',
        p: [
          'Le site business, à 1 200 € en paiement unique, ajoute des fonctionnalités de gestion et des fonctions personnalisées définies avec vous : le périmètre est écrit avant tout engagement.',
        ],
        ul: [
          'Vos clients doivent pouvoir faire une action sur le site (réserver, demander un devis structuré, suivre une commande).',
          'Vous voulez éviter de ressaisir à la main des informations reçues par le site.',
          'Votre activité va évoluer et le site doit suivre, sans repartir de zéro.',
        ],
      },
      {
        h: 'Les questions qui permettent de trancher',
        ul: [
          'Que doit faire un visiteur sur le site, en une phrase ? Si la réponse est « me contacter », la vitrine suffit.',
          'Combien de temps perdez-vous aujourd’hui sur des tâches que le site pourrait faire à votre place ?',
          'Le site doit-il évoluer dans les douze mois ? On peut commencer par une vitrine propre et passer ensuite à plus, plutôt que de payer d’avance ce dont on n’a pas besoin.',
        ],
      },
      {
        h: 'Et pour être trouvé sur Google ?',
        p: [
          'Dans les deux cas, le référencement de base est inclus : pages structurées, titres et descriptions soignés, fichiers techniques conformes. Un travail de contenu régulier se chiffre séparément, et personne ne peut garantir une position dans Google.',
        ],
      },
    ],
    cta: { label: 'Choisir mon offre', href: '/commander' },
    related: [
      { href: '/creation-site-internet', label: 'Création de site internet' },
      { href: '/guides/prix-site-internet', label: 'Guide : combien coûte un site en 2026' },
      { href: '/guides/maintenance-site-internet-prix', label: 'Maintenance : contenu et prix' },
      { href: '/guides/site-internet-paris', label: 'Création de site internet à Paris' },
    ],
  },
  {
    slug: 'maintenance-site-internet-prix',
    title: 'Maintenance de site internet : contenu et prix 2026',
    date: DATE,
    metaDescription:
      'Mises à jour, sauvegardes, corrections, assistance : ce que comprend la maintenance d’un site internet, dès 80 €/mois, et ce qu’il faut exiger au contrat.',
    lede:
      'Un site qu’on ne touche plus finit par poser problème : composants périmés, failles, pages qui cassent, contenus datés. La maintenance évite ces dérives. Voici ce qu’elle doit couvrir et comment la comparer.',
    sections: [
      {
        h: 'Ce que doit couvrir une maintenance',
        ul: [
          'Les mises à jour techniques, pour garder le site à un niveau de sécurité correct.',
          'Des sauvegardes régulières, avec la possibilité réelle de restaurer le site.',
          'La correction des anomalies : lien cassé, formulaire en panne, affichage défectueux.',
          'Une assistance : un interlocuteur et un délai de réponse annoncés par écrit.',
          'Un suivi de base : site en ligne, certificat de sécurité valide, pages qui s’affichent.',
        ],
      },
      {
        h: 'Combien ça coûte',
        p: [
          'Chez DigitalVerse, la maintenance démarre à 80 €/mois, avec deux formules selon la criticité du site, un périmètre défini par contrat et une annulation affichée. Méfiez-vous des offres sans périmètre écrit : « maintenance incluse » ne veut rien dire tant que le contenu n’est pas listé.',
        ],
      },
      {
        h: 'Les pièges à éviter',
        ul: [
          'Pas de délai d’intervention : on vous répond « bientôt ».',
          'Aucune sauvegarde testée : elle existe sur le papier mais personne ne l’a jamais restaurée.',
          'Des modifications de contenu comptées comme maintenance, ou l’inverse : demandez ce qui est inclus et ce qui est facturé à part.',
          'Un engagement long sans possibilité d’arrêter : vérifiez les conditions de résiliation.',
        ],
      },
      {
        h: 'Maintenance et référencement',
        p: [
          'Un site rapide, accessible et sans erreur est plus simple à explorer pour Google. La maintenance protège donc aussi votre visibilité : elle évite qu’une panne ou un lien cassé ne dégrade des pages déjà indexées.',
        ],
      },
    ],
    cta: { label: 'Demander un devis de maintenance', href: '/commander' },
    related: [
      { href: '/maintenance-site-internet', label: 'L’offre de maintenance' },
      { href: '/guides/site-vitrine-ou-site-business', label: 'Site vitrine ou site business' },
      { href: '/guides/refonte-site-seo-checklist', label: 'Refonte de site : la checklist SEO' },
      { href: '/guides/site-internet-lyon', label: 'Création de site internet à Lyon' },
    ],
  },
];

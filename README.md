# DigitalVerse — site de l'agence

Site web complet de l'agence **DigitalVerse** : vitrine premium (français, noir/blanc/rouge),
tunnel de **commande en ligne** (site web ou agent IA), **assistant de brief IA** qui pose les
questions clés et vérifie la compatibilité avec l'offre choisie, puis **gestionnaire de commandes**
avec espace administrateur auto-actualisé et registre des livraisons.

## Démarrage

```bash
npm install
npm start          # http://localhost:3000
```

## Variables d'environnement

| Variable           | Rôle                                                        | Défaut          |
| ------------------ | ----------------------------------------------------------- | --------------- |
| `PORT`             | Port d'écoute du serveur                                    | `3000`          |
| `ADMIN_PASSWORD`   | Admin — **premier** facteur (vérification 1/2)              | `DVenter@ADM`   |
| `ADMIN_PASSWORD_2` | Admin — **second** facteur (vérification 2/2)               | `D.vrs@adsp`    |
| `DATA_DIR`         | Répertoire des données (commandes, réglages)                | `./data`        |
| `SMTP_USER`        | E-mail Gmail d'expédition des notifications                 | *(désactivé)*   |
| `SMTP_PASS`        | Mot de passe d'application Gmail (16 caractères)            | *(désactivé)*   |
| `NOTIFY_EMAIL`     | Destinataire des notifications admin                        | = `SMTP_USER`   |

## Notifications e-mail (Gmail)

Le site envoie automatiquement (quand le SMTP est configuré) :
- **à vous (admin)** : nouvelle commande (avec récap complet + lien admin), brief
  terminé à étudier, nouveau message de contact ;
- **au client** : confirmation de commande **avec son lien privé de brief**
  (indispensable pour qu'il puisse y revenir), accusé de réception du formulaire.

Sans configuration SMTP, tout fonctionne pareil — les envois sont simplement ignorés.

**Configuration Gmail (5 min) :**
1. Sur le compte Google expéditeur : activez la **validation en 2 étapes**
   (`myaccount.google.com` → Sécurité).
2. Créez un **mot de passe d'application** : `myaccount.google.com/apppasswords`
   → nommez-le « DigitalVerse » → Google affiche un code de 16 lettres.
3. Sur Render (Environment) : `SMTP_USER` = votre adresse Gmail, `SMTP_PASS` =
   ce code (les espaces sont acceptés), `NOTIFY_EMAIL` = l'adresse qui doit
   recevoir les alertes (souvent la même).
4. Redéployez, puis passez une fausse commande pour vérifier la réception.

> L'espace `/admin` exige **deux mots de passe à la suite** (pages 1/2 puis 2/2).
> La session dure 12 h ; le jeton intermédiaire expire après 10 min et ne donne
> accès à rien seul. Les deux mots de passe se règlent par variables
> d'environnement — définissez-les chez votre hébergeur plutôt que de garder
> les valeurs par défaut.

## Déploiement sur Render

1. Poussez le dossier `digitalverse/` sur un dépôt **GitHub**.
2. Sur [render.com](https://render.com) : **New + → Blueprint** → choisissez le dépôt.
   Le fichier `render.yaml` fourni configure tout automatiquement :
   - `npm install` puis `npm start`, déploiement automatique à chaque push ;
   - **disque persistant de 1 Go** monté sur `/opt/render/data` (`DATA_DIR`) ;
   - les variables `NODE_ENV`, `ADMIN_PASSWORD`, `ADMIN_PASSWORD_2`.
3. Dans le dashboard Render, onglet **Environment**, renseignez vos deux mots
   de passe (champs marqués « sync:false »). Les valeurs par défaut du code
   restent utilisées sinon.
4. Render attribue un domaine `https://digitalverse-xxxx.onrender.com`. Vous
   pourrez ensuite brancher votre propre domaine (ex. `digitalverse.fr`) en CNAME.

⚠️ **Point crucial — les données.** Les commandes et réglages sont stockés en
fichiers JSON. Sans disque persistant, le système de fichiers de Render est
*éphémère* : tout serait perdu au moindre redéploiement. Le `render.yaml`
fourni monte donc un disque (`dv-data`). Note : le disque et l'absence de mise
en veille nécessitent le **plan Starter** (~7 $/mois) ; le plan gratuit ne
convient que pour une démo (mise en veille au bout de 15 min et données
volatiles).

Alternative plus tard : migrer le stockage vers PostgreSQL (Render en propose
gratuitement) — le code est isolé dans `lib/store.js`, migration simple.

## Utilisation

- **Site vitrine** : `/` — sections Accueil, Services, Nos offres (Sites web + Agents IA),
  Réalisations (projets *concepts* clairement étiquetés), Processus, À propos, FAQ, Contact.
- **Commande client** : `/commander` — choix du type de projet (site / agent IA), de l'offre,
  de l'échéance souhaitée, puis coordonnées (prénom, nom, téléphone, e-mail).
  Le client est ensuite redirigé vers sa **page de brief** (`/chat/...`) avec un **lien unique et privé**
  à conserver pour suivre sa commande.
- **Assistant de brief IA** : pose les questions une par une, s'arrête de lui-même quand le brief
  est suffisamment complet, génère une synthèse et **vérifie la compatibilité** avec l'offre choisie.
  Trois moteurs possibles, réglables dans l'admin (onglet *API de l'agent IA*) :
  - **Assistant intégré** (défaut) : aucun service externe requis.
  - **n8n — workflow Chat Trigger** : branchez votre workflow (Chat Trigger → AI Agent → Simple Memory).
    Dans n8n : activez « Make Chat Publicly Available » sur le Chat Trigger, copiez la **Chat URL**
    (`https://<votre-n8n>/webhook/<id>/chat`) et collez-la dans l'admin, puis **activez le workflow**.
    Le serveur envoie `{ sessionId, action: "sendMessage", chatInput }` avec un `sessionId` unique par
    commande (la Simple Memory conserve le fil par client) et **injecte automatiquement au premier
    message** le contexte DigitalVerse : offre choisie, client, consignes de brief (questions ciblées,
    conclusion `[BRIEF_OK]`) — aucune modification du workflow n'est nécessaire. Une consigne
    personnalisée peut remplacer la consigne automatique via le champ prévu dans l'admin. Si le
    webhook tombe en panne, l'assistant intégré prend le relais en transparent.
  - **API compatible OpenAI** (`/chat/completions`) : endpoint, modèle, clé (jamais exposée au navigateur).
- **Espace administrateur** : `/admin`
  - **Commandes** : liste auto-actualisée (toutes les 8 s) avec statuts, contact client, brief complet
    et transcription de la conversation. Actions : changer le statut, renseigner l'**URL de livraison**
    (site en ligne ou agent déployé), notes internes.
  - **Messages** : demandes reçues via le formulaire de contact.
  - **Registre des livraisons** : commandes « Prête »/« Archivée » avec leurs URL.
  - **API de l'agent IA** : bascule assistant intégré ↔ API externe, avec bouton de test de connexion.
  - Le client voit l'évolution du statut et sa livraison directement sur sa page de brief.

## Données

Les données sont stockées en JSON dans `./data/` (créé automatiquement) : `db.json`
(commandes + messages) et `settings.json` (configuration IA). Sauvegardez ce dossier.

## Configuration du contenu

Les tarifs, offres, FAQ, textes et règles de compatibilité sont centralisés dans
`config/site.config.js`. Modifiez ce seul fichier pour ajuster les prix ou les offres —
site, formulaire de commande et admin se mettent à jour automatiquement.

## Points de transparence (par conception)

- Aucun paiement n'est encaissé en ligne : la commande déclenche l'étude + devis, le règlement
  est confirmé hors site. Pour ajouter un vrai paiement (Stripe etc.), branchez-le dans
  `POST /api/commande` — les clés resteront côté serveur.
- Projets du portfolio = **concepts** (mentionnés comme tels) ; remplacez-les par de vraies
  réalisations dans `config/site.config.js`.
- Mentions légales : champs entre crochets `[…]` à compléter avec les informations officielles.
- TVA / hébergement / domaine / périmètres : toujours renvoyés au devis, rien de fictif n'est promis.

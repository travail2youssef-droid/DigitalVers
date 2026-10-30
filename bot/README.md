# Bot de veille DigitalVerse

Petit processus Node **sans dépendance** qui garde le site réveillé (Render
endort une instance gratuite ~15 min après le dernier trafic) et affiche le
bot en ligne sur Discord, avec alertes dans un salon en cas de coupure.

| Fichier | Rôle |
|---|---|
| `keepalive-bot.mjs` | Le bot : ping de veille + auto-maintien + présence Discord + alertes salon |
| `env.example` | Modèle de config — à copier en `.env` (jamais commité) |

## 1. Inviter le bot sur votre serveur

Le lien que vous avez (avec `scope=applications.commands` seul) **n'ajoute pas
le bot** : il faut la case `bot`. Utilisez celui-ci :

```
https://discord.com/api/oauth2/authorize?client_id=1562786712927600650&permissions=2048&scope=bot%20applications.commands
```

(2048 = « Envoyer des messages », seule permission nécessaire — le bot ne lit rien.)

> Si le portail vous affiche « RPC notifications received », désactivez ce
> switch dans General → « Public Bot » non requis ; l'invitation fonctionne.

## 2. Configurer

```bash
cp bot/.env.example bot/.env
# éditer bot/.env et coller DISCORD_TOKEN=… (et REPORT_CHANNEL_ID=… si voulu)
```

⚠️ **Sécurité** : un token collé dans un chat, un ticket ou une capture d'écran
doit être considéré comme compromis → « Reset Token » dans le portail
développeur Discord (gratuit, 2 secondes, il faut juste remettre le nouveau
dans `.env`). Le *Client Secret* que vous avez partagé sert aux flux OAuth
(conexion via Discord) — inutile ici : pensez aussi à le réinitialiser, et ne
le stockez dans ce dépôt sous aucun prétexte (il est **public**).

## 3. Faire tourner le bot (le point important)

Le bot ne peut veiller sur le site que là où il tourne **24 h/24**. Trois
options, de la plus simple à la plus robuste :

1. **Votre PC** (Windows) : `node bot/keepalive-bot.mjs` — ne tient que si le
   PC reste allumé. Pour un démarrage automatique : Planificateur de tâches →
   « À la connexion » → action = `node` + argument `C:\chemin\DigitalVers\bot\keepalive-bot.mjs`
   (décocher « condition batterie »).
2. **Un petit VPS / machine toujours allumée** : copier le dossier `bot/`,
   `pm2 start keepalive-bot.mjs --name veille` (ou un service systemd).
3. **Un deuxième service Render gratuit** — RECOMMANDÉ, ne dépend pas de ton
   PC. Le bot s'auto-maintient éveillé (il se ping lui-même via
   `RENDER_EXTERNAL_URL`, code déjà inclus) et réveille le site toutes les
   4 min. Création en 5 minutes, voir « Déploiement Render pas à pas » plus
   bas. **En complément, le workflow GitHub Actions déjà en place
   (`.github/workflows/keep-alive.yml`) sert de filet : le ping des 5 min est
   réel mais parfois espacé par GitHub (limitation gratuite) — les deux
   ensemble couvrent le problème.

## Déploiement Render pas à pas (gratuit)

1. render.com → **New +** → **Web Service** → choisis le dépôt `DigitalVers`
   (branche `main`).
2. Nom : `digitalvers-keepalive`. **Build command** : `npm install --omit=dev`.
   **Start command** : `node bot/keepalive-bot.mjs`. **Instance type** : Free.
3. Variables d'environnement du service :
   - `DISCORD_TOKEN` = ton token (celui du portail développeur, après Reset)
   - `REPORT_CHANNEL_ID` = ID du salon des alertes (facultatif)
   - `NODE_VERSION` = `22`
   - `PORT` n'a rien à mettre : Render le fournit tout seul, et
     `RENDER_EXTERNAL_URL` aussi → l'auto-maintien s'active tout seul.
4. **Advanced → Health Check Path** : `/health` (rend le statut consultable).
5. Create Web Service → Deploy (~2 min). Le log doit afficher
   `ping #N → HTTP 200` pour le site et `auto-maintien bot → HTTP 200`.

C'est fini : le site ne dort plus, ton PC n'y est pour rien, et le bot
apparaît en ligne sur Discord. Si un jour le service est lui-même mis en
veille (normalement impossible avec l'auto-maintien), le workflow GitHub
Actions le réveille de toute façon à chaque passage.

## 4. Ce que vous verrez

- En console : un log par ping (`HTTP 200 en 340 ms (ok:12 ko:0)`).
- Sur Discord : le bot « En ligne — Regarde la veille de digitalvers.onrender.com ».
- Dans le salon choisi (si configuré) : message 🔴 quand le site ne répond
  plus, ✅ quand il revient — rien entre les deux, pas de spam.

## Notes de conception

- `intents: 0` : le bot **ne reçoit le contenu d'aucun message** des serveurs ;
  pas besoin d'activer « Message Content Intent ».
- Le ping vise `/robots.txt` (réponse minuscule, ~2 lignes) : il réveille le
  conteneur sans poids côté site.
- Reconnexion gateway avec backoff ; codes d'erreur Discord (4004 token
  invalide, 4013 intents manquants…) espacés à 10 min pour ne pas spammer.
- Le site lui-même n'est pas modifié : ce dossier est indépendant de
  `server.js` et n'entre dans aucun build d'EJS.

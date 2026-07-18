# Déploiement

## Front : Netlify

1. Importez le dépôt GitHub `davidsonvvv-bot/achat-revente` dans Netlify.
2. Netlify détecte `netlify.toml` et exécute `pnpm build`.
3. Ajoutez `NEXT_PUBLIC_POCKETBASE_URL` avec l’URL HTTPS publique de PocketBase, sans `/` final.
4. Redéployez le site.

> La migration `make_local_instance_passwordless` ouvre les données en lecture et écriture sans connexion. Cette configuration est assumée pour ce projet, mais ne convient pas à des données privées ou sensibles.

## Backend : PocketBase

PocketBase ne peut pas être déployé sur Netlify : il doit tourner en continu avec son stockage SQLite et ses fichiers. Hébergez le dossier `pocketbase/` sur un hôte persistant, puis définissez son URL publique dans Netlify.

Les migrations du dossier `pocketbase/pb_migrations/` s’appliquent automatiquement au démarrage. Le dossier `pocketbase/pb_data/` contient les données de production : sauvegardez-le régulièrement et ne le placez jamais dans Git.

# PocketBase local

Ce dossier contient la migration versionnée de l’application. Les données locales (`pb_data`) et le binaire PocketBase ne sont jamais envoyés sur GitHub.

## Premier démarrage

```bash
./pocketbase serve
```

Puis ouvrez http://127.0.0.1:8090/_/ et créez le premier superutilisateur. La migration crée automatiquement les collections `users`, `vehicles`, `repairs`, `costs`, `sales` et `vehicle_photos` au démarrage.

Créez ensuite votre unique compte applicatif dans la collection `app_users` depuis le tableau de bord. Les règles limitent chaque donnée à son propriétaire.

## Règles métier

- Chaque enregistrement fonctionnel possède une relation `owner` vers `app_users`.
- Les règles d’accès PocketBase imposent que cet `owner` corresponde à l’utilisateur authentifié.
- Les relations enfant (`repair`, `cost`, `sale`, `vehicle_photo`) sont supprimées automatiquement quand le véhicule est supprimé.
- Une contrainte unique empêche plus d’une vente par véhicule.

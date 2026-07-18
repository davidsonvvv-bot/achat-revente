# Modèle de données prêt pour PocketBase

La version actuelle persiste les données dans `localStorage` afin de permettre la validation complète du parcours sans serveur. Les types de `lib/types.ts` sont le contrat à conserver lors de l’intégration PocketBase.

| Collection | Champs clés | Relations |
|---|---|---|
| `vehicles` | marque, modèle, version, année, carburant, boîte, kilométrage, date_achat, prix_achat, prix_vente_prevu, immatriculation, vin, vendeur, téléphone, description, notes, statut, created, updated | propriétaire/auth (optionnel) |
| `repairs` | titre, description, date, coût, prestataire, statut, facture | `vehicle` → `vehicles` (requis) |
| `costs` | titre, catégorie, montant, date, commentaire | `vehicle` → `vehicles` (requis) |
| `sales` | date_vente, prix_vente, acheteur, téléphone, kilométrage, commentaire | `vehicle` → `vehicles` (requis, unique) |
| `vehicle_photos` | fichier, ordre | `vehicle` → `vehicles` (requis) |

PocketBase ajoute nativement `id`, `created` et `updated`. Quand l’authentification sera ajoutée, chaque collection portera une relation `owner` vers la collection d’utilisateurs et les règles d’accès seront : `owner = @request.auth.id` pour `list`, `view`, `create`, `update` et `delete`. Les enfants ne peuvent être supprimés que via leur véhicule (suppression en cascade contrôlée côté serveur).

Les montants restent stockés comme nombres. Les valeurs dérivées (`coût total`, bénéfices et marges) ne doivent pas être enregistrées : elles sont calculées par `lib/financials.ts`, unique source de vérité.

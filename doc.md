# Documentation Frontend — OpenDevMada_Annuaire

## Vue d’ensemble
- Frontend statique (HTML/CSS/JS) consommant l’API backend `Backend_api_opendevmada_members/`
- Intégration API centralisée via `assets/js/api.js`
- Pages connectées au backend: `members.html`, `member-detail.html`

## Fichiers ajoutés/modifiés
- Ajout `assets/js/api.js`
  - Client API centralisé (sans dépendance externe)
  - Expose `window.ODMApi` avec:
    - `API_BASE`: URL base API (par défaut `http://localhost:2001/api/opendevmada`)
    - `IMG_BASE`: base d’URL pour les images (`http://localhost:2001/public/`)
    - `fetchMembers()`, `fetchMember(id)`, `imageUrl(path)`
- Ajout `assets/js/app-members.js`
  - Consomme `fetchMembers()` pour afficher la liste réelle des membres dans `members.html`
  - Recherche/filtre côté client sur nom, rôle, localisation
- Ajout `assets/js/app-member-detail.js`
  - Consomme `fetchMember(id)` pour afficher le détail d’un membre dans `member-detail.html`
  - Gère désormais une modale d’édition (email, téléphone, adresse, ville, rôle, statut, mot de passe, photo)
  - Envoie la mise à jour via `POST /api/opendevmada/membre-update/{id}`
- Modification `members.html`
  - Inclusion des scripts: `assets/js/api.js`, `assets/js/app-members.js`
- Modification `member-detail.html`
  - Remplacement des scripts mock par: `assets/js/api.js`, `assets/js/app-member-detail.js`

## Endpoints consommés (côté frontend)
- `GET /api/opendevmada/membres` → liste des membres
- `GET /api/opendevmada/membre/{id}` → détail d’un membre par ID

Pour la liste complète des endpoints backend, voir `Backend_api_opendevmada_members/endpoint.md`.

## Configuration
- Editer `front/assets/js/api.js` si nécessaire:
```
const API_BASE = 'http://localhost:2001/api/opendevmada'
const IMG_BASE = 'http://localhost:2001/public/'
```
- Adapter le port/host selon votre serveur backend
- `IMG_BASE` doit pointer vers un chemin où le serveur backend sert les fichiers statiques (ex: `public/images/...`)

## Pré-requis backend
- Lancer le backend sous Apache/Nginx avec support de `.htaccess` (réécriture vers `index.php`)
- Base de données configurée dans `Backend_api_opendevmada_members/__env.php`
- Le dossier `Backend_api_opendevmada_members/public/` doit exister pour les uploads images (créé automatiquement lors d’un upload)

## Démarrage pour tests locaux
1) Backend
- Configurer la BDD (`__env.php`) et importer `db/opendevmad_db.sql` si nécessaire
- Servir `Backend_api_opendevmada_members/` via Apache (VirtualHost) sur `http://localhost:2001`
- Vérifier un endpoint rapide:
```
curl http://localhost:2001/api/opendevmada/membres
```
2) Frontend
- Servir `OpenDevMada_Annuaire/front/` en statique
  - Option rapide (Python):
```
cd OpenDevMada_Annuaire/front
python3 -m http.server 8080
```
  - Puis ouvrir `http://localhost:8080/members.html`

## Scénarios de test
- Liste des membres
  - Ouvrir `http://localhost:8080/members.html`
  - Attendu: la grille se peuple depuis le backend (noms, rôles, villes)
  - Les filtres Rechercher/Rôle/Localisation fonctionnent côté client
- Détail d’un membre
  - Cliquer sur « Voir le profil » depuis la liste
  - Attendu: détail réel du membre (email, téléphone, ville, image si disponible)
- Création d’un membre
  - Ouvrir `http://localhost:8080/add-member.html`
  - Renseigner au minimum: Prénom, Nom, Email (optionnel), Téléphone, Mot de passe, Image
  - Cliquer « Enregistrer le membre »
  - Attendu: alerte succès puis redirection vers `members.html`, le nouveau membre apparaît dans la liste
  - Vérifier côté réseau que la requête POST `.../membre-create` renvoie `{ "status": "success" }`
- Suppression d’un membre
  - Aller sur une fiche: `http://localhost:8080/member-detail.html?id={id}`
  - Cliquer « Supprimer le membre » puis confirmer
  - Attendu: alerte succès puis redirection vers `members.html`, le membre n’apparaît plus
  - Vérifier côté réseau que la requête DELETE `.../membre-delete/{id}` renvoie `{ "status": "Succès" }`
- Édition d’un membre
  - Aller sur une fiche: `http://localhost:8080/member-detail.html?id={id}`
  - Cliquer « Modifier le profil » pour ouvrir la modale
  - Modifier un ou plusieurs champs puis « Enregistrer »
  - Attendu: alerte succès puis rechargement de la page avec les nouvelles données
  - Vérifier côté réseau que la requête `POST .../membre-update/{id}` renvoie `{ "status": "success" }`
- Images
  - Si `photo_profil` renvoyé par l’API est du type `images/NOM/fichier.jpg`, l’URL finale utilisée est `IMG_BASE + path`, ex: `http://localhost:2001/public/images/NOM/fichier.jpg`
  - Vérifier que le serveur backend sert bien `/public/images/...` (sinon, ajuster la conf serveur ou `IMG_BASE`)

## Notes / Limitations
- Le filtre « Compétence » (`skillFilter`) n’est pas renseigné par le backend (pas de `skills` dans l’API actuelle). Le filtre reste présent mais non corrélé aux données réelles.
- CORS: le backend renvoie `Access-Control-Allow-Origin: *` → OK pour tests locaux
- Authentification/Login/Création/Mise à jour: non intégrés côté frontend dans cette version

## Historique des changements — 2025-09-24
- Intégration API réelle pour `members.html` et `member-detail.html`
- Ajout d’un client API centralisé (`assets/js/api.js`)
- Documentation des étapes de test et de configuration

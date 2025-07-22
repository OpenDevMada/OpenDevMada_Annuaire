# OpenDev Mada - Annuaire des Membres

Annuaire des membres pour la communauté OpenDev Mada. Cette application web permet de lister, visualiser et ajouter des membres à l'annuaire.

## Structure du Projet

```
front/
├── css/
│   └── style.css           # Styles principaux de l'application
├── js/
│   ├── data.js            # Données des membres et fonctions de gestion
│   └── script.js          # Logique JavaScript de l'application
├── images/                # Dossier pour les images des membres
├── index.html             # Page d'accueil
├── members.html           # Liste des membres
├── member-detail.html     # Détails d'un membre
└── add-member.html        # Formulaire d'ajout d'un membre
```

## Fonctionnalités

- **Page d'accueil** : Présentation de l'annuaire et accès rapide aux membres
- **Liste des membres** : Affichage des membres avec possibilité de recherche et filtrage
- **Détails d'un membre** : Vue détaillée avec coordonnées et compétences
- **Ajout de membre** : Formulaire pour ajouter un nouveau membre à l'annuaire

## Technologies Utilisées

- HTML5
- CSS3 (Flexbox, Grid)
- JavaScript Vanilla
- Responsive Design (Mobile First)
- Police Google Roboto
- Icônes Font Awesome

## Installation

1. Cloner le dépôt :
   ```bash
   git clone [URL_DU_REPO]
   cd OpenDevMada_Annuaire/front
   ```

2. Ouvrir `index.html` dans un navigateur web moderne.

## Utilisation

1. **Visualiser les membres** : Cliquez sur "Membres" dans le menu de navigation
2. **Voir les détails** : Cliquez sur "Voir le profil" sur une carte membre
3. **Ajouter un membre** : Cliquez sur "Ajouter un membre" et remplissez le formulaire

## Personnalisation

### Couleurs
Les couleurs principales sont définies dans `css/style.css` via des variables CSS :
```css
:root {
  --primary-color: #0056b3;
  --secondary-color: #003366;
  --background-color: #ffffff;
  --text-color: #333333;
}
```

### Données des Membres
Les données des membres sont stockées dans `js/data.js`. Vous pouvez modifier le tableau `members` pour ajouter ou modifier des membres.

## Compatibilité

- Chrome (dernière version)
- Firefox (dernière version)
- Safari (dernière version)
- Edge (dernière version)
- Mobile: iOS Safari, Chrome for Android

## Licence

Ce projet est sous licence MIT.

# 🌐 Annuaire des Membres – OpenDev Mada

Bienvenue sur le projet **Annuaire des Membres**, développé par l'équipe OpenDev Mada.  
Ce site web vise à fournir une interface claire et responsive pour consulter et gérer les membres d'une organisation.

---

## 📌 Objectifs du Projet

- Créer une interface utilisateur simple, intuitive et professionnelle.
- Permettre aux utilisateurs de :
  - Consulter la liste des membres.
  - Accéder à une fiche détaillée pour chaque membre.
  - Ajouter un nouveau membre via un formulaire.
- Garantir une **navigation fluide** et **responsive** sur tous les appareils.
- Structurer le code pour faciliter une future liaison avec un back-end.

---

## 🧑‍💻 Stack Technique – Front-end

> Pas d'intégration back-end prévue dans cette phase (statique uniquement)

- **HTML5**
- **CSS3** (Sass optionnel)
- **JavaScript Vanilla**
- Responsive design via **media queries**
- Pas de framework obligatoire *(attention : certains membres n’ont pas encore l'habitude)*

---

## 🗂️ Structure des Pages

### 🏠 Page d’accueil
- Présentation courte du projet
- Lien vers la page “Liste des membres”
- Design sobre et pro

### 👥 Page Liste des Membres
- Affichage en grille ou liste
- Pour chaque membre :
  - Nom complet
  - Poste ou fonction
  - (Photo facultative)
- Option simple de tri ou filtre (ex: par département ou niveau)

### 👤 Page Détail Membre
- Informations affichées :
  - Photo agrandie (si dispo)
  - Nom complet
  - Poste / Fonction
  - Email (optionnel)
  - Téléphone (optionnel)
  - Département
- Bouton retour vers la liste

### ➕ Page Formulaire d’Ajout
- Champs obligatoires :
  - Nom complet
  - Poste / Fonction
  - Département
- Champs optionnels :
  - Email
  - Téléphone
  - Upload photo (si possible)
- Bouton “Ajouter”

---

## 🔗 Navigation

- Menu simple (en haut ou latéral) accessible sur mobile et desktop
- Liens vers :
  - Accueil
  - Liste des membres
  - Ajouter un membre

---

## 🎨 Design & Ergonomie

- Palette : **Bleu et blanc**
- Typographie : **Roboto**, **Open Sans**
- Mise en page aérée avec espacements suffisants
- Responsive : compatible **mobile**, **tablette**, **desktop**
- Boutons visibles avec effets au survol

---

## ✅ Contraintes & Bonnes pratiques

- Code **propre, lisible et commenté**
- Testé sur :
  - Chrome
  - Firefox
  - Edge
- Respecter les conventions d’accessibilité basiques
- Penser à une structure de code claire pour une future API/back-end

---

## 📁 Arborescence des fichiers (exemple)
/front
├── index.html
├── membres.html
├── detail.html
├── ajouter.html
├── assets/
│ ├── css/
│ ├── js/
│ └── img/
└── README.md


---

## 📷 Captures attendues

> À ajouter au fur et à mesure de l’avancement dans `/front/screenshots/`

- Accueil
- Liste des membres
- Détail d’un membre
- Formulaire d’ajout

---

## 📅 Planning estimé

- ⏱️ 4 à 6 jours pour le front-end complet
- ✅ Points de revue quotidiens dans le groupe Messenger
- 👁️ Priorité : structure, design responsive, lisibilité du code

---

## 🤝 Contribution

- Cloner le repo :  
  `git clone https://github.com/OpenDevMada/annuaire-membres.git`
- Créer une branche par fonctionnalité :  
  `git checkout -b feature/nom-fonctionnalité`
- Respecter la structure du dossier `/front`
- Push sur GitHub avec messages clairs

---

## 📩 Contact

**OpenDev Mada – Équipe Front-end**  
Pour toute question ou idée : contactez sur le groupe Messenger officiel

---

🚀 *Projet 100% open-source et collaboratif – Merci pour votre contribution !*


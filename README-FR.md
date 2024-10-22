
### **Sujet de TP : Développement d'un jeu minimaliste avec Phaser et BitECS**


#### **Proto : Minimalistic Game**

##### **Objectifs**
1. Mettre en place l'environnement de développement pour un jeu web simple.
2. Comprendre comment utiliser la bibliothèque **Phaser** pour créer des scènes basiques avec des sprites et des interactions.
3. Apprendre les bases de la conception de jeu minimaliste avec des règles simples : un jeu de cartes où le joueur doit deviner la carte gagnante.
4. Utiliser **BitECS** (Entity-Component-System) pour gérer les entités du jeu de manière efficace.

---

#### **Game Design du jeu minimaliste**

##### **Concept**
Le joueur doit choisir une carte parmi plusieurs cartes affichées à l'écran. Une carte est désignée comme la carte gagnante. Si le joueur la sélectionne, il gagne la partie. Sinon, il perd un point de vie. Le jeu se termine si toutes les vies sont perdues.

##### **Gameplay**
- Le joueur choisit une carte parmi une liste.
- S’il choisit la carte gagnante, il gagne.
- Si le joueur sélectionne une carte perdante, il perd un point de vie.
- Lorsque les points de vie atteignent 0, la partie est perdue.

---

#### **Spécifications Techniques**

##### **Entités**
1. **Cartes** : Ce sont les objets interactifs principaux du jeu. Chaque carte peut être soit gagnante, soit perdante.
2. **Vies** : Elles représentent le nombre de tentatives avant que le joueur perde la partie.

##### **Composants**
1. **Position** : Stocke la position des entités dans l'espace de jeu (X et Y).
2. **Graphical Representation** : Composant qui stocke la texture (image) de l'entité.

##### **Systèmes**
1. **Input System** : Gère les interactions du joueur avec les objets (comme le clic sur une carte).
2. **Animation System** : Applique les animations visuelles (par exemple, un tween lorsque la carte est cliquée).
3. **Game Logic System** : Gère la logique du jeu (calculer si la carte cliquée est gagnante ou perdante, gérer les vies).

##### **Scènes**
1. **Preload Scene** : Charge les assets nécessaires pour le jeu (cartes, vies, arrière-plan).
2. **Play Scene** : Gère l’affichage des cartes et la logique de jeu, et surveille les interactions du joueur.

---

### **Laboratoire Technique :**

#### **1. Environnement de développement**

##### **Visual Studio Code**
- Utiliser **Visual Studio Code** (VSC) pour écrire le code.
- Installer l’extension **Live Server** pour lancer un serveur web local permettant de tester le jeu en temps réel. Live Server permet de rafraîchir automatiquement la page à chaque modification du code.

##### **Phaser**
- Inclure Phaser dans le fichier `index.html` via un lien CDN :

```html
<script src="//cdn.jsdelivr.net/npm/phaser@3.85.0/dist/phaser.js"></script>
```

---

#### **2. Étapes du développement**

---

##### **Étape 1 : Initialisation du projet**

- **Organisation du projet :**
  - Créez une structure de dossiers :
    - `assets/` : Contiendra toutes les images (cartes, vies, arrière-plan).
    - `scripts/` : Contiendra les fichiers JavaScript (scènes Phaser, logique de jeu, etc.).
  
- **Configuration de Phaser dans `index.html` :**
  - Voici un code minimal pour démarrer un jeu Phaser avec une scène basique.

```javascript
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload() { }

function create() {
    this.cameras.main.setBackgroundColor('#3498db');  // Définit la couleur d’arrière-plan
}

function update() { }
```

**Explication technique :**
- `Phaser.AUTO` : Phaser choisit automatiquement entre le rendu WebGL et Canvas.
- `preload()` : Cette fonction est appelée avant le lancement de la scène, pour charger les assets (images, sons).
- `create()` : Initialise les objets du jeu (affichage des cartes, vies, etc.).
- `update()` : Cette fonction est appelée à chaque frame et contient la logique du jeu (mouvement des objets, conditions de victoire).

---

##### **Étape 2 : Scène de préchargement (Preload Scene)**

- **Objectifs :**
  - Charger les images et autres ressources graphiques du jeu (cartes, vies).
  - Externaliser le code JavaScript dans des fichiers séparés pour une meilleure organisation.

**Code de `Preloader.js` :**

```javascript
export class Preloader extends Phaser.Scene {
    constructor() {
        super({ key: 'Preloader' });
    }

    preload() {
        this.load.setPath("../assets");
        this.load.image("background", "background.png");
        this.load.image("card-back", "cards/card-back.png");
        this.load.image("card-0", "cards/card-0.png");
        this.load.image("card-1", "cards/card-1.png");
        this.load.image("heart", "ui/heart.png");
    }

    create() {
        this.scene.start("Play");  // Passe directement à la scène de jeu après le préchargement
    }
}
```

**Explication technique :**
- `this.load.setPath("../assets")` : Définit le chemin où se trouvent les fichiers d'assets.
- `this.load.image()` : Charge chaque image utilisée dans le jeu.
- `this.scene.start("Play")` : Lance la scène "Play" après avoir chargé tous les assets.

---

##### **Étape 3 : Création de la scène de jeu (Play Scene)**

- **Objectifs :**
  - Créer et afficher les cartes à l'écran.
  - Ajouter des animations simples (par exemple, un effet de tween lors du clic sur une carte).

**Code de `Play.js` :**

```javascript
export class Play extends Phaser.Scene {
    constructor() {
        super({ key: 'Play' });
    }

    create() {
        // Ajouter l'arrière-plan
        this.add.image(400, 300, 'background');

        // Créer les cartes à l'écran
        for (let i = 0; i < 3; i++) {
            let card = this.add.image(200 + i * 200, 300, 'card-back').setInteractive();
            card.on('pointerdown', () => this.revealCard(card, i));
        }

        // Créer les vies
        this.lives = 3;
        this.add.text(10, 10, `Vies: ${this.lives}`, { font: '32px Arial', fill: '#ffffff' });
    }

    revealCard(card, index) {
        if (index === 1) {  // Supposons que la carte gagnante est à l'index 1
            card.setTexture('card-1');
            this.add.text(400, 100, 'YOU WIN!', { font: '64px Arial', fill: '#00ff00' }).setOrigin(0.5);
        } else {
            card.setTexture('card-0');
            this.lives--;
            if (this.lives <= 0) {
                this.add.text(400, 100, 'GAME OVER', { font: '64px Arial', fill: '#ff0000' }).setOrigin(0.5);
            }
        }
    }
}
```

**Explication technique :**
- `setInteractive()` : Rend l'objet interactif, permettant de réagir aux clics.
- `pointerdown` : Écouteur d'événements qui se déclenche lorsqu’un joueur clique sur une carte.
- `revealCard()` : Change l’image de la carte et met à jour l’état du jeu (victoire, perte de vies).

---

##### **Étape 4 : Ajouter des interactions**

- **Objectifs :**
  - Permettre au joueur d’interagir avec les cartes.
  - Ajouter des animations pour les cartes.

**Ajout de l'animation avec Tween :**

```javascript
const winnerText = this.add.text(400, -100, "YOU WIN", {
    font: "64px Arial", fill: "#ffcc00"
}).setOrigin(0.5);

// Ajout d'un tween pour faire apparaître le texte de manière fluide
this.tweens.add({
    targets: winnerText,
    y: 150,
    duration: 1000,
    ease: 'Bounce'
});
```

**Explication technique :**
- **Tween** : Une animation qui permet de faire évoluer progressivement une propriété (ici, la position `y` du texte).

---

#### **Tutoriel rapide à Phaser**

1. **Scènes** : Phaser divise le jeu en plusieurs scènes (`Preload`, `Play`, etc.). Chaque scène a trois méthodes principales :
   - `preload()` : Charge les ressources.
   - `create()` : Initialise les objets.
   - `update()` : Gère la logique en temps réel.

2. **Animations avec Tween** : Utilisez `this.tweens

.add()` pour créer des animations. Elles peuvent animer des propriétés comme la position, la transparence ou l'échelle des objets.

3. **Input** : Les objets interactifs (comme les cartes) utilisent `setInteractive()` pour détecter les clics ou autres événements.

---

#### **Tutoriel rapide à BitECS**

1. **Introduction à ECS** : L’ECS (Entity-Component-System) sépare les données (composants) de la logique (systèmes). Les entités n’ont que des composants qui stockent des données. Les systèmes appliquent la logique en fonction des composants.

2. **Exemple de base avec BitECS** :

```javascript
import { createWorld, addEntity, addComponent, Types } from 'bitecs';

// Création du monde
const world = createWorld();

// Définition du composant Position
const Position = {
    x: Types.f32,
    y: Types.f32
};

// Création d'une entité avec le composant Position
const entity = addEntity(world);
addComponent(world, Position, entity);

// Système de mise à jour de la position
function updateSystem(world) {
    const entities = world.entities;
    for (let entity of entities) {
        Position.x[entity] += 1;
        Position.y[entity] += 1;
    }
}
```

**Explication technique :**
- **Composants** : Définissent les attributs des entités (ex. : position).
- **Systèmes** : Appliquent une logique (ex. : mise à jour de la position).
  

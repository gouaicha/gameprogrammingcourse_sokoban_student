
# TP : Création d'un jeu avec **Phaser** et **BiteCS** basé sur l'approche **ECS**

## Objectifs pédagogiques
1. Comprendre les bases de **Phaser** et comment il peut être utilisé pour créer un jeu.
2. Apprendre à structurer un jeu autour d'un système **ECS** avec **BiteCS**, en comprenant comment les entités, composants et systèmes interagissent.
3. Travailler sur un projet modulaire et extensible, permettant aux étudiants d'ajouter facilement de nouvelles fonctionnalités et entités.

## Objectif du TP
- Implémenter un système simple de jeu 2D en utilisant le moteur de jeu **Phaser** combiné avec le framework **BiteCS**.
- Le jeu se compose d'une entité "coeur" (Heart) qui est initialisée sur une grille avec une position, une transformation (échelle), et un sprite.

## Étapes du TP

### Étape 1 : Mise en place de l'environnement

#### Point de départ
- **Récupérer le projet** : Clonez le dépôt Git ou téléchargez le fichier compressé du projet.
- **Ouvrir le projet** avec **Visual Studio Code**.
- **Lancer Live Server** pour consulter la page **index.html** sur un navigateur.

#### Organisation du projet
1. **Répertoires** :
    - **assets** : Toutes les ressources du jeu comme des images, polices, et fichiers de configuration.
    - **components** : Contiendra le code des composants ECS.
    - **systems** : Contiendra le code des systèmes ECS.
    - **scenes** : Stockera les différentes scènes du jeu.

### Étape 2 : Réalisation des scènes

Notre jeu se compose de deux scènes : **Preload** et **Play**.

- **Preload** : Chargera les assets du jeu via Phaser.
- **Play** : Créera une entité et l'affichera. Une boucle de jeu tournera pour mettre à jour le jeu (même si, au début, elle ne fera rien).

#### Réalisation de la scène **Preload**

1. Créez un fichier **Preload.js** dans le répertoire `scenes`.
2. Créez une classe **Preload** qui étend la classe **Phaser.Scene** :

```js
export class Preload extends Phaser.Scene {
    constructor() {
        super({ key: 'Preloader' });
    }
    
    preload() {
        this.load.setPath("../assets");
        this.load.image("heart", "ui/heart.png");
    }
    
    create() {
        this.scene.start("Play");
    }
}
```

- **Explications** :
    - La méthode **preload()** charge une image (ici, un coeur).
    - La méthode **create()** permet de lancer la scène **Play**.

#### Réalisation de la scène **Play**

1. Créez un fichier **Play.js** dans le répertoire `scenes`.
2. Créez une classe **Play** qui étend la classe **Phaser.Scene** :

```js
export class Play extends Phaser.Scene {
    constructor() {
        super({ key: 'Play' });
    }

    create() {
        // Code à ajouter plus tard
    }

    update() {
        // Code à ajouter plus tard
    }
}
```

---

### Étape 3 : Création des composants ECS

Nous allons créer les composants suivants pour notre jeu :

1. **Position** : Sert à définir la position 2D d'une entité (`x`, `y`).
2. **Transform** : Gère les transformations 2D (échelle et rotation).
3. **Sprite** : Permet de dessiner une texture sur le plan 2D.

Pour réaliser ces composants, nous allons utiliser la fonction **defineComponent** de la librairie **BiteCS**.

- **components/Position.js** :

```js
import { defineComponent, Types } from '../bitecs.mjs';

export const Position = defineComponent({
    x: Types.f32,
    y: Types.f32
});

export default Position;
```


Nous utilisons `BiteCS` pour définir un composant appelé `Position`. 
Ce composant est utilisé pour stocker les coordonnées x et y d'une entité dans un espace 2D. 

Voici une explication détaillée:

```javascript
import { defineComponent, Types } from '../bitecs.mjs';
```

- `defineComponent` : Cette fonction de BiteCS permet de définir un nouveau composant. Un composant est une structure de données qui contient des attributs (ou propriétés) associés à une entité.
- `Types` : Ce module fournit des types de données pour définir les propriétés des composants. Ici, on utilise `Types.f32` pour indiquer que les propriétés `x` et `y` sont des nombres à virgule flottante 32 bits.

```javascript
export const Position = defineComponent({
    x: Types.f32,
    y: Types.f32
});
```

- `Position` : Le nom du composant qui sera utilisé pour attacher les coordonnées x et y aux entités dans le système ECS.
- `x` et `y` : Ce sont les propriétés définies dans ce composant. Elles représentent respectivement les coordonnées horizontales (x) et verticales (y) dans un espace 2D.
- `Types.f32` : Spécifie que `x` et `y` sont de type float32 (nombre à virgule flottante 32 bits), ce qui permet de représenter des positions avec des décimales.


- **components/Transform.js** :

```js
import { defineComponent, Types } from '../bitecs.mjs';

export const Transform = defineComponent({
    scaleX: Types.f32,
    scaleY: Types.f32,
    rotation: Types.f32,
});

export default Transform;
```

*Commentaire du code :*

Ce code définit un appelé `Transform`, qui est utilisé pour gérer les transformations géométriques appliquées aux entités dans un environnement 2D. Ce composant contient trois propriétés :

```javascript
export const Transform = defineComponent({
    scaleX: Types.f32,
    scaleY: Types.f32,
    rotation: Types.f32,
});
```

- `scaleX` et `scaleY` : Ces propriétés définissent l'échelle de l'entité sur les axes X et Y. Elles permettent d'agrandir ou de réduire la taille de l'entité de manière indépendante selon chaque axe. 
  
- `rotation` : Cette propriété spécifie l'angle de rotation de l'entité en radians. Elle permet de faire pivoter l'entité autour de son point d'origine.


- **components/Sprite.js** :

```js
import { defineComponent, Types } from '../bitecs.mjs';

export const Sprite = defineComponent({
    texture: Types.ui8
});

export default Sprite;
```

Le compostant Spite va définir un attribut `texture` pour indiquer l'index de la texture à utiliser pour dessiner le sprite.

---

### Étape 4 : Réalisation du système pour afficher les sprites

Notre jeu utilise un seul système pour **afficher les sprites**. Ce système s'intéresse aux entités qui possèdent les composants **Position** et **Sprite**.

Nous devons :
- Créer un sprite **Phaser** pour chaque entité correspondante.
- Maintenir une **Map** pour associer chaque entité ECS à l'objet sprite de Phaser.

- **systems/spriteSystem.js** :

```js
import { defineSystem, defineQuery, enterQuery, exitQuery } from '../bitecs.mjs';
import Position from '../components/Position.js';
import Sprite from '../components/Sprite.js';
import Transform from '../components/Transform.js';

export default function createSpriteSystem(scene, textures) {
    const spritesById = new Map();
    const spriteQuery = defineQuery([Position, Sprite]);

    const spriteQueryEnter = enterQuery(spriteQuery);
    const spriteQueryExit = exitQuery(spriteQuery);

    return defineSystem((world) => {
        const entitiesEntered = spriteQueryEnter(world);
        for (let i = 0; i < entitiesEntered.length; ++i) {
            const id = entitiesEntered[i];
            const texId = Sprite.texture[id];
            const texture = textures[texId];
            
            spritesById.set(id, scene.add.sprite(0, 0, texture));
        }

        const entities = spriteQuery(world);
        for (let i = 0; i < entities.length; ++i) {
            const id = entities[i];
            const sprite = spritesById.get(id);
            if (!sprite) continue;

            sprite.x = Position.x[id];
            sprite.y = Position.y[id];
            sprite.setScale(Transform.scaleX[id], Transform.scaleY[id]);
        }

        const entitiesExited = spriteQueryExit(world);
        for (let i = 0; i < entitiesExited.length; ++i) {
            const id = entitiesExited[i];
            spritesById.delete(id);
        }

        return world;
    });
}
```

#### Commentaire du code :

Le système présenté traite les entités ayant les composants **Position**, **Sprite**, et **Transform** en créant et mettant à jour leurs représentations graphiques (sprites) dans la scène Phaser.

##### Importations :

```javascript
import { defineSystem, defineQuery, enterQuery, exitQuery } from '../bitecs.mjs';
import Position from '../components/Position.js';
import Sprite from '../components/Sprite.js';
import Transform from '../components/Transform.js';
```

- **`defineSystem`** : Permet de définir un système qui sera exécuté pour traiter des entités spécifiques dans le monde ECS.
- **`defineQuery`** : Crée une requête qui recherche les entités qui possèdent certains composants.
- **`enterQuery`** : Capture les entités qui viennent d'entrer dans le jeu (celles qui viennent d'acquérir les composants spécifiés).
- **`exitQuery`** : Capture les entités qui quittent le jeu ou perdent les composants spécifiés.

Les composants **Position**, **Sprite**, et **Transform** sont utilisés pour déterminer la position d'une entité, sa texture, et sa transformation visuelle (échelle).

---

##### Définition du système de sprites :

```javascript
export default function createSpriteSystem(scene, textures) {
    const spritesById = new Map();  // Map pour associer chaque entité ECS avec son sprite Phaser.
    const spriteQuery = defineQuery([Position, Sprite]);  // Recherche les entités qui possèdent les composants Position et Sprite.
    
    const spriteQueryEnter = enterQuery(spriteQuery);  // Requête pour capturer les entités nouvellement créées.
    const spriteQueryExit = exitQuery(spriteQuery);    // Requête pour capturer les entités qui ont quitté ou été supprimées.
```

- **`spritesById`** : Utilise une `Map` pour associer chaque entité ECS à un sprite Phaser, permettant de mettre à jour ou de supprimer les sprites associés à ces entités.
- **`spriteQuery`** : La requête permet de sélectionner toutes les entités qui possèdent à la fois les composants **Position** et **Sprite**. C'est ce qui détermine quelles entités doivent être gérées par ce système.
- **`spriteQueryEnter`** et **`spriteQueryExit`** : Ces requêtes capturent les entités qui viennent d'entrer ou de sortir du système, permettant de gérer dynamiquement l'ajout et la suppression des sprites.

---

##### Système principal (fonction `defineSystem`) :

```javascript
    return defineSystem((world) => {
        const entitiesEntered = spriteQueryEnter(world);
        for (let i = 0; i < entitiesEntered.length; ++i) {
            const id = entitiesEntered[i];
            const texId = Sprite.texture[id];  // Récupère l'ID de la texture pour cette entité.
            const texture = textures[texId];   // Trouve la texture associée via l'ID.

            spritesById.set(id, scene.add.sprite(0, 0, texture));  // Crée un sprite Phaser et l'associe à l'entité.
        }
```

- **Création des sprites** : 
    - Lorsque de nouvelles entités entrent dans le jeu (capturées par **`entitiesEntered`**), un sprite est créé pour chacune.
    - Le sprite est ajouté à la scène Phaser via **`scene.add.sprite()`**.
    - L'ID de l'entité est associé au sprite dans la `Map` **`spritesById`** pour assurer une gestion efficace lors des mises à jour suivantes.

---

##### Mise à jour des sprites :

```javascript
        const entities = spriteQuery(world);  // Récupère toutes les entités ayant les composants Position et Sprite.
        for (let i = 0; i < entities.length; ++i) {
            const id = entities[i];
            const sprite = spritesById.get(id);  // Récupère le sprite associé à l'entité.
            if (!sprite) continue;  // Si le sprite n'existe pas (erreur), on passe à l'entité suivante.

            sprite.x = Position.x[id];  // Met à jour la position du sprite en fonction du composant Position.
            sprite.y = Position.y[id];
            sprite.setScale(Transform.scaleX[id], Transform.scaleY[id]);  // Applique l'échelle définie par le composant Transform.
        }
```

- **Mise à jour des sprites** : 
    - Pour chaque entité active qui possède les composants **Position** et **Sprite**, le système met à jour sa position sur l'écran et son échelle à chaque itération de la boucle de jeu.
    - Le composant **Transform** gère la mise à l'échelle des sprites, tandis que **Position** gère leur placement.

---

##### Suppression des sprites :

```javascript
        const entitiesExited = spriteQueryExit(world);
        for (let i = 0; i < entitiesExited.length; ++i) {
            const id = entitiesExited[i];
            spritesById.delete(id);  // Supprime le sprite de la Map lorsque l'entité quitte le jeu.
        }

        return world;  // Retourne l'état actuel du monde ECS.
    });
}
```

- **Suppression des entités** : 
    - Les entités qui quittent le système (capturées par **`spriteQueryExit`**) voient leur sprite supprimé de la **Map** et donc de la scène Phaser.
    - Cela permet de libérer les ressources et de s'assurer que les entités supprimées ne restent pas affichées.

---

##### Synthèse du code :

Ce code implémente un **système de sprites** dans le cadre d'un jeu utilisant la bibliothèque **BiteCS** (Entity Component System) et le moteur de jeu **Phaser**. Le rôle principal de ce système est de :
1. **Créer** des sprites dans la scène Phaser pour les entités qui possèdent à la fois un composant **Position** (pour les coordonnées) et un composant **Sprite** (pour la texture).
2. **Mettre à jour** la position et l'échelle de chaque sprite à chaque itération de la boucle de jeu en fonction des composants ECS associés à l'entité.
3. **Supprimer** les sprites des entités qui ont quitté le système (ou qui ont été supprimées), afin de maintenir la synchronisation entre le monde ECS et l'affichage graphique de Phaser.


---

### Étape 5 : Finalisation des scènes

1. **Ajouter une fonction `heartEntityFactory` dans `scenes/Play.js`** :

```js
import { addEntity, addComponent } from '../bitecs.mjs';
import Position from '../components/Position.js';
import Sprite from '../components/Sprite.js';
import Transform from '../components/Transform.js';

heartEntityFactory() {
    const heartEntity = addEntity(this.world);
    addComponent(this.world, Position, heartEntity);
    addComponent(this.world, Sprite, heartEntity);
    addComponent(this.world, Transform, heartEntity);
    Position.x[heartEntity] = 280;
    Position.y[heartEntity] = 250;
    Transform.scaleX[heartEntity] = 0.2;
    Transform.scaleY[heartEntity] = 0.2;
    Sprite.texture[heartEntity] = 0; // Correspond à 'heart'
    return heartEntity;
}
```

#### Synthèse du code :
Ce code définit une factory nommée `heartEntityFactory()` qui crée et configure une entité ECS représentant un coeur dans un jeu. 

Cette entité est composée de plusieurs composants ECS :

- Un composant de position pour définir sa position dans l'espace 2D.
- Un composant de transformation pour gérer son échelle (ici réduite à 0.2).
- Un composant de sprite qui définit la texture de l'entité (heart).

L'entité est ajoutée au monde ECS avec ces composants, puis positionnée et configurée. Elle est renvoyée à la fin de la fonction pour être utilisée dans le jeu.


2. **Modifier la fonction `create()`** :

```js
create() {
    const { width, height } = this.scale;
    this.world = createWorld();
    const heart = this.heartEntityFactory();
    this.spriteSystem = createSpriteSystem(this, ['heart']);
}
```

3. **Modifier la fonction `update()`** :

```js
update(t, dt) {
    this.spriteSystem(this.world);
}
```

---

### Étape 6 : Observer le résultat

Si vous utilisez Visual Studio Code, faites un clic droit sur le fichier index.html dans l'explorateur de fichiers, puis sélectionnez "Open with Live Server". 

Cela ouvrira votre projet dans un navigateur web, où vous pourrez visualiser et tester le jeu en temps réel. 

Assurez-vous que Live Server est installé comme extension dans votre éditeur.


## Conclusion

Avec ce TP, vous aurez appris à :
- Créer un projet de jeu avec **Phaser** et **BiteCS**.
- Utiliser un système ECS pour organiser les entités, composants, et systèmes de manière modulaire.
- Manipuler des sprites et appliquer des transformations dans un jeu 2D.

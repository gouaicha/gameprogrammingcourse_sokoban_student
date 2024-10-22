### **(Pre) Lab Session : Developing a Minimalistic Game with Phaser and BitECS**

#### **Prototype: Minimalistic Game**

##### **Objectives**
1. Set up the development environment for a simple web game.
2. Understand how to use the **Phaser** library to create basic scenes with sprites and interactions.
3. Learn the fundamentals of minimalistic game design with simple rules: a card game where the player must guess the winning card.
4. Use **BitECS** (Entity-Component-System) to efficiently manage the game entities.

---

#### **Game Design for the Minimalistic Game**

##### **Concept**
The player must choose a card from several displayed on the screen. One card is designated as the winning card. If the player selects it, they win the game. Otherwise, they lose a life. The game ends if all lives are lost.

##### **Gameplay**
- The player selects a card from a list.
- If they choose the winning card, they win.
- If they select a losing card, they lose one life.
- When lives reach 0, the game is lost.

---

#### **Technical Specifications**

##### **Entities**
1. **Cards**: These are the main interactive objects in the game. Each card can either be a winning or a losing card.
2. **Lives**: Represent the number of attempts before the player loses the game.

##### **Components**
1. **Position**: Stores the position of entities in the game space (X and Y coordinates).
2. **Graphical Representation**: A component that stores the texture (image) of the entity.

##### **Systems**
1. **Input System**: Handles the player's interactions with objects (such as clicking on a card).
2. **Animation System**: Applies visual animations (for example, a tween when a card is clicked).
3. **Game Logic System**: Manages game logic (determining if the clicked card is a winner or loser, managing lives).

##### **Scenes**
1. **Preload Scene**: Loads the necessary assets for the game (cards, lives, background).
2. **Play Scene**: Manages the display of cards, game logic, and monitors player interactions.

---

### **Technical Lab:**

#### **1. Development Environment**

##### **Visual Studio Code**
- Use **Visual Studio Code** (VSC) to write the code.
- Install the **Live Server** extension to run a local web server for testing the game in real-time. Live Server automatically refreshes the page whenever the code is modified.

##### **Phaser**
- Include Phaser in the `index.html` file via a CDN link:

```html
<script src="//cdn.jsdelivr.net/npm/phaser@3.85.0/dist/phaser.js"></script>
```

---

#### **2. Development Steps**

---

##### **Step 1: Project Initialization**

- **Project Organization**:
  - Create a folder structure:
    - `assets/`: Will contain all images (cards, lives, background).
    - `scripts/`: Will contain JavaScript files (Phaser scenes, game logic, etc.).
  
- **Phaser Setup in `index.html`**:
  - Below is a minimal setup to start a Phaser game with a basic scene.

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
    this.cameras.main.setBackgroundColor('#3498db');  // Sets the background color
}

function update() { }
```

**Technical Explanation**:
- `Phaser.AUTO`: Phaser automatically chooses between WebGL and Canvas rendering.
- `preload()`: This function is called before the scene starts to load assets (images, sounds).
- `create()`: Initializes the game objects (displaying cards, lives, etc.).
- `update()`: This function is called every frame and contains the game logic (object movement, victory conditions).

---

##### **Step 2: Preload Scene**

- **Objectives**:
  - Load the images and other graphical assets for the game (cards, lives).
  - Externalize JavaScript code into separate files for better organization.

**Code for `Preloader.js`**:

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
        this.scene.start("Play");  // Move to the Play scene after preloading
    }
}
```

**Technical Explanation**:
- `this.load.setPath("../assets")`: Sets the path to where the asset files are located.
- `this.load.image()`: Loads each image used in the game.
- `this.scene.start("Play")`: Starts the "Play" scene after all assets are loaded.

---

##### **Step 3: Creating the Play Scene**

- **Objectives**:
  - Create and display the cards on the screen.
  - Add simple animations (for example, a tween effect when a card is clicked).

**Code for `Play.js`**:

```javascript
export class Play extends Phaser.Scene {
    constructor() {
        super({ key: 'Play' });
    }

    create() {
        // Add background
        this.add.image(400, 300, 'background');

        // Create cards on the screen
        for (let i = 0; i < 3; i++) {
            let card = this.add.image(200 + i * 200, 300, 'card-back').setInteractive();
            card.on('pointerdown', () => this.revealCard(card, i));
        }

        // Create lives
        this.lives = 3;
        this.add.text(10, 10, `Lives: ${this.lives}`, { font: '32px Arial', fill: '#ffffff' });
    }

    revealCard(card, index) {
        if (index === 1) {  // Let's assume the winning card is at index 1
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

**Technical Explanation**:
- `setInteractive()`: Makes the object interactive, allowing it to respond to clicks.
- `pointerdown`: Event listener triggered when the player clicks on a card.
- `revealCard()`: Changes the card’s image and updates the game state (win or lose lives).

---

##### **Step 4: Adding Interactions**

- **Objectives**:
  - Allow the player to interact with the cards.
  - Add animations to the cards.

**Adding Animation with Tween**:

```javascript
const winnerText = this.add.text(400, -100, "YOU WIN", {
    font: "64px Arial", fill: "#ffcc00"
}).setOrigin(0.5);

// Adding a tween to smoothly bring the text onto the screen
this.tweens.add({
    targets: winnerText,
    y: 150,
    duration: 1000,
    ease: 'Bounce'
});
```

**Technical Explanation**:
- **Tween**: An animation that smoothly changes a property over time (here, the `y` position of the text).

---

#### **Quick Tutorial for Phaser**

1. **Scenes**: Phaser divides the game into multiple scenes (`Preload`, `Play`, etc.). Each scene has three main methods:
   - `preload()`: Loads resources.
   - `create()`: Initializes objects.
   - `update()`: Manages real-time logic.

2. **Animations with Tween**: Use `this.tweens.add()` to create animations. These can animate properties like position, transparency, or scale.

3. **Input**: Interactive objects (like cards) use `setInteractive()` to detect clicks or other events.

---

#### **Quick Tutorial for BitECS**

1. **Introduction to ECS**: The ECS (Entity-Component-System) pattern separates data (components) from logic (systems). Entities only have components that store data, while systems apply the game logic.

2. **Basic Example with BitECS**:

```javascript
import { createWorld, addEntity, addComponent, Types } from 'bitecs';

// Create the world
const world = createWorld();

// Define the Position component
const Position = {
    x: Types.f32,
    y: Types.f32
};

// Create an entity with the Position component
const entity = addEntity(world);
addComponent(world, Position, entity);

// Update system to modify position
function updateSystem(world) {
    const entities = world.entities;
    for (let entity of entities) {
        Position.x[entity] += 1;
        Position.y[entity] += 1;
    }
}
```

**Technical Explanation**:

- Components: Define the attributes of entities (e.g., position).
- Systems: Apply logic (e.g., updating the position).

Here is the translation of the provided text into English:

---

# Lab: Creating a game with **Phaser** and **BiteCS** based on the **ECS** approach

## Learning Objectives
1. Understand the basics of **Phaser** and how it can be used to create a game.
2. Learn how to structure a game around an **ECS** system with **BiteCS**, understanding how entities, components, and systems interact.
3. Work on a modular and extensible project, allowing students to easily add new features and entities.

## Lab Objective
- Implement a simple 2D game system using the **Phaser** game engine combined with the **BiteCS** framework.
- The game consists of a "heart" entity, which is initialized on a grid with a position, transformation (scale), and sprite.

## Lab Steps

### Step 1: Setting up the environment

#### Starting point
- **Get the project**: Clone the Git repository or download the compressed project file.
- **Open the project** with **Visual Studio Code**.
- **Run Live Server** to view the **index.html** page in a browser.

#### Project organization
1. **Directories**:
    - **assets**: All game resources like images, fonts, and configuration files.
    - **components**: Contains the ECS component code.
    - **systems**: Contains the ECS system code.
    - **scenes**: Stores the different game scenes.

### Step 2: Creating the scenes

Our game consists of two scenes: **Preload** and **Play**.

- **Preload**: Loads the game assets via Phaser.
- **Play**: Creates an entity and displays it. A game loop will run to update the game (even though it will initially do nothing).

#### Creating the **Preload** scene

1. Create a **Preload.js** file in the `scenes` directory.
2. Create a **Preload** class that extends **Phaser.Scene**:

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

- **Explanation**:
    - The **preload()** method loads an image (in this case, a heart).
    - The **create()** method starts the **Play** scene.

#### Creating the **Play** scene

1. Create a **Play.js** file in the `scenes` directory.
2. Create a **Play** class that extends **Phaser.Scene**:

```js
export class Play extends Phaser.Scene {
    constructor() {
        super({ key: 'Play' });
    }

    create() {
        // Code to be added later
    }

    update() {
        // Code to be added later
    }
}
```

---

### Step 3: Creating ECS components

We will create the following components for our game:

1. **Position**: Used to define the 2D position of an entity (`x`, `y`).
2. **Transform**: Handles 2D transformations (scale and rotation).
3. **Sprite**: Allows drawing a texture on the 2D plane.

To implement these components, we will use the **defineComponent** function from the **BiteCS** library.

- **components/Position.js**:

```js
import { defineComponent, Types } from '../bitecs.mjs';

export const Position = defineComponent({
    x: Types.f32,
    y: Types.f32
});

export default Position;
```

We use `BiteCS` to define a component called `Position`. This component is used to store the `x` and `y` coordinates of an entity in 2D space.

- **components/Transform.js**:

```js
import { defineComponent, Types } from '../bitecs.mjs';

export const Transform = defineComponent({
    scaleX: Types.f32,
    scaleY: Types.f32,
    rotation: Types.f32,
});

export default Transform;
```

*Code Explanation*:

This code defines a `Transform` component, which is used to handle the geometric transformations applied to entities in a 2D environment. It contains three properties:

- **scaleX** and **scaleY**: Define the entity's scale along the X and Y axes, allowing independent resizing on each axis.
- **rotation**: Specifies the entity's rotation angle in radians, allowing it to rotate around its origin.

- **components/Sprite.js**:

```js
import { defineComponent, Types } from '../bitecs.mjs';

export const Sprite = defineComponent({
    texture: Types.ui8
});

export default Sprite;
```

The **Sprite** component defines a `texture` attribute, indicating the index of the texture to use for drawing the sprite.

---

### Step 4: Implementing the sprite rendering system

Our game uses a single system to **render sprites**. This system targets entities with the **Position** and **Sprite** components.

We need to:
- Create a **Phaser** sprite for each corresponding entity.
- Maintain a **Map** to link each ECS entity to its corresponding Phaser sprite.

- **systems/spriteSystem.js**:

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

---

### Step 5: Finalizing the scenes

1. **Add a `heartEntityFactory` function in `scenes/Play.js`**:

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
    Sprite.texture[heartEntity] = 0; // Corresponds to 'heart'
    return heartEntity;
}
```

2. **Modify the `create()` function**:

```js
create() {
    const { width, height } = this.scale;
    this.world = createWorld();

    const heart = this.heartEntityFactory();
    this.spriteSystem = createSpriteSystem(this, ['heart']);
}
```

3. **Modify the `update()` function**:

```js
update(t, dt) {
    this.spriteSystem(this.world);
}
```

---

### Step 6: Viewing the result

If you are using Visual Studio Code, right-click on the **index.html** file in the file explorer, then select "Open with Live Server."

This will open your project in a web browser, where you can view and test the game in real time.

Make sure that the Live Server extension is installed in your editor.

---

## Conclusion

With this lab, you will have learned to:
- Create a game project with **Phaser** and **BiteCS**.
- Use an ECS system to organize entities, components, and systems in a modular way.
- Manipulate sprites and apply transformations in a 2D game.


# gameprogrammingcourse_step1_student
# Lab: Navigating through scenes in a Phaser game

## Learning Objectives

1. Create a navigation plan between scenes in a game.
2. Prepare a specific scene for the game.

## Objective Definition

- Manage inputs with Phaser.
- Launch scenes in Phaser.
- We aim to create the following navigation plan:
  - The first scene is `Bootloader`.
  - Once resources are loaded, `Bootloader` moves to `Splash`.
  - If the `Start` button is clicked, `Splash` moves to `Transition`.
  - `Transition` displays a message, then moves to `Game`.
  - `Game` allows moving to `Credits` if the `X` key is pressed.
  - `Credits` allows returning to `Splash` if the `X` key is pressed.

![Scene Navigation](diagram1.png)

---

## Lab Steps

### Step 1: Starting point

1. **Get the project** for step 2, either via Git or from a compressed file.
2. **Open the project** using **Visual Studio Code**.
3. **Run Live Server** to view the **index.html** page in a browser.

---

### Step 2: Check the `main.js` file

- Notice that all the game scenes are imported and declared in the Phaser configuration:

```javascript
...
scene: [Bootloader, Splash, Transition, Game, Credit]
...
```

Your goal is to implement the `Game` scene, which is located in the `scenes/game.js` file.

---

### Step 3: Implementing the **Game** Scene

- The other game scenes have already been implemented.
- Your task is to **create the Game scene**.
- You can refer to the other scenes for guidance.

#### 1. **Initialization**

- To use the keyboard and navigation keys (arrow keys), we need to create the **cursor keys**.
- In the **`init()`** method, add the following code:

```javascript
...
this.cursors = this.input.keyboard.createCursorKeys();
...
```

This code creates a set of control keys that detect the keyboard’s arrow keys (up, down, left, right). This allows the player to move a character or navigate a scene using the arrow keys.

*Detailed Explanation:*

- `this.input.keyboard.createCursorKeys()`: This Phaser method creates an object that contains references to the arrow keys (up, down, left, right).
- `this.cursors`: The `cursors` variable stores the created object. It contains properties such as `this.cursors.up`, `this.cursors.down`, `this.cursors.left`, and `this.cursors.right`, which allow checking the state of the arrow keys.

#### 2. **The `create()` method**

- **Change the background**:
  - We will change the scene background color:

```javascript
...
this.cameras.main.setBackgroundColor(0x3c97a6);
...
```

- **Add a control key**:
  - To add a keyboard control key, we need to declare it in the **Phaser** system. Declare the **X** key as follows:

```javascript
...
this.X = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
...
```

  - It is recommended to do this in an auxiliary function `addExit()`, then call this function in **`create()`**:

```javascript
addExit() {
    this.X = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
}

create() {
    ...
    this.addExit();
    ...
}
```

- **Display text**:
  - Check the **Credit** scene to see how to display text to the user and invite them to press a key to exit the scene.
  - You can use the following code to display text:

```javascript
this.add.text(100, 100, 'Press X to go to Credits', 
                { font: '24px Arial', fill: '#ffffff' }
             );
```

---

### Step 4: The `update()` method

- This method is called **every game cycle**.
- We will check the state of the **X** key.
- If the key is pressed, we will transition to the **Credit** scene:

```javascript
update() {
    if (Phaser.Input.Keyboard.JustDown(this.X)) {
        this.scene.start("Credit");
    }
}
```

---

## Summary

In this step, you have learned how to:

- Create a Phaser scene and add keyboard controls.
- Manage transitions between different game scenes using input-based conditions.
- Modify the display and personalize a scene with text and interactions.

The next involves creating a simple gameplay mechanic for our game.
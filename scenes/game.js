import {
	createWorld,
	addEntity,
	addComponent,
} from '../bitecs.mjs'

import createInputSystem from '../systems/inputSystem.js'
import createSpriteSystem from '../systems/spriteSystem.js'
import createMovementSystem from '../systems/movementSystem.js'
import createGameOverSystem from '../systems/gameOverSystem.js'

import { PlayerFactory } from '../entities/player.js'
import { ExitFactory } from '../entities/exit.js'
import { BlocFactory } from '../entities/bloc.js'



export class Game extends Phaser.Scene
{

     
  
    constructor ()
    {
        super({
            key: 'Game'
        });
    }

    init (data)
    {
        this.cursors = this.input.keyboard.createCursorKeys()
        this.name = data.name;
        this.number = data.number || 0;
    }

    preload()
    {
    if(!this.textures.exists('redSquare')){
    this.textures.createCanvas('redSquare', 32, 32);
        const canvasTexture = this.textures.get('redSquare').getSourceImage();
        const ctx = canvasTexture.getContext('2d');
        ctx.fillStyle = '#ff0000';  // Rouge
        ctx.fillRect(0, 0, 32, 32);  // Remplir la texture avec un carré rouge
        this.textures.get('redSquare').refresh();
    }
    if(!this.textures.exists('greenSquare')){
        this.textures.createCanvas('greenSquare', 32, 32);
        const canvasTexture2 = this.textures.get('greenSquare').getSourceImage();
        const ctx2 = canvasTexture2.getContext('2d');
        ctx2.fillStyle = '#00ff00';  // Rouge
        ctx2.fillRect(0, 0, 32, 32);  // Remplir la texture avec un carré rouge
        this.textures.get('greenSquare').refresh();
    }    
     
    if(!this.textures.exists('greySquare')){
        this.textures.createCanvas('greySquare', 32, 32);
        const canvasTexture2 = this.textures.get('greySquare').getSourceImage();
        const ctx2 = canvasTexture2.getContext('2d');
        ctx2.fillStyle = '#4B4B4B';  // dark grey
        ctx2.fillRect(0, 0, 32, 32);  // Remplir la texture avec un carré rouge
        this.textures.get('greySquare').refresh();
    }

    }
    

    createGameState(levelData)
    {
        let gridWidth = levelData.stage.grid.width
        let gridHeight = levelData.stage.grid.height
        let matrix = [];
        for (let i = 0; i < gridWidth; i++) {
            matrix[i] = [];  // Créer une nouvelle ligne
            for (let j = 0; j < gridHeight; j++) {
                matrix[i][j] = 0;  // Initialiser chaque cellule à 0
            }
        }

        return matrix;

    }
    
    
    
    
    
    create() 
    {
        //Level Data
        this.loadGameData()
        
        //Graphical Configuration
        this.renderingConfig()
        
        //Inputs Config.
        this.inputsConfig()
        
        //Game State Config
        this.gameStateConfig()
        
        //ECS Config
        this.ecsConfig()
        // Game Level Config
        this.gameLevelConfig()
        //
        
        //HUD Config
        this.hudConfig()
    }

    hudConfig() {
        this.addMoves()
        this.showTexts()
    }

    gameLevelConfig() {
        this.addMap()
    }

    //NEW
    ecsConfig() {
        this.world = createWorld()
        this.spriteSystem = createSpriteSystem(this, ['redSquare', 'greenSquare','greySquare'])
        this.inputSystem = createInputSystem(this)
        this.movementSystem = createMovementSystem(this)
        this.gameOverSystem = createGameOverSystem(this)
        this.playerFactory = new PlayerFactory(this.world)
        this.exitFactory = new ExitFactory(this.world)
        //NEW
        this.blocFactory = new BlocFactory(this.world);
    }

    gameStateConfig() {
        this.gameState = {}
        this.gameState.grid = this.createGameState(this.levelData)
        this.solved = false
        this.gameOver = false
        this.finishing = false
    }

    inputsConfig() {
        this.input.mouse.disableContextMenu()
        this.addPointer()
        this.addRetry()
        this.addExit()
    }

    renderingConfig() {
        this.cellWidth = 32
        this.cellHeight = 32
        this.width = this.sys.game.config.width
        this.height = this.sys.game.config.height
        this.gridWidthPx = this.levelData.stage.grid.width * this.cellWidth
        this.gridHeightPx = this.levelData.stage.grid.height * this.cellHeight
        this.gridOriginX = (this.width - (this.gridWidthPx)) / 2
        this.gridOriginY = (this.height - (this.gridHeightPx)) / 2
        this.center_width = this.width / 2
        this.center_height = this.height / 2
        this.cameras.main.setBackgroundColor(0x000000)
    }

    loadGameData()
    {
        
        this.levelData = this.cache.json.get(`levelData${this.number}`)
        if(! this.levelData )
        {
            this.scene.start("Splash");
        }
    }

    addRetry() {
            this.R = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    }

    addExit() {
            this.X = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        }

    addMoves() {
            this.movesText = this.add
            .bitmapText(this.center_width, 32, "mario", "0", 30)
            .setOrigin(0.5)
            .setTint(0xffe085)
            .setDropShadow(3, 4, 0x75b947, 0.7);
            this.totalMoves = 0;
            }



    // NEW        
    addMap(){
            //add the background sprite

            this.gameBackground = this.add.image(
                this.center_width,
                this.center_height,
                'game-background'         // Nom de l'image
            ).setDisplaySize(this.width, this.height);;
            //add the plate sprite
            this.frameBackground = this.add.image(
                this.center_width - this.cellWidth/2, //this.gridOriginX,  // Centrer l'image en X
                this.center_height- this.cellHeight/2, // Centrer l'image en Y
                'floor'         // Nom de l'image
            );
    
            // Ajuster la taille de l'image si nécessaire
            this.frameBackground.setDisplaySize(this.gridWidthPx, this.gridHeightPx);
            this.exit = this.exitFactory.create(this.levelData.stage.exit.x,this.levelData.stage.exit.y);
            this.player = this.playerFactory.create(this.levelData.player.position.x,this.levelData.player.position.y);
            
            //NEW
            // iterate over all the blocks
            // create their entities

            this.levelData.stage.blocks.forEach(
                (bloc) => {
                    let eid = this.blocFactory.create(bloc.position.x,bloc.position.y)
                    this.gameState.grid[bloc.position.x][bloc.position.y] = eid
                }
            )
            }

        showTexts() 
        {
                const texts = [
                "Push with WASD/Arrows",
                "Move to the exit",
                "[r] to retry",
                "[x] to exit",
                ];
                texts.forEach((text, i) => {
                this.add
                .bitmapText(this.center_width, 425 + 35 * i, "mario", text, 15)
                .setOrigin(0.5)
                .setTint(0xffe066)
                .setDropShadow(1, 2, 0xbf2522, 0.7);
                });
        }
    
                addPointer() {
                    this.pointer = this.input.activePointer;
                    this.input.mouse.disableContextMenu();
                    }

    
    update(t, dt) {
		// run each system in desired order
		if(!this.gameOver)
        {
        if (Phaser.Input.Keyboard.JustDown(this.R)) {
            console.log("restat");
            this.restartScene();
        }
        if (Phaser.Input.Keyboard.JustDown(this.X)) {
            this.scene.start("Splash");
        }

        this.inputSystem(this.world)
        this.movementSystem(this.world)
        this.spriteSystem(this.world)
        this.gameOverSystem(this.world)
        
        }
        else 
        { if(! this.finishing)
        {
            this.finishScene();
            this.finishing = true;
        }
        }
	}

    restartScene() {
        this.scene.start("Game", {
        name: "STAGE",
        number: this.number,
        });
        }

    updateMoves() 
    {
            this.totalMoves++;
            this.movesText.setText(this.totalMoves);
            this.tweens.add({
            targets: [this.timerText],
            duration: 200,
            alpha: { from: 0.6, to: 1 },
            repeat: -1,
            });
    }



    getSceneCoordinateFromGridCoordinate(x,y)
    {
        return [(x*this.cellWidth)+this.gridOriginX,(y*this.cellHeight)+this.gridOriginY]
    }

    finishScene(){
        this.winText = this.add
        .bitmapText(this.center_width, -100, "mario", "STAGE CLEARED!", 30)
        .setOrigin(0.5)
        .setTint(0xffe066)
        .setDropShadow(2, 3, 0x75b947, 0.7);
        
        this.tweens.add({
        targets: this.winText,
        duration: 500,
        y: { from: this.winText.y, to: this.center_height },
        });
        
        this.tweens.add({
        targets: [this.winText, this.movesText],
        duration: 100,
        scale: { from: 1, to: 1.1 },
        repeat: -1,
        yoyo: true,
        });
        
        //NEW
        this.time.delayedCall(
        2000,
        () => {
        this.scene.finishing = false;
        this.scene.start("Transition", {
        name: "STAGE",
        number: this.number + 1, //NEW
        });
        },
        null,
        this
        );
        //
    }
}
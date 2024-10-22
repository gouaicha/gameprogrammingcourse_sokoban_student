import { createCard } from "./createCard.js";

export class Play extends Phaser.Scene
{
    // All cards names
    cardNames = ["card-0", "card-1"];
    cards = [];

    // -- BEGIN NEW
    // Can play the game
    canMove = false;
    // Game variables
    lives = 0;
     // Grid configuration
     gridConfiguration = {
        x: 113,
        y: 200,
        paddingX: 50,
        paddingY: 50
    }
    // --- END NEW

    constructor ()
    {
        super({
            key: 'Play'
        });
    }

    init ()
    {
        // Fadein camera
        this.cameras.main.fadeIn(500);
        this.lives = 1;
    }

    create ()
    {
        //NEW.B
         // Background image
         this.add.image(this.gridConfiguration.x - 150, this.gridConfiguration.y - 200, "background").setOrigin(0).setScale(0.6);
        //NEW.E

        const titleText = this.add.text(this.sys.game.scale.width / 2, this.sys.game.scale.height / 2,
            "Minimalist Game\nClick to Play",
            { align: "center", strokeThickness: 4, fontSize: 40, fontStyle: "bold", color: "#8c7ae6" }
        )
            .setOrigin(.5)
            .setDepth(3)
            .setInteractive();
        
        this.add.tween({
            targets: titleText,
            duration: 800,
            ease: (value) => (value > .8),
            alpha: 0,
            repeat: -1,
            yoyo: true,
        });

        // Text Events
        titleText.on(Phaser.Input.Events.POINTER_OVER, () => {
            titleText.setColor("#9c88ff");
            this.input.setDefaultCursor("pointer");
        });
        titleText.on(Phaser.Input.Events.POINTER_OUT, () => {
            titleText.setColor("#8c7ae6");
            this.input.setDefaultCursor("default");
        });


        //NEW.B

        titleText.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.add.tween({
                targets: titleText,
                ease: Phaser.Math.Easing.Bounce.InOut,
                y: -1000,
                onComplete: () => {
                    this.startGame();
                }
            })
        });

        //NEW.E
        
    }

    restartGame ()
    {
        this.cameras.main.fadeOut(200 * this.cards.length);
        //NEW.B
        this.cards.reverse().map((card, index) => {
            this.add.tween({
                targets: card.gameObject,
                duration: 500,
                y: 1000,
                delay: index * 100,
                onComplete: () => {
                    card.gameObject.destroy();
                }
            })
        });

        this.time.addEvent({
            delay: 200 * this.cards.length,
            callback: () => {
                this.cards = [];
                this.canMove = false;
                this.scene.restart();
            }
        })

        //NEW.E
    }

    createHearts ()
    {
        return Array.from(new Array(this.lives)).map((el, index) => {
            const heart = this.add.image(this.sys.game.scale.width + 1000, 40, "heart")
                .setScale(.1)

            this.add.tween({
                targets: heart,
                ease: Phaser.Math.Easing.Expo.InOut,
                duration: 1000,
                delay: 1000 + index * 200,
                x: 140 + 30 * index // marginLeft + spaceBetween * index
            });
            return heart;
        });
    }

    createGridCards ()
    {
        // Phaser random array position
        const gridCardNames = Phaser.Utils.Array.Shuffle([...this.cardNames]);

        return gridCardNames.map(
            (name, index) => {
            const newCard = createCard({
                scene: this,
                x: this.gridConfiguration.x + (110 + this.gridConfiguration.paddingX) * (index % 4),
                y: -1000,
                frontTexture: name,
                cardName: name,
                scale:0.25
            });
            this.add.tween({
                targets: newCard.gameObject,
                duration: 800,
                delay: index * 100,
                y: this.gridConfiguration.y + (158 + this.gridConfiguration.paddingY) * Math.floor(index / 4)
            })
            return newCard;
        });
    }

    startGame ()
    { 
        // Start lifes images
        const hearts = this.createHearts(); 
        this.cards = this.createGridCards();


    //NEW

    // WinnerText and GameOverText
    const winnerText = this.add.text(this.sys.game.scale.width / 2, -1000, "YOU WIN",
        { align: "center", strokeThickness: 4, fontSize: 40, fontStyle: "bold", color: "#8c7ae6" }
    ).setOrigin(.5)
        .setDepth(3)
        .setInteractive();

    const gameOverText = this.add.text(this.sys.game.scale.width / 2, -1000,
        "GAME OVER\nClick to restart",
        { align: "center", strokeThickness: 4, fontSize: 40, fontStyle: "bold", color: "#ff0000" }
    )
        .setName("gameOverText")
        .setDepth(3)
        .setOrigin(.5)
        .setInteractive();

    
        // Text events
        winnerText.on(Phaser.Input.Events.POINTER_OVER, () => {
            winnerText.setColor("#FF7F50");
            this.input.setDefaultCursor("pointer");
        });
        winnerText.on(Phaser.Input.Events.POINTER_OUT, () => {
            winnerText.setColor("#8c7ae6");
            this.input.setDefaultCursor("default");
        });
        winnerText.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.add.tween({
                targets: winnerText,
                ease: Phaser.Math.Easing.Bounce.InOut,
                y: -1000,
                onComplete: () => {
                    this.restartGame();
                }
            })
        });
        
        
    // Start canMove
    this.time.addEvent({
        delay: 200 * this.cards.length,
        callback: () => {
            this.canMove = true;
        }
    });


    //
     // Game Logic
     this.input.on(Phaser.Input.Events.POINTER_MOVE, (pointer) => {
        if (this.canMove) {
            const card = this.cards.find(card => card.gameObject.hasFaceAt(pointer.x, pointer.y));
            if (card) {
                this.input.setDefaultCursor("pointer");
            } else {
                this.input.setDefaultCursor("default");
            }
        }
    });

    //
    this.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer) => {
        if (this.canMove && this.cards.length) 
            {
            //find the clicked card
            const card = this.cards.find(card => card.gameObject.hasFaceAt(pointer.x, pointer.y));
            if(card)
            {
                if(Math.random() < 0.5){//TODO : change this
                this.cameras.main.shake(600, 0.01);
                const lastHeart = hearts[hearts.length - 1];
                this.add.tween({
                    targets: lastHeart,
                    ease: Phaser.Math.Easing.Expo.InOut,
                    duration: 1000,
                    y: - 1000,
                    onComplete: () => {
                        lastHeart.destroy();
                        hearts.pop();
                    }
                });
                this.lives -= 1;
                }else {
                    this.add.tween({
                        targets: winnerText,
                        ease: Phaser.Math.Easing.Bounce.Out,
                        y: this.sys.game.scale.height / 2,
                    });
                    this.canMove = false;
                }//

                // Check if the game is over
                if (this.lives === 0) {
                    // Show Game Over text
                    this.add.tween({
                        targets: gameOverText,
                        ease: Phaser.Math.Easing.Bounce.Out,
                        y: this.sys.game.scale.height / 2,
                    });

                    this.canMove = false;
                }

        }
            
        
        }

    })


    gameOverText.on(Phaser.Input.Events.POINTER_OVER, () => {
        gameOverText.setColor("#FF7F50");
        this.input.setDefaultCursor("pointer");
    });

    gameOverText.on(Phaser.Input.Events.POINTER_OUT, () => {
        gameOverText.setColor("#8c7ae6");
        this.input.setDefaultCursor("default");
    });

    gameOverText.on(Phaser.Input.Events.POINTER_DOWN, () => {
        this.add.tween({
            targets: gameOverText,
            ease: Phaser.Math.Easing.Bounce.InOut,
            y: -1000,
            onComplete: () => {
                this.restartGame();
            }
        })
    });

}

}
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
        
        this.add.image(this.gridConfiguration.x - 150, this.gridConfiguration.y - 200, "background").setOrigin(0).setScale(0.6);
        this.createConfigTitleText();
        this.titleText.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.add.tween({
                targets: this.titleText,
                ease: Phaser.Math.Easing.Bounce.InOut,
                y: -1000,
                onComplete: () => {
                    this.startGame();
                }
            });
        });

    }

    createConfigTitleText() {
        this.titleText = this.add.text(this.sys.game.scale.width / 2, this.sys.game.scale.height / 2,
            "Minimalist Game\nClick to Play",
            { align: "center", strokeThickness: 4, fontSize: 40, fontStyle: "bold", color: "#8c7ae6" }
        )
            .setOrigin(.5)
            .setDepth(3)
            .setInteractive();

        this.add.tween({
            targets: this.titleText,
            duration: 800,
            ease: (value) => (value > .8),
            alpha: 0,
            repeat: -1,
            yoyo: true,
        });

        // Text Events
        this.titleText.on(Phaser.Input.Events.POINTER_OVER, () => {
            this.titleText.setColor("#9c88ff");
            this.input.setDefaultCursor("pointer");
        });
        this.titleText.on(Phaser.Input.Events.POINTER_OUT, () => {
            this.titleText.setColor("#8c7ae6");
            this.input.setDefaultCursor("default");
        });
    }

    restartGame ()
    {
        this.cameras.main.fadeOut(200 * this.cards.length);
        
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
        const gridCardNames = Phaser.Utils.Array.Shuffle([...this.cardNames]);
        let cards = gridCardNames.map(
            (name, index) => {
            const newCard = createCard({
                scene: this,
                x: this.gridConfiguration.x + (100 + this.gridConfiguration.paddingX) * (index % 4),
                y: -1000,
                frontTexture: name,
                cardName: name,
                scale:0.3
            });
            this.add.tween({
                targets: newCard.gameObject,
                duration: 800,
                delay: index * 100,
                y: this.gridConfiguration.y + (158 + this.gridConfiguration.paddingY) * Math.floor(index / 4)
            })
            return newCard;
        });
        return cards;
    }

    startGame ()
    { 
        this.hearts = this.createHearts(); 
        this.cards = this.createGridCards();
    }

}
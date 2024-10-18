export class Splash extends Phaser.Scene
{
    constructor()
    {
        super({
            key: 'Splash'
        });
    }

    preload ()
    {
    }

    create ()
    {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.cameras.main.setBackgroundColor(0x3c97a6);

        this.time.delayedCall(1000, () => this.showInstructions(), null, this);
        this.addStartButton();
        this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);
        this.showTitle();
    }

    startGame() {
        this.scene.start("Transition", { name: "STAGE", number: 0 });
      }

      showTitle() {
        this.gameLogo1 = this.add
          .bitmapText(this.center_width - 1000, 100, "mario", "Bloc", 80)
          .setOrigin(0.5)
          .setTint(0xffffff);

          this.gameLogo2 = this.add
          .bitmapText(this.center_width + 1000, 220, "mario", "Escape", 90)
          .setOrigin(0.5)
          .setTint(0xffe066);
    
        this.titleTweens();
      }



      titleTweens() {
        this.tweens.add({
          targets: [this.gameLogo2],
          duration: 1000,
          x: { from: this.gameLogo2.x, to: this.center_width },
          onComplete: () => {
            this.tweens.add({
              targets: [this.gameLogo2],
              duration: 1000,
              x: "-=10",
              repeat: -1,
              ease: "Linear",
            });
          },
        });
        this.tweens.add({
          targets: [this.gameLogo1],
          duration: 1000,
          x: { from: this.gameLogo1.x, to: this.center_width },
          onComplete: () => {
            this.tweens.add({
              targets: [this.gameLogo1],
              duration: 1000,
              x: "+=10",
              repeat: -1,
              ease: "Linear",
            });
          },
        });
      }
 
      addStartButton() {
        this.startButton = this.add
          .bitmapText(this.center_width, 500, "mario", "start", 30)
          .setOrigin(0.5)
          .setTint(0xffe066);
          //.setDropShadow(2, 3, 0x693600, 0.7);
        this.startButton.setInteractive();
        this.startButton.on("pointerdown", () => {
          this.startGame();
        });
    
        this.startButton.on("pointerover", () => {
          this.startButton.setTint(0x3e6875);
        });
    
        this.startButton.on("pointerout", () => {
          this.startButton.setTint(0xffe066);
        });
        this.tweens.add({
          targets: this.space,
          duration: 300,
          alpha: { from: 0, to: 1 },
          repeat: -1,
          yoyo: true,
        });
      }


      showInstructions() {
        this.add
          .sprite(this.center_width - 80, 400, "heart")
          .setOrigin(0.5)
          .setScale(0.5);
        this.add
          .bitmapText(this.center_width + 40, 400, "mario", "Game\n\t Programming \n\t\t  Course", 15)
          .setOrigin(0.5);
    
        this.tweens.add({
          targets: this.space,
          duration: 300,
          alpha: { from: 0, to: 1 },
          repeat: -1,
          yoyo: true,
        });
      }
      
}
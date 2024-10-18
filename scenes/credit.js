export class Credit extends Phaser.Scene
{
    constructor()
    {
        super({
            key: 'Credit'
        });
    }

    preload ()
    {
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0x3c97a6);
        this.addExit();
        this.showTexts();    
    }

    addExit() {
        this.X = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
     }

    showTexts() 
        {
        //if (this.number > 0) return;
                const texts = [
                "Sokoban",
                "Game Programming Course",
                "A. GOuAich",
                "(c) 2024",
                "[x] to exit",
                ];
                texts.forEach((text, i) => {
                this.add
                .bitmapText(300, 425 + 35 * i, "mario", text, 15)
                .setOrigin(0.5)
                .setTint(0xffe066)
                .setDropShadow(1, 2, 0xbf2522, 0.7);
                });
        }

        update(){
            if (Phaser.Input.Keyboard.JustDown(this.X)) {
                this.scene.start("Splash");
            }
        }


    }